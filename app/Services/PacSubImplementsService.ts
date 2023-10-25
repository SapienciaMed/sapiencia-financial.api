import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse,
         IPagingData } from "App/Utils/ApiResponses";

import IPacRepository from '../Repositories/PacRepository';
import { IProjectsRepository } from '../Repositories/ProjectsRepository';
import { IFunctionalProjectRepository } from '../Repositories/FunctionalProjectRepository';
import { IFundsRepository } from '../Repositories/FundsRepository';
import { IPosPreSapienciaRepository } from '../Repositories/PosPreSapienciaRepository';
import { IBudgetsRoutesRepository } from '../Repositories/BudgetsRoutesRepository';
import { IStrategicDirectionService } from './External/StrategicDirectionService';

import { IProjectPaginated,
         ISearchGeneralPac,
         IPac,
         ICreateAssociation,
         IAssociationSuccess} from '../Interfaces/PacInterfaces';
import { IBudgetsRoutesFilters } from '../Interfaces/BudgetsRoutesInterfaces';

import {
  IPacFilters,
  IPacComplementary,
  IPacPrimary,
  IDinamicListForProjects,
  IDinamicListForFunds,
  IDinamicListForPospres
} from '../Interfaces/PacInterfaces';

export default interface IPacSubImplementsService {

  getHellow(): Promise<ApiResponse<string | null>>;
  getUltimateVersion(): Promise<ApiResponse<number | null>>;
  getRoutesByValidity(data: IPacFilters): Promise<ApiResponse<IPagingData<IPacPrimary> | IPacComplementary | null>>;
  searchPacs(data: IPacFilters): Promise<ApiResponse<ISearchGeneralPac[] | null>>;
  listDinamicsAssociations(data: IPacFilters): Promise<ApiResponse<IPacComplementary | null>>;
  createAssociations(data: ICreateAssociation): Promise<ApiResponse<IAssociationSuccess | null>>;

}

export default class PacSubImplementsService implements IPacSubImplementsService {

  constructor(

    private pacRepository: IPacRepository,
    private projectsRepository: IProjectsRepository,
    private functionalProjectRepository: IFunctionalProjectRepository,
    private fundsRepository: IFundsRepository,
    private posPreSapienciaRepository: IPosPreSapienciaRepository,
    private budgetsRoutesRepository: IBudgetsRoutesRepository,
    private strategicDirectionService: IStrategicDirectionService

  ) { }

  async getHellow(): Promise<ApiResponse<string | null>> {

    console.log({ pacRepository: this.pacRepository });
    console.log({ projectsRepository: this.projectsRepository });
    console.log({ functionalProjectRepository: this.functionalProjectRepository });
    console.log({ fundsRepository: this.fundsRepository });
    console.log({ posPreSapienciaRepository: this.posPreSapienciaRepository });
    console.log({ budgetsRoutesRepository: this.budgetsRoutesRepository });
    console.log({ strategicDirectionService: this.strategicDirectionService });

    return new ApiResponse(null, EResponseCodes.INFO, "Se estableció la conexión.");

  }

  async getUltimateVersion(): Promise<ApiResponse<number | null>> {

    const getVersion = await this.pacRepository.getUltimateVersion();

    if (!getVersion || getVersion == null || getVersion == undefined)
      return new ApiResponse(null, EResponseCodes.FAIL, "No se pudo encontrar una versión.");

    const getData: number[] = getVersion as number[];
    const value: number = getData[0];

    return new ApiResponse(value, EResponseCodes.OK, "Última versión.");

  }

