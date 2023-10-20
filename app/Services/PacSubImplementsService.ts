import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";

import IPacRepository from '../Repositories/PacRepository';
import { IProjectsRepository } from '../Repositories/ProjectsRepository';
import { IFunctionalProjectRepository } from '../Repositories/FunctionalProjectRepository';
import { IFundsRepository } from '../Repositories/FundsRepository';
import { IPosPreSapienciaRepository } from '../Repositories/PosPreSapienciaRepository';
import { IBudgetsRoutesRepository } from '../Repositories/BudgetsRoutesRepository';
import { IStrategicDirectionService } from './External/StrategicDirectionService';
import { IProjectPaginated, ISearchGeneralPac } from '../Interfaces/PacInterfaces';
import { IBudgetsRoutesFilters } from '../Interfaces/BudgetsRoutesInterfaces';

import { IPacFilters,
         IPacComplementary,
         IPacPrimary,
         IDinamicListForProjects,
         IDinamicListForFunds,
         IDinamicListForPospres } from '../Interfaces/PacInterfaces';

export default interface IPacSubImplementsService {

  getHellow(): Promise<ApiResponse<string | null>>;
  getUltimateVersion(): Promise<ApiResponse<number | null>>;
  getRoutesByValidity(data: IPacFilters): Promise<ApiResponse<IPagingData<IPacPrimary> | IPacComplementary | null>>;
  searchPacs(data: IPacFilters): Promise<ApiResponse<ISearchGeneralPac[] | null>>;
  listDinamicsAssociations(data: IPacFilters): Promise<ApiResponse<IPagingData<IPacPrimary | number>>>;

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

    console.log({pacRepository: this.pacRepository});
    console.log({projectsRepository: this.projectsRepository});
    console.log({functionalProjectRepository: this.functionalProjectRepository});
    console.log({fundsRepository: this.fundsRepository});
    console.log({posPreSapienciaRepository: this.posPreSapienciaRepository});
    console.log({budgetsRoutesRepository: this.budgetsRoutesRepository});
    console.log({strategicDirectionService: this.strategicDirectionService});

