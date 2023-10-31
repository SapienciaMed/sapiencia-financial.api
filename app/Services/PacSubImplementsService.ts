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
import { IResultSearchDinamicPac, IEditPac, IPacAnnualization, IResultEditPac } from '../Interfaces/PacInterfaces';
import { DataTransferPac,
         IDestinity,
         IStructureResponseTransferGlobalOriginals,
         IStructureResponseTransferGenericOriginis,
         IStructureResponseTransferGenericDestinities,
         IStructureResponseTransferGlobalDestinities,
         IPartialObjectResultTransferGeneric} from '../Interfaces/PacTransferInterface';

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
  getUltimateVersion(data: IPacFilters): Promise<ApiResponse<number | null>>;
  getRoutesByValidity(data: IPacFilters): Promise<ApiResponse<IPagingData<IPacPrimary> | IPacComplementary | null>>;
  searchPacs(data: IPacFilters): Promise<ApiResponse<ISearchGeneralPac[] | null>>;
  listDinamicsAssociations(data: IPacFilters): Promise<ApiResponse<IPacComplementary | null>>;
  createAssociations(data: ICreateAssociation): Promise<ApiResponse<IAssociationSuccess | null>>;
  getPacById(id: number): Promise<ApiResponse<IPac | any | null>>;
  transferPacRefactory(data: DataTransferPac): Promise<ApiResponse<DataTransferPac | IPartialObjectResultTransferGeneric | null>>;
  editPac(data: IEditPac): Promise<ApiResponse<IEditPac | IResultEditPac | null>>;

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

  async getUltimateVersion(data: IPacFilters): Promise<ApiResponse<number | null>> {

    const getVersion = await this.pacRepository.getUltimateVersion(data);

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

      return new ApiResponse(null, EResponseCodes.FAIL, "No hay resultado para la búsqueda");

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

  async getPacById(id: number): Promise<ApiResponse<IPac | IResultSearchDinamicPac | null>> {

    let filtersByPlanning = { page: 1, perPage: 100000 };
    let getProjectPlanning = await this.strategicDirectionService.getProjectInvestmentPaginated(filtersByPlanning);
    if( !getProjectPlanning || getProjectPlanning.data == null || getProjectPlanning.data == undefined)
      return new ApiResponse(null, EResponseCodes.FAIL, `Ocurrió un error al intentar consultar planeación, no pudimos obtener proyectos`);

    const getPac = await this.pacRepository.getPacById( id );
    if( !getPac || getPac.array.length <= 0 )
      return new ApiResponse(null, EResponseCodes.FAIL, `Ocurrió un error al intentar obtener el PAC con ID ${id}`);

      const filter: IBudgetsRoutesFilters = {
        page: 1,
        perPage: 100000,
        idRoute: Number(getPac.array[0]?.budgetRouteId)
      }

      const getRoute = await this.budgetsRoutesRepository.getBudgetsRoutesPaginated( filter );

      let managementCenter: string = "";

      let fundNumber: string = "";
      let fundId: number = 0;

      let posPreSapiDescription: string = "";
      let posPreSapiNumber: string = "";
      let posPreSapiId: number = 0;
      let posPreOrigNumber: string = "";
      let posPreOrigId: number = 0;

      let projectVinculationId: number = 0;
      let projectPlanningId: number = 0;
      let projectCode: string = "";
      let projectName: string = "";
      let functionalAreaId: number = 0;
      let functionalAreaNumber: string = "";

      if( getRoute && getRoute.array.length > 0 && getRoute != null ){

        managementCenter = getRoute.array[0].managementCenter;

        fundNumber = getRoute.array[0].fund?.number!;
        fundId = getRoute.array[0].fund?.id!;

        posPreSapiDescription = getRoute.array[0].pospreSapiencia?.description!;
        posPreSapiNumber = getRoute.array[0].pospreSapiencia?.number!;
        posPreSapiId = getRoute.array[0].pospreSapiencia?.id!;
        posPreOrigNumber = getRoute.array[0].budget?.number!;
        posPreOrigId = getRoute.array[0].budget?.id!;

        const pkInvestmentProject: number = Number(getRoute.array[0].projectVinculation!.investmentProjectId);
        const getFunctionalArea = await this.projectsRepository.getProjectById(Number(getRoute.array[0].idProjectVinculation));

        if (getRoute.array[0].projectVinculation?.operationProjectId && getRoute.array[0].projectVinculation?.operationProjectId != null){

          projectVinculationId = Number(getRoute.array[0].idProjectVinculation);
          projectPlanningId = 0;
          projectCode = "9000000";
          projectName = posPreSapiDescription;
          functionalAreaId = Number(getFunctionalArea!.areaFuntional?.id);
          functionalAreaNumber = getFunctionalArea!.areaFuntional?.number!;

        }else{

          for (const projPlanning of getProjectPlanning.data.array){

            if (projPlanning.id === pkInvestmentProject){

              projectVinculationId = Number(getRoute.array[0].idProjectVinculation);
              projectPlanningId = Number(getRoute.array[0].projectVinculation?.investmentProjectId);
              projectCode = projPlanning.projectCode;
              projectName = projPlanning.name;
              functionalAreaId = Number(getFunctionalArea!.areaFuntional?.id);
              functionalAreaNumber = getFunctionalArea!.areaFuntional?.number!;

            }

          }

        }

      }else{

        return new ApiResponse(null, EResponseCodes.FAIL, `Ocurrió un error al intentar obtener la información de la ruta presupuestal`);

      }

      const totalProgramming: number =
            Number(getPac.array[0]?.pacAnnualizations![0].jan) + Number(getPac.array[0]?.pacAnnualizations![0].feb) +
            Number(getPac.array[0]?.pacAnnualizations![0].mar) + Number(getPac.array[0]?.pacAnnualizations![0].abr) +
            Number(getPac.array[0]?.pacAnnualizations![0].may) + Number(getPac.array[0]?.pacAnnualizations![0].jun) +
            Number(getPac.array[0]?.pacAnnualizations![0].jul) + Number(getPac.array[0]?.pacAnnualizations![0].ago) +
            Number(getPac.array[0]?.pacAnnualizations![0].sep) + Number(getPac.array[0]?.pacAnnualizations![0].oct) +
            Number(getPac.array[0]?.pacAnnualizations![0].nov) + Number(getPac.array[0]?.pacAnnualizations![0].dec);

      const totalCollected: number =
            Number(getPac.array[0]?.pacAnnualizations![1].jan) + Number(getPac.array[0]?.pacAnnualizations![1].feb) +
            Number(getPac.array[0]?.pacAnnualizations![1].mar) + Number(getPac.array[0]?.pacAnnualizations![1].abr) +
            Number(getPac.array[0]?.pacAnnualizations![1].may) + Number(getPac.array[0]?.pacAnnualizations![1].jun) +
            Number(getPac.array[0]?.pacAnnualizations![1].jul) + Number(getPac.array[0]?.pacAnnualizations![1].ago) +
            Number(getPac.array[0]?.pacAnnualizations![1].sep) + Number(getPac.array[0]?.pacAnnualizations![1].oct) +
            Number(getPac.array[0]?.pacAnnualizations![1].nov) + Number(getPac.array[0]?.pacAnnualizations![1].dec);

      const objResult: IResultSearchDinamicPac = {

        resultPac: getPac.array[0],
        totalsPac: {
          totalProgramming,
          totalCollected
        },
        resultRoute: {
          managementCenter,
          fundNumber,
          fundId,
          posPreSapiDescription,
          posPreSapiNumber,
          posPreSapiId,
          posPreOrigNumber,
          posPreOrigId,
          projectVinculationId,
          projectPlanningId,
          projectCode,
          projectName,
          functionalAreaId,
          functionalAreaNumber
        }

      }

    return new ApiResponse(objResult, EResponseCodes.OK, "Hemos obtenido un PAC");

  }

  async editPac(data: IEditPac): Promise<ApiResponse<IEditPac | IResultEditPac | null>> {

    const getIdRoute: number = Number(data.budgetRouteId);
    const budgetSapi: number = Number(data.budgetSapiencia) | 0;

    const annualProgramming: IPacAnnualization = data.annProgrammingPac!;
    const annualCollected: IPacAnnualization = data.annCollectyerPac!;

    //* Obtengamos la ruta y el saldo:
    const getRoute = await this.budgetsRoutesRepository.getBudgetsRoutesById(getIdRoute);
    if( !getRoute || getRoute == null || getRoute == undefined )
      return new ApiResponse(null, EResponseCodes.FAIL, "Ocurrió un error al intentar hallar la ruta presupuestal");

    const balanceRoute: number = Number(getRoute.balance);
    const plusProgramming: number = Number(annualProgramming.jan) + Number(annualProgramming.feb) + Number(annualProgramming.mar) + Number(annualProgramming.abr) +
                                    Number(annualProgramming.may) + Number(annualProgramming.jun) + Number(annualProgramming.jul) + Number(annualProgramming.ago) +
                                    Number(annualProgramming.sep) + Number(annualProgramming.oct) + Number(annualProgramming.nov) + Number(annualProgramming.dec);

    const plusCollected: number = Number(annualCollected.jan) + Number(annualCollected.feb) + Number(annualCollected.mar) + Number(annualCollected.abr) +
                                  Number(annualCollected.may) + Number(annualCollected.jun) + Number(annualCollected.jul) + Number(annualCollected.ago) +
                                  Number(annualCollected.sep) + Number(annualCollected.oct) + Number(annualCollected.nov) + Number(annualCollected.dec);

    console.log({type : data.pacType});
    if( data.pacType == "Programado" || data.pacType == "Ambos" ){

      console.log({plusProgramming});
      console.log({balanceRoute});

      //* Escenario 4
      if( plusProgramming !== budgetSapi )
        return new ApiResponse(null, EResponseCodes.FAIL, "El valor del presupuesto es diferente de la suma de todos los programados");

      //* Escenario 6
      if( plusProgramming !== balanceRoute )
        return new ApiResponse(null, EResponseCodes.FAIL, "El valor del presupuesto sapiencia es diferente al valor del presupuesto");

      //* Escenario 5 (Por si caemos en el ambos)
      if( plusProgramming < plusCollected )
        return new ApiResponse(null, EResponseCodes.FAIL, "El valor del presupuesto es menor al valor recaudado");

    }

    if( data.pacType == "Recaudado" || data.pacType == "Ambos" ){

      console.log({plusProgramming});
      console.log({balanceRoute});

      //* Escenario 5
      if( plusProgramming < plusCollected )
        return new ApiResponse(null, EResponseCodes.FAIL, "El valor del presupuesto es menor al valor recaudado");

      //* Escenario 4 (Por si caemos en el ambos)
      if( plusProgramming !== budgetSapi )
        return new ApiResponse(null, EResponseCodes.FAIL, "El valor del presupuesto es diferente de la suma de todos los programados");

      //* Escenario 6 (Por si caemos en el ambos)
      if( plusProgramming !== balanceRoute )
        return new ApiResponse(null, EResponseCodes.FAIL, "El valor del presupuesto sapiencia es diferente al valor del presupuesto");

    }

    //? Realizamos la actualización
    const update = await this.pacRepository.updatePac(data);

    return new ApiResponse(update, EResponseCodes.OK, "¡Guardado exitosamente!");

  }


  //? ========================================================================== ?//
  //? ========================================================================== ?//
  //? ========================================================================== ?//
  //* *********************** REFACTORIZACIÓN TRASLADOS' *********************** *//
  //? ========================================================================== ?//
  //? ========================================================================== ?//
  //? ========================================================================== ?//

  async transferPacRefactory(data: DataTransferPac): Promise<ApiResponse<DataTransferPac | IPartialObjectResultTransferGeneric | null>> {

    /**
     //? Vamos a realizar todos los cálculos primero antes de ir al procesamiento de validación
     //- Fragmentaremos las validaciones en dos momentos:
     //*** 1. Sacar toda la información de lo que viene en [{}] origen y destino.
     //*** 2. Extraer el saldo de lo que viene en la ruta en [{}] de origen y destino.
     //*** 3. Vamos a hacer los cálculos completos, es decir, si estoy programado entonces también haré
     //***    los cálculos de recaudado y viseversa, los datos perfectamente deben cuadrar para ambos mundos
     //***    aún si solo estámos moviendo uno, esto con la finalidad de contenmplar todas las validaciones
     //***    y adicionalmente tener ajustado el escenario de AMBOS mixto a programado y recaudo */

    /**1. Obtengo toda la información que requiero: */
    const getDataProccessOrigins: ApiResponse<IStructureResponseTransferGenericOriginis | null> = await this.calculatedInformationByOrigins(data);
    if( !getDataProccessOrigins || getDataProccessOrigins == null || getDataProccessOrigins == undefined )
      return new ApiResponse(null, EResponseCodes.FAIL, `Ocurrió un error al realizar los cálculos de información de origen, error: ${getDataProccessOrigins}`);

    const getDataProccessDestinities: ApiResponse<IStructureResponseTransferGenericDestinities | null> = await this.calculatedInformationByDestinities(data);
    if( !getDataProccessDestinities || getDataProccessDestinities == null || getDataProccessDestinities == undefined )
      return new ApiResponse(null, EResponseCodes.FAIL, `Ocurrió un error al realizar los cálculos de información de la transferencia, error: ${getDataProccessDestinities}`);

    /**2. Validaciones: */

    //! ************************** ************************* ************************* !//
    //! *** ************************* PROGRAMADO O AMBOS ************************* *** !//
    //! ************************** ************************* ************************* !//

    if( data.headTransfer.pacType === "Programado" || data.headTransfer.pacType === "Ambos" ){

      console.log("********* ENTRAMOS POR PROGRAMADO O AMBOS *********");

      //? VALIDACIÓN 1 y 2 - Se solapan con la VALIDACIÓN 4 Y 6.
      //* Para calcular a nivel de programado y recaudo(por si sale la opción ambos)
      let totalOriginisOriginalProgramming: number = 0;
      let totalOriginisTransferProgramming: number = 0;
      let totalDestinitiesOriginalProgramming: number = 0;
      let totalDestinitiesTransferProgramming: number = 0;

      let totalOriginisOriginalCollected: number = 0;
      let totalOriginisTransferCollected: number = 0;
      let totalDestinitiesOriginalCollected: number = 0;
      let totalDestinitiesTransferCollected: number = 0;

      //1.1. Origenes
      for (let i = 0; i < getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal.length! ; i++) {

        totalOriginisOriginalProgramming += getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalTotalProgramming!;
        totalOriginisOriginalCollected   += getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalTotalCollected!;

        totalOriginisTransferProgramming += getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming!;
        totalOriginisTransferCollected   += getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected!;

        //* Validación del escenario 3
        if( getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming! !==
            getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalBalanceRoute ) {

            console.log("El valor del presupuesto sapiencia es diferente al valor del presupuesto");
            console.log(`El total programado de la transferencia de la ruta ${getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalBudgetRouteId} me está dando ${getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming!} pero su saldo de ruta me está dando ${getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalBalanceRoute}`);

            const objPartialResult: IPartialObjectResultTransferGeneric = {
              getDataProccessOrigins: getDataProccessOrigins.data,
              getDataProccessDestinities: getDataProccessDestinities.data
            }
            return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "El valor del presupuesto sapiencia es diferente al valor del presupuesto");

        }

        //* Validación del escenario 7
        //Por si se nos va por el AMBOS
        if( getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected! >
          getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming!) {

            console.log("El recaudo es mayor al presupuesto sapiencia del PAC");
            console.log(`El total recaudado para la ruta ${getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalBudgetRouteId} que es igual a ${getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected} es mayor a lo que tenemos programado, y lo que tenemos programado tiene el valor de ${getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming!}`);

            const objPartialResult: IPartialObjectResultTransferGeneric = {
              getDataProccessOrigins: getDataProccessOrigins.data,
              getDataProccessDestinities: getDataProccessDestinities.data
            }
            return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "El recaudo es mayor al presupuesto sapiencia del PAC");

        }

        //* Validación del escenario 5
        if( getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming! <
            getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected!) {

            console.log("El recaudo previamente guardado en el PAC es mayor que lo programado a ingresar");
            console.log(`El total recaudado para la ruta ${getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalBudgetRouteId} que es igual a ${getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected} es mayor a lo que tenemos programado, y lo que tenemos programado tiene el valor de ${getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming!}`);

            const objPartialResult: IPartialObjectResultTransferGeneric = {
              getDataProccessOrigins: getDataProccessOrigins.data,
              getDataProccessDestinities: getDataProccessDestinities.data
            }
            return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "El recaudo previamente guardado en el PAC es mayor que lo programado a ingresar");

        }

        //* Validación del escenario 10
        // Este escenario muy poco probable se dará porque escenario 5, 7 y 9 ya básicamente lo hacen
        if( getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected! >
          getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming! &&
          !(getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming! <=
          getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected!)){

            const objPartialResult: IPartialObjectResultTransferGeneric = {
              getDataProccessOrigins: getDataProccessOrigins.data,
              getDataProccessDestinities: getDataProccessDestinities.data
            }
            return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "La sumatoria de lo programado del año, no puede ser menor a la sumatoria de lo recaudado del año");

        }

      }

      //1.2. Destinos
      for (let i = 0; i < getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal.length! ; i++) {

        totalDestinitiesOriginalProgramming += getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesTotalProgramming!;
        totalDestinitiesOriginalCollected   += getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesTotalCollected!;

        totalDestinitiesTransferProgramming += getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming!;
        totalDestinitiesTransferCollected   += getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalCollected!;

        //* Validación del escenario 3
        if( getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming! !==
          getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesBalanceRoute ) {

          console.log("El valor del presupuesto sapiencia es diferente al valor del presupuesto");
          console.log(`El total programado de la transferencia de la ruta ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesBudgetRouteId} me está dando ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming!} pero su saldo de ruta me está dando ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesBalanceRoute}`);

          const objPartialResult: IPartialObjectResultTransferGeneric = {
            getDataProccessOrigins: getDataProccessOrigins.data,
            getDataProccessDestinities: getDataProccessDestinities.data
          }
          return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "El valor del presupuesto sapiencia es diferente al valor del presupuesto");

        }

        //* Validación del escenario 7
        // Por si se nos va por el AMBOS
        if( getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalCollected! >
          getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming!) {

            console.log("El recaudo es mayor al presupuesto sapiencia del PAC");
            console.log(`El total recaudado para la ruta ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesBudgetRouteId} que es igual a ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalCollected} es mayor a lo que tenemos programado, y lo que tenemos programado tiene el valor de ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming!}`);

            const objPartialResult: IPartialObjectResultTransferGeneric = {
              getDataProccessOrigins: getDataProccessOrigins.data,
              getDataProccessDestinities: getDataProccessDestinities.data
            }
            return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "El recaudo es mayor al presupuesto sapiencia del PAC");

        }

        //* Validación del escenario 5
        if( getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming! <
          getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalCollected!) {

          console.log("El recaudo previamente guardado en el PAC es mayor que lo programado a ingresar");
          console.log(`El total recaudado para la ruta ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesBudgetRouteId} que es igual a ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalCollected} es mayor a lo que tenemos programado, y lo que tenemos programado tiene el valor de ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming!}`);

          const objPartialResult: IPartialObjectResultTransferGeneric = {
            getDataProccessOrigins: getDataProccessOrigins.data,
            getDataProccessDestinities: getDataProccessDestinities.data
          }
          return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "El recaudo previamente guardado en el PAC es mayor que lo programado a ingresar");

        }

        //* Validación del escenario 10
        // Este escenario muy poco probable se dará porque escenario 5, 7 y 9 ya básicamente lo hacen
        if( getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected! >
          getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming! &&
          !(getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming! <=
          getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected!)){

            const objPartialResult: IPartialObjectResultTransferGeneric = {
              getDataProccessOrigins: getDataProccessOrigins.data,
              getDataProccessDestinities: getDataProccessDestinities.data
            }
            return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "La sumatoria de lo programado del año, no puede ser menor a la sumatoria de lo recaudado del año");

        }

      }

      const originalsProgramming: number = totalOriginisOriginalProgramming + totalDestinitiesOriginalProgramming;
      const newsProgrammings: number = totalOriginisTransferProgramming + totalDestinitiesTransferProgramming;
      const originalsCollected: number = totalOriginisOriginalCollected + totalDestinitiesOriginalCollected;
      const newsCollecteds: number = totalOriginisTransferCollected + totalDestinitiesTransferCollected;

      //* Validación del escenario 4 (De paso se valida la 1).
      if( originalsProgramming !== newsProgrammings ){

        console.log("No puede aumentar o reducir el valor del presupuesto, solo moverlo entre rutas");
        const objPartialResult: IPartialObjectResultTransferGeneric = {
          getDataProccessOrigins: getDataProccessOrigins.data,
          getDataProccessDestinities: getDataProccessDestinities.data
        }
        return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "No puede aumentar o reducir el valor del presupuesto, solo moverlo entre rutas");

      }

      //Aquí hago la validación para el tema de AMBOS, también valido lo recaudado
      //* Validación del escenario 6 (De paso se valida la 2).
      if( originalsCollected !== newsCollecteds ){

        console.log("No puede aumentar o reducir el valor del recaudo, solo moverlo entre rutas");
        const objPartialResult: IPartialObjectResultTransferGeneric = {
          getDataProccessOrigins: getDataProccessOrigins.data,
          getDataProccessDestinities: getDataProccessDestinities.data
        }
        return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "No puede aumentar o reducir el valor del recaudo, solo moverlo entre rutas");

      }



      console.log("********* ********* ********* ********* *********");
      console.log({});
      console.log({totalOriginisOriginalProgramming});
      console.log({totalOriginisTransferProgramming});
      console.log({totalDestinitiesOriginalProgramming});
      console.log({totalDestinitiesTransferProgramming});
      console.log({});
      console.log({originalsProgramming});
      console.log({newsProgrammings});
      console.log({});
      console.log({});
      console.log({});
      console.log({totalOriginisOriginalCollected});
      console.log({totalOriginisTransferCollected});
      console.log({totalDestinitiesOriginalCollected});
      console.log({totalDestinitiesTransferCollected});
      console.log({});
      console.log({originalsCollected});
      console.log({newsCollecteds});
      console.log({});
      console.log({});
      console.log({});
      console.log("********* ********* ********* ********* *********");

      // const objPartialResult: IPartialObjectResultTransferGeneric = {
      //   getDataProccessOrigins: getDataProccessOrigins.data,
      //   getDataProccessDestinities: getDataProccessDestinities.data
      // }

      // return new ApiResponse(objPartialResult, EResponseCodes.OK, "Refactorizando Traslados");

      //? Ahora actualizamos la información si llegamos hasta acá
      //const updateOrigins = null;
      //const updateDestinities = null;
      const updateOrigins = await this.updateOriginsWithNewData(data);
      const updateDestinities = await this.updateDestinitiesWithNewData(data);


      const objPartialResult: IPartialObjectResultTransferGeneric = {
        getDataProccessOrigins: getDataProccessOrigins.data,
        getDataProccessDestinities: getDataProccessDestinities.data,
        resultUpdate: {
          updateOrigins: updateOrigins.data,
          updateDestinities: updateDestinities.data
        }
      }

      return new ApiResponse(objPartialResult, EResponseCodes.OK, "¡Guardado exitosamente!");

    }

    //! ************************* ************************* ************************* !//
    //! *** ************************* RECAUDADO O AMBOS ************************* *** !//
    //! ************************* ************************* ************************* !//

    if( data.headTransfer.pacType === "Recaudado" || data.headTransfer.pacType === "Ambos" ){

      console.log("********* ENTRAMOS POR RECAUDADO O AMBOS *********");

      //? VALIDACIÓN 1 y 2 - Se solapan con la VALIDACIÓN 4 Y 6.
      //* Para calcular a nivel de programado y recaudo(por si sale la opción ambos)
      let totalOriginisOriginalProgramming: number = 0;
      let totalOriginisTransferProgramming: number = 0;
      let totalDestinitiesOriginalProgramming: number = 0;
      let totalDestinitiesTransferProgramming: number = 0;

      let totalOriginisOriginalCollected: number = 0;
      let totalOriginisTransferCollected: number = 0;
      let totalDestinitiesOriginalCollected: number = 0;
      let totalDestinitiesTransferCollected: number = 0;

      //1.1. Origenes
      for (let i = 0; i < getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal.length! ; i++) {

        totalOriginisOriginalProgramming += getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalTotalProgramming!;
        totalOriginisOriginalCollected   += getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalTotalCollected!;

        totalOriginisTransferProgramming += getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming!;
        totalOriginisTransferCollected   += getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected!;

        //* Validación del escenario 3
        // Por si caemos en el escenario de AMBOS
        if( getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming! !==
          getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalBalanceRoute ) {

          console.log("El valor del presupuesto sapiencia es diferente al valor del presupuesto");
          console.log(`El total programado de la transferencia de la ruta ${getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalBudgetRouteId} me está dando ${getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming!} pero su saldo de ruta me está dando ${getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalBalanceRoute}`);

          const objPartialResult: IPartialObjectResultTransferGeneric = {
            getDataProccessOrigins: getDataProccessOrigins.data,
            getDataProccessDestinities: getDataProccessDestinities.data
          }
          return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "El valor del presupuesto sapiencia es diferente al valor del presupuesto");

        }

        //* Validación del escenario 7
        if( getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected! >
          getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming!) {

            console.log("El recaudo es mayor al presupuesto sapiencia del PAC");
            console.log(`El total recaudado para la ruta ${getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalBudgetRouteId} que es igual a ${getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected} es mayor a lo que tenemos programado, y lo que tenemos programado tiene el valor de ${getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming!}`);

            const objPartialResult: IPartialObjectResultTransferGeneric = {
              getDataProccessOrigins: getDataProccessOrigins.data,
              getDataProccessDestinities: getDataProccessDestinities.data
            }
            return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "El recaudo es mayor al presupuesto sapiencia del PAC");

        }

        //* Validación del escenario 5
        // Por si caemos en el escenario de AMBOS
        if( getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming! <
          getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected!) {

          console.log("El recaudo previamente guardado en el PAC es mayor que lo programado a ingresar");
          console.log(`El total recaudado para la ruta ${getDataProccessOrigins.data?.originsRoutesWithAllInfoOriginal[i].originalBudgetRouteId} que es igual a ${getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected} es mayor a lo que tenemos programado, y lo que tenemos programado tiene el valor de ${getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming!}`);

          const objPartialResult: IPartialObjectResultTransferGeneric = {
            getDataProccessOrigins: getDataProccessOrigins.data,
            getDataProccessDestinities: getDataProccessDestinities.data
          }
          return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "El recaudo previamente guardado en el PAC es mayor que lo programado a ingresar");

        }

        //* Validación del escenario 10
        // Este escenario muy poco probable se dará porque escenario 5, 7 y 9 ya básicamente lo hacen
        if( getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected! >
          getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming! &&
          !(getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming! <=
          getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected!)){

            const objPartialResult: IPartialObjectResultTransferGeneric = {
              getDataProccessOrigins: getDataProccessOrigins.data,
              getDataProccessDestinities: getDataProccessDestinities.data
            }
            return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "La sumatoria de lo programado del año, no puede ser menor a la sumatoria de lo recaudado del año");

        }

      }

      //1.2. Destinos
      for (let i = 0; i < getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal.length! ; i++) {

        totalDestinitiesOriginalProgramming += getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesTotalProgramming!;
        totalDestinitiesOriginalCollected   += getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesTotalCollected!;

        totalDestinitiesTransferProgramming += getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming!;
        totalDestinitiesTransferCollected   += getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalCollected!;

        //* Validación del escenario 3
        // Por si caemos en el escenario de AMBOS
        if( getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming! !==
          getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesBalanceRoute ) {

          console.log("El valor del presupuesto sapiencia es diferente al valor del presupuesto");
          console.log(`El total programado de la transferencia de la ruta ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesBudgetRouteId} me está dando ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming!} pero su saldo de ruta me está dando ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesBalanceRoute}`);

          const objPartialResult: IPartialObjectResultTransferGeneric = {
            getDataProccessOrigins: getDataProccessOrigins.data,
            getDataProccessDestinities: getDataProccessDestinities.data
          }
          return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "El valor del presupuesto sapiencia es diferente al valor del presupuesto");

        }

        //* Validación del escenario 7
        if( getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalCollected! >
          getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming!) {

            console.log("El recaudo es mayor al presupuesto sapiencia del PAC");
            console.log(`El total recaudado para la ruta ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesBudgetRouteId} que es igual a ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalCollected} es mayor a lo que tenemos programado, y lo que tenemos programado tiene el valor de ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming!}`);

            const objPartialResult: IPartialObjectResultTransferGeneric = {
              getDataProccessOrigins: getDataProccessOrigins.data,
              getDataProccessDestinities: getDataProccessDestinities.data
            }
            return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "El recaudo es mayor al presupuesto sapiencia del PAC");

        }

        //* Validación del escenario 5
        // Por si caemos en el escenario de AMBOS
        if( getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming! <
          getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalCollected!) {

          console.log("El recaudo previamente guardado en el PAC es mayor que lo programado a ingresar");
          console.log(`El total recaudado para la ruta ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoOriginal[i].destinitiesBudgetRouteId} que es igual a ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalCollected} es mayor a lo que tenemos programado, y lo que tenemos programado tiene el valor de ${getDataProccessDestinities.data?.destinitiesRoutesWithAllInfoTransfer[i].transferTotalProgramming!}`);

          const objPartialResult: IPartialObjectResultTransferGeneric = {
            getDataProccessOrigins: getDataProccessOrigins.data,
            getDataProccessDestinities: getDataProccessDestinities.data
          }
          return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "El recaudo previamente guardado en el PAC es mayor que lo programado a ingresar");

        }

        //* Validación del escenario 10
        // Este escenario muy poco probable se dará porque escenario 5, 7 y 9 ya básicamente lo hacen
        if( getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected! >
          getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming! &&
          !(getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalProgramming! <=
          getDataProccessOrigins.data?.originsRoutesWithAllInfoTransfer[i].transferTotalCollected!)){

            const objPartialResult: IPartialObjectResultTransferGeneric = {
              getDataProccessOrigins: getDataProccessOrigins.data,
              getDataProccessDestinities: getDataProccessDestinities.data
            }
            return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "La sumatoria de lo programado del año, no puede ser menor a la sumatoria de lo recaudado del año");

        }

      }

      const originalsProgramming: number = totalOriginisOriginalProgramming + totalDestinitiesOriginalProgramming;
      const newsProgrammings: number = totalOriginisTransferProgramming + totalDestinitiesTransferProgramming;
      const originalsCollected: number = totalOriginisOriginalCollected + totalDestinitiesOriginalCollected;
      const newsCollecteds: number = totalOriginisTransferCollected + totalDestinitiesTransferCollected;

      //* Validación del escenario 4 (De paso se valida la 1).
      if( originalsProgramming !== newsProgrammings ){

        console.log("No puede aumentar o reducir el valor del presupuesto, solo moverlo entre rutas");

        const objPartialResult: IPartialObjectResultTransferGeneric = {
          getDataProccessOrigins: getDataProccessOrigins.data,
          getDataProccessDestinities: getDataProccessDestinities.data
        }
        return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "No puede aumentar o reducir el valor del presupuesto, solo moverlo entre rutas");

      }

      //Aquí hago la validación para el tema de AMBOS, también valido lo recaudado
      //* Validación del escenario 6 (De paso se valida la 2).
      if( originalsCollected !== newsCollecteds ){

        console.log("No puede aumentar o reducir el valor del recaudo, solo moverlo entre rutas");
        console.log(`${originalsCollected}   -   ${newsCollecteds}   ->   ${originalsCollected - newsCollecteds}`);

        const objPartialResult: IPartialObjectResultTransferGeneric = {
          getDataProccessOrigins: getDataProccessOrigins.data,
          getDataProccessDestinities: getDataProccessDestinities.data
        }
        return new ApiResponse(objPartialResult, EResponseCodes.FAIL, "No puede aumentar o reducir el valor del recaudo, solo moverlo entre rutas");

      }

      console.log("********* ********* ********* ********* *********");
      console.log({});
      console.log({totalOriginisOriginalProgramming});
      console.log({totalOriginisTransferProgramming});
      console.log({totalDestinitiesOriginalProgramming});
      console.log({totalDestinitiesTransferProgramming});
      console.log({});
      console.log({originalsProgramming});
      console.log({newsProgrammings});
      console.log({});
      console.log({});
      console.log({});
      console.log({totalOriginisOriginalCollected});
      console.log({totalOriginisTransferCollected});
      console.log({totalDestinitiesOriginalCollected});
      console.log({totalDestinitiesTransferCollected});
      console.log({});
      console.log({originalsCollected});
      console.log({newsCollecteds});
      console.log({});
      console.log({});
      console.log({});
      console.log("********* ********* ********* ********* *********");

      // const objPartialResult: IPartialObjectResultTransferGeneric = {
      //   getDataProccessOrigins: getDataProccessOrigins.data,
      //   getDataProccessDestinities: getDataProccessDestinities.data
      // }

      // return new ApiResponse(objPartialResult, EResponseCodes.OK, "Refactorizando Traslados");

      //? Ahora actualizamos la información si llegamos hasta acá
      //const updateOrigins = null;
      //const updateDestinities = null;
      const updateOrigins = await this.updateOriginsWithNewData(data);
      const updateDestinities = await this.updateDestinitiesWithNewData(data);


      const objPartialResult: IPartialObjectResultTransferGeneric = {
        getDataProccessOrigins: getDataProccessOrigins.data,
        getDataProccessDestinities: getDataProccessDestinities.data,
        resultUpdate: {
          updateOrigins: updateOrigins.data,
          updateDestinities: updateDestinities.data
        }
      }

      return new ApiResponse(objPartialResult, EResponseCodes.OK, "¡Guardado exitosamente!");

    }

    //! "Fin"
    return new ApiResponse(null, EResponseCodes.INFO, `Transacción de Traslado Finalizada`);

  }



  async calculatedInformationByDestinities(data: DataTransferPac): Promise<ApiResponse<IStructureResponseTransferGenericDestinities | null>> {

    //* Estos datos son los que vienen en la transferencia y PODRÍAN estar modificados o NO
    //* Debemos procesarlos SIEMPRE como si se hubieran modificado.
    const { exercise, resourceType } = data.headTransfer;
    const objDestinities: IDestinity[] = data.transferTransaction.destinities;

    //? Empezamos calculando toda la información de los origenes:
    //* Vamos a devolver un objeto "completo" con toda la información original y de la transferencia
    let destinitiesRoutesWithAllInfoOriginal: IStructureResponseTransferGlobalOriginals[] = [];
    let destinitiesRoutesWithAllInfoTransfer: IStructureResponseTransferGlobalOriginals[] = [];

    //! *************************** !//
    //! *** Procesando DESTINOS *** !//
    //! *************************** !//
    for (const iDestinities of objDestinities){

      //1. Consiga la ruta
      const getRoute = await this.budgetsRoutesRepository
                                 .getBudgetForAdditions(iDestinities.idProjectVinculation,
                                                        iDestinities.idFund,
                                                        iDestinities.idBudget,
                                                        iDestinities.idPospreSapiencia);

      if( !getRoute || getRoute == null || getRoute == undefined )
        return new ApiResponse(null, EResponseCodes.FAIL, "[Cálculo Destinos] En el cálculo de información general no se encontró una ruta presupuestal con la información proporcionada");

      //2. Traiga el PAC asociado a la ruta y con la vigencia
      //*NOTA!! -> Me voy a traer por defecto AMBOS!, es decir, siempre me traeré todo lo programado y todo lo recaudado
      const getPacWithAnnual = await this.pacRepository.getPacByRouteAndExercise(Number(getRoute.id), Number(exercise), 0, resourceType, 1, 100000);

      if( !getPacWithAnnual || getPacWithAnnual == null || getPacWithAnnual == undefined )
        return new ApiResponse(null, EResponseCodes.FAIL, "[Cálculo Destinos] En el cálculo de información general no se encontró un PAC con la información obtenida de ruta y vigencia");

      //? *******************************************************************************
      //? 3. Con el PAC obtenido, calcule el valor total ORIGINAL de las anualizaciones.
      //? *******************************************************************************
      let destinitiesTotalProgramming: number = 0;
      let destinitiesIdProgrammingByAnn: number = 0;
      let destinitiesPacProgrammingByAnn: number = 0;
      let destinitiesTotalCollected: number = 0;
      let destinitiesIdCollectedByAnn: number = 0;
      let destinitiesPacCollectedByAnn: number = 0;
      let destinitiesSourceType: string = "";
      let destinitiesBudgetRouteId: number = 0;
      let destinitiesVersion: number = 0;
      let destinitiesExercise: number = 0;
      let destinitiesBalanceRoute: number = Number(getRoute.balance);
      let destinityCardFront: string = iDestinities.idCardTemplate;

      for (const iTofDesinity of getPacWithAnnual.array){

        destinitiesSourceType = iTofDesinity?.sourceType!;
        destinitiesBudgetRouteId = iTofDesinity?.budgetRouteId!;
        destinitiesVersion = iTofDesinity?.version!;
        destinitiesExercise = iTofDesinity?.exercise!;

        for (const iiTofAnnualDestinity of iTofDesinity?.pacAnnualizations!){

          if( iiTofAnnualDestinity.type == "Programado" ){

            destinitiesIdProgrammingByAnn = Number(iiTofAnnualDestinity.id);
            destinitiesPacProgrammingByAnn = Number(iiTofAnnualDestinity.pacId);
            destinitiesTotalProgramming += Number(iiTofAnnualDestinity.jan) + Number(iiTofAnnualDestinity.feb) +
                                           Number(iiTofAnnualDestinity.mar) + Number(iiTofAnnualDestinity.abr) +
                                           Number(iiTofAnnualDestinity.may) + Number(iiTofAnnualDestinity.jun) +
                                           Number(iiTofAnnualDestinity.jul) + Number(iiTofAnnualDestinity.ago) +
                                           Number(iiTofAnnualDestinity.sep) + Number(iiTofAnnualDestinity.oct) +
                                           Number(iiTofAnnualDestinity.nov) + Number(iiTofAnnualDestinity.dec);

          }

          if( iiTofAnnualDestinity.type == "Recaudado" ){

            destinitiesIdCollectedByAnn = Number(iiTofAnnualDestinity.id);
            destinitiesPacCollectedByAnn = Number(iiTofAnnualDestinity.pacId);
            destinitiesTotalCollected += Number(iiTofAnnualDestinity.jan) + Number(iiTofAnnualDestinity.feb) +
                                         Number(iiTofAnnualDestinity.mar) + Number(iiTofAnnualDestinity.abr) +
                                         Number(iiTofAnnualDestinity.may) + Number(iiTofAnnualDestinity.jun) +
                                         Number(iiTofAnnualDestinity.jul) + Number(iiTofAnnualDestinity.ago) +
                                         Number(iiTofAnnualDestinity.sep) + Number(iiTofAnnualDestinity.oct) +
                                         Number(iiTofAnnualDestinity.nov) + Number(iiTofAnnualDestinity.dec);

          }

        }

        const objResultDestinities: IStructureResponseTransferGlobalDestinities = {

          destinitiesSourceType,
          destinitiesBudgetRouteId,
          destinitiesVersion,
          destinitiesExercise,
          destinitiesBalanceRoute,
          destinityCardFront,

          destinitiesTotalProgramming,
          destinitiesIdProgrammingByAnn,
          destinitiesPacProgrammingByAnn,

          destinitiesTotalCollected,
          destinitiesIdCollectedByAnn,
          destinitiesPacCollectedByAnn,

        }

        destinitiesRoutesWithAllInfoOriginal.push(objResultDestinities);

      }

      //? *****************************************************************************************
      //? 4. Con el OBJETO DE TRASLADO (transferTransaction) QUE NOS LLEGA, calcule el valor total
      //? *****************************************************************************************
      let transferTotalProgramming: number = 0;
      let transferIdProgrammingByAnn: number = 0;
      let transferPacProgrammingByAnn: number = 0;
      let transferTotalCollected: number = 0;
      let transferIdCollectedByAnn: number = 0;
      let transferPacCollectedByAnn: number = 0;

      for (const iTofTransfer of iDestinities.annualRoute){

        if( iTofTransfer.type == "Programado" ){

          transferIdProgrammingByAnn = Number(iTofTransfer.id);
          transferPacProgrammingByAnn = Number(iTofTransfer.pacId);
          transferTotalProgramming += Number(iTofTransfer.jan) + Number(iTofTransfer.feb) + Number(iTofTransfer.mar) + Number(iTofTransfer.abr) +
                                      Number(iTofTransfer.may) + Number(iTofTransfer.jun) + Number(iTofTransfer.jul) + Number(iTofTransfer.ago) +
                                      Number(iTofTransfer.sep) + Number(iTofTransfer.oct) + Number(iTofTransfer.nov) + Number(iTofTransfer.dec);

        }

        if( iTofTransfer.type == "Recaudado" ){

          transferIdCollectedByAnn = Number(iTofTransfer.id);
          transferPacCollectedByAnn = Number(iTofTransfer.pacId);
          transferTotalCollected += Number(iTofTransfer.jan) + Number(iTofTransfer.feb) + Number(iTofTransfer.mar) + Number(iTofTransfer.abr) +
                                    Number(iTofTransfer.may) + Number(iTofTransfer.jun) + Number(iTofTransfer.jul) + Number(iTofTransfer.ago) +
                                    Number(iTofTransfer.sep) + Number(iTofTransfer.oct) + Number(iTofTransfer.nov) + Number(iTofTransfer.dec);

        }

      }

      const objResultDestinities: IStructureResponseTransferGlobalDestinities = {

        transferTotalProgramming,
        transferIdProgrammingByAnn,
        transferPacProgrammingByAnn,

        transferTotalCollected,
        transferIdCollectedByAnn,
        transferPacCollectedByAnn,

      }

      destinitiesRoutesWithAllInfoTransfer.push(objResultDestinities);

    } //!Fin ciclo destinos

    const objFinallyResult: IStructureResponseTransferGenericDestinities = {
      destinitiesRoutesWithAllInfoOriginal,
      destinitiesRoutesWithAllInfoTransfer,
    }

    return new ApiResponse(objFinallyResult, EResponseCodes.OK, "Calculando toda la información de Destino");

  }

  async calculatedInformationByOrigins(data: DataTransferPac): Promise<ApiResponse<IStructureResponseTransferGenericOriginis | null>> {

    //* Estos datos son los que vienen en la transferencia y PODRÍAN estar modificados o NO
    //* Debemos procesarlos SIEMPRE como si se hubieran modificado.
    const { exercise, resourceType } = data.headTransfer;
    const objOrigins: IDestinity[] = data.transferTransaction.origins;

    //? Empezamos calculando toda la información de los origenes:
    //* Vamos a devolver un objeto "completo" con toda la información original y de la transferencia
    let originsRoutesWithAllInfoOriginal: IStructureResponseTransferGlobalOriginals[] = [];
    let originsRoutesWithAllInfoTransfer: IStructureResponseTransferGlobalOriginals[] = [];

    //! *************************** !//
    //! *** Procesando ORIGENES *** !//
    //! *************************** !//

    for (const iOrigins of objOrigins) {

      //1. Consiga la ruta
      const getRoute = await this.budgetsRoutesRepository
                                 .getBudgetForAdditions(iOrigins.idProjectVinculation,
                                                        iOrigins.idFund,
                                                        iOrigins.idBudget,
                                                        iOrigins.idPospreSapiencia);

      if( !getRoute || getRoute == null || getRoute == undefined )
        return new ApiResponse(null, EResponseCodes.FAIL, "[Cálculo Orígenes] En el cálculo de información general no se encontró una ruta presupuestal con la información proporcionada");

      //2. Traiga el PAC asociado a la ruta y con la vigencia
      //*NOTA!! -> Me voy a traer por defecto AMBOS!, es decir, siempre me traeré todo lo programado y todo lo recaudado
      const getPacWithAnnual = await this.pacRepository.getPacByRouteAndExercise(Number(getRoute.id), Number(exercise), 0, resourceType, 1, 100000);

      if( !getPacWithAnnual || getPacWithAnnual == null || getPacWithAnnual == undefined )
        return new ApiResponse(null, EResponseCodes.FAIL, "[Cálculo Orígenes] En el cálculo de información general no se encontró un PAC con la información obtenida de ruta y vigencia");

      //? *******************************************************************************
      //? 3. Con el PAC obtenido, calcule el valor total ORIGINAL de las anualizaciones.
      //? *******************************************************************************

      let originalTotalProgramming: number = 0;
      let originalIdProgrammingByAnn: number = 0;
      let originalPacProgrammingByAnn: number = 0;
      let originalTotalCollected: number = 0;
      let originalIdCollectedByAnn: number = 0;
      let originalPacCollectedByAnn: number = 0;
      let originalSourceType: string = "";
      let originalBudgetRouteId: number = 0;
      let originalVersion: number = 0;
      let originalExercise: number = 0;
      let originalBalanceRoute: number = Number(getRoute.balance);
      let originalCardFront: string = iOrigins.idCardTemplate;

      for (const iTofOrigin of getPacWithAnnual.array) {

        originalSourceType = iTofOrigin?.sourceType!;
        originalBudgetRouteId = iTofOrigin?.budgetRouteId!;
        originalVersion = iTofOrigin?.version!;
        originalExercise = iTofOrigin?.exercise!;

        for (const iiTofAnnualOrigin of iTofOrigin?.pacAnnualizations!) {

          if( iiTofAnnualOrigin.type == "Programado" ){

            originalIdProgrammingByAnn = Number(iiTofAnnualOrigin.id);
            originalPacProgrammingByAnn = Number(iiTofAnnualOrigin.pacId);
            originalTotalProgramming += Number(iiTofAnnualOrigin.jan) + Number(iiTofAnnualOrigin.feb) +
                                        Number(iiTofAnnualOrigin.mar) + Number(iiTofAnnualOrigin.abr) +
                                        Number(iiTofAnnualOrigin.may) + Number(iiTofAnnualOrigin.jun) +
                                        Number(iiTofAnnualOrigin.jul) + Number(iiTofAnnualOrigin.ago) +
                                        Number(iiTofAnnualOrigin.sep) + Number(iiTofAnnualOrigin.oct) +
                                        Number(iiTofAnnualOrigin.nov) + Number(iiTofAnnualOrigin.dec);

          }

          if( iiTofAnnualOrigin.type == "Recaudado" ){

            originalIdCollectedByAnn = Number(iiTofAnnualOrigin.id);
            originalPacCollectedByAnn = Number(iiTofAnnualOrigin.pacId);
            originalTotalCollected += Number(iiTofAnnualOrigin.jan) + Number(iiTofAnnualOrigin.feb) +
                                      Number(iiTofAnnualOrigin.mar) + Number(iiTofAnnualOrigin.abr) +
                                      Number(iiTofAnnualOrigin.may) + Number(iiTofAnnualOrigin.jun) +
                                      Number(iiTofAnnualOrigin.jul) + Number(iiTofAnnualOrigin.ago) +
                                      Number(iiTofAnnualOrigin.sep) + Number(iiTofAnnualOrigin.oct) +
                                      Number(iiTofAnnualOrigin.nov) + Number(iiTofAnnualOrigin.dec);

          }

        }

        const objResultOriginis: IStructureResponseTransferGlobalOriginals = {

          originalSourceType,
          originalBudgetRouteId,
          originalVersion,
          originalExercise,
          originalBalanceRoute,
          originalCardFront,

          originalTotalProgramming,
          originalIdProgrammingByAnn,
          originalPacProgrammingByAnn,

          originalTotalCollected,
          originalIdCollectedByAnn,
          originalPacCollectedByAnn,

        }

        originsRoutesWithAllInfoOriginal.push(objResultOriginis);

      }

      //? *****************************************************************************************
      //? 4. Con el OBJETO DE TRASLADO (transferTransaction) QUE NOS LLEGA, calcule el valor total
      //? *****************************************************************************************

      let transferTotalProgramming: number = 0;
      let transferIdProgrammingByAnn: number = 0;
      let transferPacProgrammingByAnn: number = 0;
      let transferTotalCollected: number = 0;
      let transferIdCollectedByAnn: number = 0;
      let transferPacCollectedByAnn: number = 0;

      for (const iTofTransfer of iOrigins.annualRoute) {

        if( iTofTransfer.type == "Programado" ){

          transferIdProgrammingByAnn = Number(iTofTransfer.id);
          transferPacProgrammingByAnn = Number(iTofTransfer.pacId);
          transferTotalProgramming += Number(iTofTransfer.jan) + Number(iTofTransfer.feb) + Number(iTofTransfer.mar) + Number(iTofTransfer.abr) +
                                      Number(iTofTransfer.may) + Number(iTofTransfer.jun) + Number(iTofTransfer.jul) + Number(iTofTransfer.ago) +
                                      Number(iTofTransfer.sep) + Number(iTofTransfer.oct) + Number(iTofTransfer.nov) + Number(iTofTransfer.dec);

        }

        if( iTofTransfer.type == "Recaudado" ){

          transferIdCollectedByAnn = Number(iTofTransfer.id);
          transferPacCollectedByAnn = Number(iTofTransfer.pacId);
          transferTotalCollected += Number(iTofTransfer.jan) + Number(iTofTransfer.feb) + Number(iTofTransfer.mar) + Number(iTofTransfer.abr) +
                                    Number(iTofTransfer.may) + Number(iTofTransfer.jun) + Number(iTofTransfer.jul) + Number(iTofTransfer.ago) +
                                    Number(iTofTransfer.sep) + Number(iTofTransfer.oct) + Number(iTofTransfer.nov) + Number(iTofTransfer.dec);

        }

      }

      const objResultOriginis: IStructureResponseTransferGlobalOriginals = {

        transferTotalProgramming,
        transferIdProgrammingByAnn,
        transferPacProgrammingByAnn,

        transferTotalCollected,
        transferIdCollectedByAnn,
        transferPacCollectedByAnn,

      }

      originsRoutesWithAllInfoTransfer.push(objResultOriginis);

    } //!Fin ciclo origenes

    const objFinallyResult: IStructureResponseTransferGenericOriginis = {

      originsRoutesWithAllInfoOriginal,
      originsRoutesWithAllInfoTransfer,

    }

    return new ApiResponse(objFinallyResult, EResponseCodes.OK, "[Cálculo Orígenes] Calculando toda la información de Origen");

  }

  async updateOriginsWithNewData(data: DataTransferPac): Promise<ApiResponse<boolean | IDestinity[]>> {

    const arrayProccessGeneral: IDestinity[] = data.transferTransaction.origins;
    let band: boolean = false;

    for (const x of arrayProccessGeneral) {

      for (const y of x.annualRoute) {

        const update = await this.pacRepository.updateTransfer(y);
        if (update == null) return new ApiResponse(false, EResponseCodes.FAIL, "Error al actualizar anualizaciones");
        band = true;

      }

    }

    if (!band) return new ApiResponse(false, EResponseCodes.FAIL, 'No se actualizaron origenes, errores');
    return new ApiResponse(arrayProccessGeneral, EResponseCodes.OK, 'Origenes actualizados');

  }

  async updateDestinitiesWithNewData(data: DataTransferPac): Promise<ApiResponse<boolean | IDestinity[]>> {

    const arrayProccessGeneral: IDestinity[] = data.transferTransaction.destinities;
    let band: boolean = false;

    for (const x of arrayProccessGeneral) {

      for (const y of x.annualRoute) {

        const update = await this.pacRepository.updateTransfer(y);
        if (update == null) return new ApiResponse(false, EResponseCodes.FAIL, "Error al actualizar anualizaciones");
        band = true;

      }

    }

    if (!band) return new ApiResponse(false, EResponseCodes.FAIL, 'No se actualizaron destinos, errores');
    return new ApiResponse(arrayProccessGeneral, EResponseCodes.OK, 'Destinos actualizados');

  }

  //? ========================================================================== ?//
  //? ========================================================================== ?//
  //? ========================================================================== ?//
  //* *********************** ************************** *********************** *//
  //? ========================================================================== ?//
  //? ========================================================================== ?//
  //? ========================================================================== ?//


}