  async getRoutesByValidity(data: IPacFilters): Promise<ApiResponse<IPagingData<IPacPrimary> | IPacComplementary | null>> {

    //* Consultamos PACs y traemos los PACs asociados para extraer sus rutas presupuestales.
    const getPacs = await this.pacRepository.searchPacByMultiData(data);

    if (getPacs.array.length <= 0 || !getPacs.array) {

      return new ApiResponse(null, EResponseCodes.FAIL, "No se encontraron PACs ni Rutas Presupuestales con la vigencia, versión y tipo de recursos proporcionados.");

    }

    //* Consultamos la ruta y obtenemos los listados
    let arrayProjects: number[] = [];     // PK -> Vinculation Project
    let arrayFunds: number[] = [];        // PK -> Fund Number
    let arrayPosPreOrg: number[] = [];    // PK -> PosPre Orig Number
    let arrayPosPreSap: number[] = [];    // PK -> PosPre Sapi Number
    let listBudgetsRoutes: number[] = []; // PK -> Rutas Presupuestales

    for (const routes of getPacs.array) {

      listBudgetsRoutes.push(Number(routes?.budgetRouteId));
      const getRoute = await this.budgetsRoutesRepository.getBudgetsRoutesById(Number(routes?.budgetRouteId));

      //* Capturamos los PK -> FK
      arrayProjects.push(getRoute?.idProjectVinculation!);
      arrayFunds.push(getRoute?.idFund!);
      arrayPosPreOrg.push(getRoute?.idBudget!);
      arrayPosPreSap.push(getRoute?.idPospreSapiencia!);

    }

    //* Hallamos los datos requerimos para mostrar lista
    let listProjects: IDinamicListForProjects[] = [];
    let listFunds: IDinamicListForFunds[] = [];
    let listPospreSapi: IDinamicListForPospres[] = [];

    //* Organizo los Fondos
    for (const fund of arrayFunds) {

      const getFund = await this.fundsRepository.getFundsById(fund);

      if (getFund!.id === fund) {

        const myObjForProjectList: IDinamicListForFunds = {
          idFund: getFund!.id,
          fundCode: getFund!.number
        }

        listFunds.push(myObjForProjectList)

      }

    }

    //! Para eliminar elementos repetidos del array resultado
    let hash = {};
    listFunds = listFunds.filter(function (current: IDinamicListForFunds) {
      let exists = !hash[current.idFund];
      hash[current.idFund] = true;
      return exists;
    });

    //* Organizo la información de los pospre
    for (const psap of arrayPosPreSap) {

      const getPosPreSapi = await this.posPreSapienciaRepository.getPosPreSapienciaById(psap);

      if (getPosPreSapi!.id === psap) {

        const myObjForProjectList: IDinamicListForPospres = {

          idPosPreSapi: Number(getPosPreSapi?.id),
          numberCodeSapi: getPosPreSapi?.number?.toString()!,
          descriptionSapi: getPosPreSapi?.description?.toString()!,
          idPosPreOrig: Number(getPosPreSapi?.budgetId),
          numberCodeOrig: getPosPreSapi?.budget?.number?.toString()!

        }

        listPospreSapi.push(myObjForProjectList);

      }

    }

    //! Para eliminar elementos repetidos del array resultado
    let dash = {};
    listPospreSapi = listPospreSapi.filter(function (current: IDinamicListForPospres) {
      let exists = !dash[current.idPosPreSapi];
      dash[current.idPosPreSapi] = true;
      return exists;
    });

    //* Organizo los proyectos
    //? Re Ajustamos para que nos tome tanto los de Funcionamiento como de Inversión
    let contForFunctionalProj: number = 0;
    for (const proj of arrayProjects) {

      const vinculationPK = Number(proj);
      let projectFunctionalName: string = "";

      const getVinculation = await this.projectsRepository.getProjectById(vinculationPK);

      //Debo verificar si es un proyecto de funcionamiento
      if (getVinculation?.operationProjectId && getVinculation?.operationProjectId != null) {

        projectFunctionalName = listPospreSapi[contForFunctionalProj].descriptionSapi;

        const myObjForProjectList: IDinamicListForProjects = {

          idVinculation: vinculationPK,
          idProjectPlanning: getVinculation.id,
          projectCode: "9000000",
          posPreSapiRef: listPospreSapi[contForFunctionalProj].numberCodeSapi,
          projectName: projectFunctionalName

        }

        listProjects.push(myObjForProjectList);

      }

      contForFunctionalProj++;
      const pkInvestmentProject: number = Number(getVinculation!.investmentProjectId);

      const filters: IProjectPaginated = {
        page: 1,
        perPage: 10000,
      }

      //Traemos por default lo que viene en la API para dibujar porque por lo general viene datos aquí
      const getProjectPlanning = await this.strategicDirectionService.getProjectInvestmentPaginated(filters);

      //Ahora consultamos respecto a la API y paneamos la data:
      for (const xProjPlanning of getProjectPlanning.data.array) {

        if (xProjPlanning.id === pkInvestmentProject) {

          const myObjForProjectList: IDinamicListForProjects = {

            idVinculation: vinculationPK,
            idProjectPlanning: pkInvestmentProject,
            projectCode: xProjPlanning.projectCode,
            projectName: xProjPlanning.name

          }

          listProjects.push(myObjForProjectList);

        }

      }

    }

    //! Para eliminar elementos repetidos del array resultado
    let bash = {};
    listProjects = listProjects.filter(function (current: IDinamicListForProjects) {
      let exists = !bash[current.idVinculation];
      bash[current.idVinculation] = true;
      return exists;
    });

    //? Organizamos objeto final
    const trasactionResult: IPacComplementary = {

      listBudgetsRoutes: listBudgetsRoutes,
      listProjects: listProjects,
      listFunds: listFunds,
      listPospreSapi: listPospreSapi

    }

    return new ApiResponse(trasactionResult, EResponseCodes.OK, "Se obtiene el listado de información.");

  }