    return new ApiResponse(null, EResponseCodes.INFO, "Se estableció la conexión.");

  }

  async getUltimateVersion(): Promise<ApiResponse<number | null>> {

    const getVersion = await this.pacRepository.getUltimateVersion();

    if( !getVersion || getVersion == null || getVersion == undefined )
      return new ApiResponse(null, EResponseCodes.FAIL, "No se pudo encontrar una versión.");

    const getData: number[] = getVersion as number[];
    const value: number = getData[0];

    return new ApiResponse(value, EResponseCodes.OK, "Última versión.");

  }

  async getRoutesByValidity(data: IPacFilters): Promise<ApiResponse<IPagingData<IPacPrimary> | IPacComplementary | null>> {

    //* Consultamos PACs y traemos los PACs asociados para extraer sus rutas presupuestales.
    const getPacs = await this.pacRepository.searchPacByMultiData(data);

    if( getPacs.array.length <= 0 || !getPacs.array ){

      return new ApiResponse(null, EResponseCodes.FAIL, "No se encontraron PACs ni Rutas Presupuestales con la vigencia, versión y tipo de recursos proporcionados.");

    }

    //* Consultamos la ruta y obtenemos los listados
    let arrayProjects: number[] = [];     // PK -> Vinculation Project
    let arrayFunds: number[] = [];        // PK -> Fund Number
    let arrayPosPreOrg: number[] = [];    // PK -> PosPre Orig Number
    let arrayPosPreSap: number[] = [];    // PK -> PosPre Sapi Number
    let listBudgetsRoutes: number[] = []; // PK -> Rutas Presupuestales

    for (const routes of getPacs.array){

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
    for (const fund of arrayFunds){

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
    listFunds = listFunds.filter(function(current: IDinamicListForFunds) {
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
    listPospreSapi = listPospreSapi.filter(function(current: IDinamicListForPospres) {
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
    listProjects = listProjects.filter(function(current: IDinamicListForProjects) {
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

  async searchPacs(data: IPacFilters): Promise<ApiResponse<ISearchGeneralPac[] | null>> {

    const { exercise,
            version,
            resourceType,
            idProjectVinculation,
            idBudget,
            idPospreSapiencia,
            idFund } = data;

    let resultTransaction: ISearchGeneralPac[] = [];

    //* Obtengamos la ruta primero:
    const getRoute = await this.budgetsRoutesRepository
                               .getBudgetForAdditions( Number(idProjectVinculation),
                                                       Number(idFund),
                                                       Number(idBudget),
                                                       Number(idPospreSapiencia) );

    if( !getRoute || getRoute == null || getRoute == undefined )
      return new ApiResponse(null, EResponseCodes.FAIL, "No se pudo obtener la ruta presupuestal con los datos dados.");

    //* Busquemos PAC con la ruta junto con la vigencia, tipo de recurso y versión.
    const getPac = await this.pacRepository
                             .getPacByRouteAndExercise( Number(getRoute.id),
                                                        Number(exercise),
                                                        Number(version),
                                                        resourceType?.toString()! );

    if( !getPac || getPac == null || getPac == undefined )
      return new ApiResponse(null, EResponseCodes.FAIL, "No se pudo obtener el pac con la ruta presupuestal obtenido y data dada.");

    //* Calculamos el presupuesto sapiencia y el porcentaje de ejecución
    for (const pac of getPac.array) {

      let sapienciaBudget: number = 0;
      let sapienciaCollected: number = 0;

      //* Obtenga la ruta simplificada con la data
      const filtersByRoute: IBudgetsRoutesFilters = { page: 1, perPage: 1000, idRoute: Number(pac?.budgetRouteId) }; //Solo debería traer 1.
      const getRouteById = await this.budgetsRoutesRepository.getBudgetsRoutesPaginated(filtersByRoute);
      if( !getRouteById || getRouteById == null || getRouteById == undefined )
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

        if( !band ){

          totalProgramming =
                        Number(annualizations.jan) +
                        Number(annualizations.feb) +
                        Number(annualizations.mar) +
                        Number(annualizations.abr) +
                        Number(annualizations.may) +
                        Number(annualizations.jun) +
                        Number(annualizations.jul) +
                        Number(annualizations.ago) +
                        Number(annualizations.sep) +
                        Number(annualizations.oct) +
                        Number(annualizations.nov) +
                        Number(annualizations.dec);

          sapienciaBudget += totalProgramming;
          band = true;

        }else{

          totalCollected =
                        Number(annualizations.jan) +
                        Number(annualizations.feb) +
                        Number(annualizations.mar) +
                        Number(annualizations.abr) +
                        Number(annualizations.may) +
                        Number(annualizations.jun) +
                        Number(annualizations.jul) +
                        Number(annualizations.ago) +
                        Number(annualizations.sep) +
                        Number(annualizations.oct) +
                        Number(annualizations.nov) +
                        Number(annualizations.dec);

          sapienciaCollected += totalCollected;

        }

      }

      //? Llenamos el objeto respuesta
      const percentTransform: number = Number(((100*sapienciaCollected)/sapienciaBudget).toFixed(2));

      const objResult: ISearchGeneralPac = {

        projectName: getNameProject.data?.toString()!,
        numberFund: getFundNumber,
        posPreSapi: getPosPreSapiNumber,
        budgetSapi: sapienciaBudget,
        budgetCollected : sapienciaCollected,
        percentExecute: percentTransform,
        pacId: idPac,
        routeId: idBudgetRoute,
        posPreOrig: getPosPreOrigNumber,

      }

      resultTransaction.push(objResult);

    }

    if( resultTransaction.length == 0 ||
        !resultTransaction ||
        resultTransaction == null ||
        resultTransaction == undefined ){

      return new ApiResponse(null, EResponseCodes.FAIL, "Los datos proporcionados no me traen ningún PAC");

    }

    return new ApiResponse(resultTransaction, EResponseCodes.OK, "Obteniendo los datos");

  }

  async getProjectByResource(idProject: number, idPosPreSapi: number): Promise<ApiResponse<string | null>> {

    let projectNameResult: string = "";
    const filtersByPlanning = { page: 1, perPage: 100000 };
    const getProjectPlanning = await this.strategicDirectionService.getProjectInvestmentPaginated(filtersByPlanning);

    if( !getProjectPlanning || getProjectPlanning == null || getProjectPlanning == undefined)
      return new ApiResponse(null, EResponseCodes.FAIL, "No se pudieron obtener los proyectos de planeación.");

    const getVinculation = await this.projectsRepository.getProjectById(idProject);

    if( !getVinculation || getVinculation == null || getVinculation == undefined)
      return new ApiResponse(null, EResponseCodes.FAIL, "No se pudo obtener el proyecto de vinculación con el ID dado.");

    //Debo verificar si es un proyecto de funcionamiento, si es así, debo asociar al pospre sapi, de lo contrario, el de la API.
    if (getVinculation?.operationProjectId && getVinculation?.operationProjectId != null){

      const getPosPreSapi = await this.posPreSapienciaRepository.getPosPreSapienciaById(idPosPreSapi);
      projectNameResult = getPosPreSapi?.description!;

    }else{

      const pkInvestmentProject: number = Number(getVinculation!.investmentProjectId);
      for (const projPlanningApi of getProjectPlanning.data.array){

        if (projPlanningApi.id === pkInvestmentProject){

          projectNameResult = projPlanningApi.name;

        }

      }

    }

    return new ApiResponse(projectNameResult, EResponseCodes.OK, "Nombre de Proyecto Obtenido");

  }

  async listDinamicsAssociations(data: IPacFilters): Promise<ApiResponse<IPagingData<IPacPrimary | number> | null>> {

    // const objInitial: IPacFilters = {
    //   page: data.page,
    //   perPage: data.perPage,
    //   exercise: data.exercise
    // }

    //* Paso 1. Busquemos los PosPre Sapiencia que se asocian a la vigencia requerida:
    // const getRoutesWithValidity = await this.pacRepository.listDinamicsAssoc(objInitial);

    console.log({data});



    return new ApiResponse(null, EResponseCodes.INFO, "En Construcción");

  }


}