  async searchPacs(data: IPacFilters): Promise<ApiResponse<ISearchGeneralPac[] | IPac[] | null | any>> {

    const { page, //Debe llegar obligatorio
            perPage, //Debe llegar obligatorio
            exercise, //Debe llegar obligatorio
            version, //Debe llegar obligatorio
            resourceType, //Debe llegar obligatorio
            idProjectVinculation,
            idBudget,
            idPospreSapiencia,
            idFund
          } = data;

    let resultTransaction: ISearchGeneralPac[] = [];
    let getPac: IPagingData<IPac | null>;

    //? ***********************************************************************************************
    //? Primero debemos verificar si buscaré respecto a la ruta o si será un agrupador PAC
    //? de lo contrario, buscaremos a nivel de ruta que sería la otra opción si llega los datos
    //? ***********************************************************************************************
    if (!idProjectVinculation || idProjectVinculation == null || idProjectVinculation == undefined ||
        !idFund || idFund == null || idFund == undefined ||
        !idBudget || idBudget == null || idBudget == undefined ||
        !idPospreSapiencia || idPospreSapiencia == null || idPospreSapiencia == undefined) {

      //* Busquemos PAC con la vigencia, tipo de recurso y versión.
      getPac = await this.pacRepository
                         .getPacByRouteAndExercise(Number(0),
                                                   Number(exercise),
                                                   Number(version),
                                                   resourceType?.toString()!,
                                                   Number(page),
                                                   Number(perPage));

      if (!getPac || getPac == null || getPac == undefined)
        return new ApiResponse(null, EResponseCodes.FAIL, "No se pudo obtener pacs con la información dada.");

    } else {

      //* EN ESTE PUNTO ES PORQUE TENGO LO MÍNIMO PARA REALIZAR LA BÚSQUEDA DE RUTA Y POSTERIOR PAC
      //TODO: Generar una HU si se requiere buscar por distintivos (Solo proyecto, solo fondo o solo pospres)
      const getRoute = await this.budgetsRoutesRepository
                                 .getBudgetForAdditions(Number(idProjectVinculation),
                                                        Number(idFund),
                                                        Number(idBudget),
                                                        Number(idPospreSapiencia));

      if (!getRoute || getRoute == null || getRoute == undefined)
        return new ApiResponse(null, EResponseCodes.FAIL, "No se pudo obtener la ruta presupuestal con los datos dados.");

      //* Busquemos PAC con la ruta junto con la vigencia, tipo de recurso y versión.
      getPac = await this.pacRepository
                         .getPacByRouteAndExercise(Number(getRoute.id),
                                                   Number(exercise),
                                                   Number(version),
                                                   resourceType?.toString()!,
                                                   Number(page),
                                                   Number(perPage));

      if (!getPac || getPac == null || getPac == undefined)
        return new ApiResponse(null, EResponseCodes.FAIL, "No se pudo obtener el pac con la ruta presupuestal obtenido y data dada.");

    }

    //? ***********************************************************************************************
    //? Si llegamos hasta aquí, calculamos los totales y porcentajes
    //? ***********************************************************************************************
    for (const pac of getPac.array) {

      let sapienciaBudget: number = 0;
      let sapienciaCollected: number = 0;

      //* Obtenga la ruta simplificada con la data
      const filtersByRoute: IBudgetsRoutesFilters = {
        page: 1,
        perPage: 100000,
        idRoute: Number(pac?.budgetRouteId)
      }; //Solo debería traer 1.

      const getRouteById = await this.budgetsRoutesRepository.getBudgetsRoutesPaginated(filtersByRoute);

      if (!getRouteById || getRouteById == null || getRouteById == undefined)
        return new ApiResponse(null, EResponseCodes.FAIL, "Cuando ibamos a calcular el total sapiencia y porcentajes no se halló la ruta presupuestal, transacción cancelada.");

      //* Obtengamos proyecto simplificado
      const getNameProject: ApiResponse<string | null> = await this.getProjectByResource(getRouteById.array[0].idProjectVinculation, getRouteById.array[0].idPospreSapiencia);

      //* Obtengamos fondo simplificado
      const getFundNumber: string = getRouteById.array[0].fund?.number!;

      //* Obtengamos pospre sapi simplificado
      const getPosPreSapiNumber: string = getRouteById.array[0].pospreSapiencia?.number!;

      //* Datos adicionales:
      const idBudgetRoute: number = getRouteById.array[0].id!;
      const idPac: number = getPac.array[0]?.id!;
      const getPosPreOrigNumber: string = getRouteById.array[0].budget?.number!;

      //* Procesamiento para cálculos de anualización
      let band: boolean = false;
      let totalProgramming: number = 0;
      let totalCollected: number = 0;

      for (const annualizations of pac?.pacAnnualizations!) {

        if (!band) {

          totalProgramming =
            Number(annualizations.jan) + Number(annualizations.feb) + Number(annualizations.mar) +
            Number(annualizations.abr) + Number(annualizations.may) + Number(annualizations.jun) +
            Number(annualizations.jul) + Number(annualizations.ago) + Number(annualizations.sep) +
            Number(annualizations.oct) + Number(annualizations.nov) + Number(annualizations.dec);

          sapienciaBudget += totalProgramming;
          band = true;

        } else {

          totalCollected =
            Number(annualizations.jan) + Number(annualizations.feb) + Number(annualizations.mar) +
            Number(annualizations.abr) + Number(annualizations.may) + Number(annualizations.jun) +
            Number(annualizations.jul) + Number(annualizations.ago) + Number(annualizations.sep) +
            Number(annualizations.oct) + Number(annualizations.nov) + Number(annualizations.dec);

          sapienciaCollected += totalCollected;

        }

      }

      //? Llenamos el objeto respuesta
      const percentTransform: number = Number(((100 * sapienciaCollected) / sapienciaBudget).toFixed(2));

      const objResult: ISearchGeneralPac = {

        projectName: getNameProject.data?.toString()!,
        numberFund: getFundNumber,
        posPreSapi: getPosPreSapiNumber,
        budgetSapi: sapienciaBudget,
        budgetCollected: sapienciaCollected,
        percentExecute: percentTransform,
        pacId: idPac,
        routeId: idBudgetRoute,
        posPreOrig: getPosPreOrigNumber,

      }

      resultTransaction.push(objResult);
      pac!.dataCondensed = objResult;
      delete pac!.isActive;
      delete pac!.dateModify;
      delete pac!.dateCreate;
      delete pac!.pacAnnualizations;

    }

    if (resultTransaction.length == 0 ||
      !resultTransaction ||
      resultTransaction == null ||
      resultTransaction == undefined) {

      return new ApiResponse(null, EResponseCodes.FAIL, "Los datos proporcionados no me traen ningún PAC");

    }

    return new ApiResponse(getPac, EResponseCodes.OK, "Obteniendo los datos");

  }

  async getProjectByResource(idProject: number, idPosPreSapi: number): Promise<ApiResponse<string | null>> {

    let projectNameResult: string = "";
    const filtersByPlanning = { page: 1, perPage: 100000 };
    const getProjectPlanning = await this.strategicDirectionService.getProjectInvestmentPaginated(filtersByPlanning);

    if (!getProjectPlanning || getProjectPlanning == null || getProjectPlanning == undefined)
      return new ApiResponse(null, EResponseCodes.FAIL, "No se pudieron obtener los proyectos de planeación.");

    const getVinculation = await this.projectsRepository.getProjectById(idProject);

    if (!getVinculation || getVinculation == null || getVinculation == undefined)
      return new ApiResponse(null, EResponseCodes.FAIL, "No se pudo obtener el proyecto de vinculación con el ID dado.");

    //Debo verificar si es un proyecto de funcionamiento, si es así, debo asociar al pospre sapi, de lo contrario, el de la API.
    if (getVinculation?.operationProjectId && getVinculation?.operationProjectId != null) {

      const getPosPreSapi = await this.posPreSapienciaRepository.getPosPreSapienciaById(idPosPreSapi);
      projectNameResult = getPosPreSapi?.description!;

    } else {

      const pkInvestmentProject: number = Number(getVinculation!.investmentProjectId);
      for (const projPlanningApi of getProjectPlanning.data.array) {

        if (projPlanningApi.id === pkInvestmentProject) {

          projectNameResult = projPlanningApi.name;

        }

      }

    }

    return new ApiResponse(projectNameResult, EResponseCodes.OK, "Nombre de Proyecto Obtenido");

  }

  async listDinamicsAssociations(data: IPacFilters): Promise<ApiResponse<IPacComplementary | null>> {

    let candidatesRoutes: number[] = [];
    let bandPosPreOk: boolean = true;
    let listFunds: IDinamicListForFunds[] = [];
    let listPospreSapi: IDinamicListForPospres[] = [];
    let listProjects: IDinamicListForProjects[] = [];

    let filtersByPlanning = { page: 1, perPage: 100000 };
    let getProjectPlanning = await this.strategicDirectionService.getProjectInvestmentPaginated(filtersByPlanning);

    if (!getProjectPlanning || getProjectPlanning == null || getProjectPlanning == undefined)
      return new ApiResponse(null, EResponseCodes.FAIL, "No se pudieron obtener los proyectos de planeación.");

    //* Vamos a buscar las rutas cuyas vigencias pospre me den la vigencia actual y posteriormente busco las rutas que se asocien
    //? Búsqueda invertida.
    const getPosPreSapiCandidates = await this.posPreSapienciaRepository.getPosPreSapiSpcifyExercise(Number(data.exercise));

    if( !getPosPreSapiCandidates || getPosPreSapiCandidates.length <= 0 || getPosPreSapiCandidates == undefined )
      return new ApiResponse(null, EResponseCodes.FAIL, "No se encontraron rutas presupuestales que cumplan con el criterio de vigencia");

    for (const p of getPosPreSapiCandidates) {

      const getRoute = await this.budgetsRoutesRepository.getBudgetsSpcifyExerciseWithPosPreSapi(Number(p.id));

      //Solo llenamos el array de rutas candidatas si encontramos referencias
      //? pues pueden existir pospres que aún no están asociadas a una ruta presupuestal.
      if( !getRoute || getRoute.length <= 0 || getRoute == undefined ){

        bandPosPreOk = false;
        console.log(`No se encontró ruta presupuestal con PosPreSapi: ${p.number} ... Validador Consola: ${bandPosPreOk}`);

      }else{

        for (const r of getRoute) {

          //* Lleno lista para fondos
          const objForFunds: IDinamicListForFunds = {
            idFund: r.fund?.id!,
            fundCode: r.fund?.number!
          }
          listFunds.push( objForFunds );

          //* Lleno lista para pospre sapiencia y pospre origen
          const objForPospre: IDinamicListForPospres = {
            idPosPreSapi : Number(r.pospreSapiencia?.id!),
            numberCodeSapi : r.pospreSapiencia?.number!,
            descriptionSapi : r.pospreSapiencia?.description!,
            idPosPreOrig : Number(r.budget?.id!),
            numberCodeOrig : r.budget?.number!
          }

          listPospreSapi.push( objForPospre );

          //* Lleno lista para proyectos
          //* También extraeré Área Funcional (El preload anidado tiene errores -)
          const getFunctionalArea = await this.projectsRepository.getProjectById(Number(r.idProjectVinculation));
          if( !getFunctionalArea || getFunctionalArea == undefined )
            return new ApiResponse(null, EResponseCodes.FAIL, "No se encontraron áreas funcionales para algunos proyectos");

          if (r.projectVinculation?.operationProjectId && r.projectVinculation?.operationProjectId != null) {

            const objForProjec: IDinamicListForProjects = {
              idVinculation: r.idProjectVinculation,
              idProjectPlanning : null,
              idProjectFunctional: r.projectVinculation.operationProjectId,
              projectCode : "9000000",
              projectName : r.pospreSapiencia?.description!,
              idFunctionalArea : getFunctionalArea.areaFuntional?.id,
              numberFunctionalArea : getFunctionalArea.areaFuntional?.number,
              posPreSapiRef : r.pospreSapiencia?.number!,
              posPreSapiRefId : r.pospreSapiencia?.id!,
            }

            listProjects.push( objForProjec );

          }else{

            const pkInvestmentProject: number = Number(r.projectVinculation!.investmentProjectId);
            for (const projPlanning of getProjectPlanning.data.array){

              if (projPlanning.id === pkInvestmentProject){

                const objForProjec: IDinamicListForProjects = {
                  idVinculation : r.idProjectVinculation,
                  idProjectPlanning : projPlanning.id,
                  idProjectFunctional : null,
                  projectCode : projPlanning.projectCode,
                  projectName : projPlanning.name,
                  idFunctionalArea : getFunctionalArea.areaFuntional?.id,
                  numberFunctionalArea : getFunctionalArea.areaFuntional?.number,
                  posPreSapiRef : null,
                  posPreSapiRefId : null
                }

                listProjects.push( objForProjec );

              }

            }

          }

        }

        candidatesRoutes.push( Number(p.id) );
      }

    }

    //! **********************************************************
    //! Para eliminar elementos repetidos de los array resultado
    //! **********************************************************
    let bash = {};
    listFunds = listFunds.filter(function (current: IDinamicListForFunds) {
      let exists = !bash[current.idFund];
      bash[current.idFund] = true;
      return exists;
    });

    let dash = {};
    listPospreSapi = listPospreSapi.filter(function (current: IDinamicListForPospres) {
      let exists = !dash[current.idPosPreSapi];
      dash[current.idPosPreSapi] = true;
      return exists;
    });

    let rash = {};
    listProjects = listProjects.filter(function (current: IDinamicListForProjects) {
      let exists = !rash[current.idVinculation];
      rash[current.idVinculation] = true;
      return exists;
    });

    const objResult: IPacComplementary = {

      candidatesRoutes,
      listFunds,
      listPospreSapi,
      listProjects

    }

    return new ApiResponse(objResult, EResponseCodes.OK, "Listado de opciones generado exitosamente.");

  }

  async createAssociations(data: ICreateAssociation): Promise<ApiResponse<IAssociationSuccess | null>> {

    //* 1. Con los datos proporcionados busquemos la ruta:
    const getRoute = await this.budgetsRoutesRepository
                               .getBudgetForAdditions(data.idProjectVinculation!,
                                                      data.idFund!,
                                                      data.idBudget!,
                                                      data.idPospreSapiencia!);

    if( !getRoute || getRoute == null || getRoute == undefined )
      return new ApiResponse(null, EResponseCodes.FAIL, "No se encontró ninguna ruta presupuestal con la información proporcionada");

    //* 2. Buscamos si la ruta está asociada a algún PAC con esa vigencia y el tipo de recurso
    const filtersWithRoute: IPacFilters = { //Para buscar la ruta respecto al PAC
      page: 1,
      perPage: 1000000,
      exercise: data.exercise,
      resourceType: data.resourceType,
      route: getRoute.id
    }

    const filtersNoRoute: IPacFilters = { //Para sacar la versión
      page: 1,
      perPage: 1000000,
      exercise: data.exercise,
      resourceType: data.resourceType
    }

    const getPacReferenceWithRoute = await this.pacRepository.searchPacByMultiData( filtersWithRoute );
    const getPacReferenceNoRoute = await this.pacRepository.searchPacByMultiData( filtersNoRoute );
    const version: number | undefined = getPacReferenceNoRoute.array[0]?.version;

    // console.log(data.exercise);
    // console.log(data.resourceType);
    // console.log(getPacReferenceWithRoute.array);
    // console.log(getPacReferenceNoRoute.array);
    // console.log(getRoute.id);
    // console.log(version);

    if( getPacReferenceWithRoute.array.length > 0)
      return new ApiResponse(null, EResponseCodes.FAIL, "Ya está asociada esta ruta al PAC");

    //* 3. Si vamos por acá, pasó la validación de igualdad
    //*    procedo a validar que el presupuesto sapiencia me de igual al programado
    let plusProgramming: number =
      Number(data.annualization!.jan) + Number(data.annualization!.feb) + Number(data.annualization!.mar) +
      Number(data.annualization!.abr) + Number(data.annualization!.may) + Number(data.annualization!.jun) +
      Number(data.annualization!.jul) + Number(data.annualization!.ago) + Number(data.annualization!.sep) +
      Number(data.annualization!.oct) + Number(data.annualization!.nov) + Number(data.annualization!.dec);

    if( data.budgetSapiencia !== plusProgramming )
      return new ApiResponse(null, EResponseCodes.FAIL, "El valor del presupuesto es diferente de la suma de todos los programados");

    //TODO: Falta validación contra saldo de la ruta presupuestal y presupuesto sapiencia
    //TODO: Esperando la definición de la HU

    //* 5. Guardar
    const objInsertPac: ICreateAssociation = {
      exercise: data.exercise,
      resourceType: data.resourceType,
      route: getRoute.id,
      version: version
    }

    const savePac = await this.pacRepository.createAssociations(objInsertPac);
    if( !savePac || savePac == null || savePac == undefined )
      return new ApiResponse(null, EResponseCodes.FAIL, "No fue posible asociar el PAC");

    console.log(data.annualization?.type);
    console.log(data.resourceType);


    const objInsertAnnualization: ICreateAssociation = {
      pacId : savePac.id,
      type : data.annualization?.type,
      annualization : data.annualization
    }

    const saveAnnualization = await this.pacRepository.createAnnualizations(objInsertAnnualization);
    if( !saveAnnualization || saveAnnualization == null || saveAnnualization == undefined )
      return new ApiResponse(null, EResponseCodes.FAIL, "No fue posible asociar las anualizaciones del PAC");

    const objResult: IAssociationSuccess = {
      Pac : savePac,
      PacAnnualization : saveAnnualization,
    }

    return new ApiResponse(objResult, EResponseCodes.OK, "¡Guardado exitosamente!");

  }


}
