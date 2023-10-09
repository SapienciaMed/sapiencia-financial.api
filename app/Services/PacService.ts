import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import IPacRepository from "App/Repositories/PacRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

import { IReviewBudgetRoute,
         IBody,
         IResultProcRoutes,
         IResultProcRoutesWithErrors,
         IProjectPaginated,
         IFunctionalProjectPaginated} from '../Interfaces/PacInterfaces';
import { IProjectsRepository } from '../Repositories/ProjectsRepository';
import { IFundsFilters } from '../Interfaces/FundsInterfaces';
import { IFunctionalProject } from '../Interfaces/FunctionalProjectInterfaces';
import { IFiltersPosPreSapienciaMix } from '../Interfaces/PosPreSapienciaInterfaces';

import { IFundsRepository } from '../Repositories/FundsRepository';
import { IPosPreSapienciaRepository } from '../Repositories/PosPreSapienciaRepository';
import { IBudgetsRoutesRepository } from '../Repositories/BudgetsRoutesRepository';
import { IFunctionalProjectRepository } from '../Repositories/FunctionalProjectRepository';
import { IStrategicDirectionService } from './External/StrategicDirectionService';

export default interface IPacService {

    uploadPac(file: any, body: IBody): Promise<ApiResponse<any>>;
    reviewBudgetsRoute(processBudgetRoute: IReviewBudgetRoute[]): Promise<ApiResponse<IResultProcRoutes>>;
    transfersOnPac(data: any[]): Promise<ApiResponse<any>>;

}

export default class PacService implements IPacService {

    constructor(

      private pacRepository: IPacRepository,
      private projectsRepository: IProjectsRepository,
      private functionalProjectRepository: IFunctionalProjectRepository,
      private fundsRepository: IFundsRepository,
      private posPreSapienciaRepository: IPosPreSapienciaRepository,
      private budgetsRoutesRepository: IBudgetsRoutesRepository,
      private strategicDirectionService: IStrategicDirectionService

    ) { }

    uploadPac = async (file: any, _body: IBody ): Promise<ApiResponse<any>> => {

        // Obtener información y validación de excel
        const { validTemplateStatus,
                data,
                rowsWithFieldsEmpty,
                rowsWithFieldNumberInvalid } = await this.pacRepository.uploadPac(file);

        if (validTemplateStatus.error) {

            return new ApiResponse({validTemplateStatus, rowsWithFieldsEmpty, rowsWithFieldNumberInvalid}, EResponseCodes.FAIL, validTemplateStatus.message);

        }

        //* Validaciones de existencia de fonto, proyecto, pospre, ruta existente y ruta repetida
        const routesValidationRequest: ApiResponse<IResultProcRoutes> = await this.reviewBudgetsRoute(data);

        //TODO: Validaciones adicionales.

        //TODO: Insertar información.

        // return new ApiResponse({validTemplateStatus, rowsWithFieldsEmpty,rowsWithFieldNumberInvalid, data}, EResponseCodes.OK);
        return new ApiResponse(routesValidationRequest.data, EResponseCodes.OK, "Probando validaciones Sebastian");

    }

    async reviewBudgetsRoute(processBudgetRoute: IReviewBudgetRoute[]): Promise<ApiResponse<IResultProcRoutes | any>> {

      // let workingData: IReviewBudgetRoute[] = processBudgetRoute;

      // Para terminos de pruebas, voy a trabajar solo con 42 datos de los 118 (Va a arrojar errores)
      // let workingData: IReviewBudgetRoute[] = [];
      // for( let i = 0; i <= 41; i++ ){
      //   workingData.push(processBudgetRoute[i]);
      // }

      // Para terminos de pruebas, voy a trabajar solo con 15 datos de los 118 (Daría todo OK)
      let workingData: IReviewBudgetRoute[] = [];
      for( let i = 0; i <= 14; i++ ){
        workingData.push(processBudgetRoute[i]);
      }

      let projectsError: string[] = [];
      let fundsError: string[] = [];
      let posPreSapiError: string[] = [];
      let routesError: string[] = [];
      let routesNotFound: string[] = [];

      //Para validar las rutas repetidas, vamos guardando y al final validando.
      let repeatRoutesErrors: string[] = [];

      //Para guardar la respuesta a retornar
      let arrayResultCondensed: IResultProcRoutes[] = [];
      let arrayResultCondensedWithErrors: IResultProcRoutesWithErrors;

      for( let i : number = 0; i < workingData.length; i++ ){

        let pkProject     : number = 0;
        let pkFund        : number = 0;
        let pkPosPreOrg   : number = 0;
        let pkPosPreSap   : number = 0;
        let pkBudgetRoute : number = 0;


        //? >>>>> VALIDACIÓN DE PROYECTO <<<<<<< ?//
        const dataProject: string = workingData[i].project.toString();

        if(dataProject !== "9000000"){

          const filters: IProjectPaginated = {
            page: 1,
            perPage: 100,
          }

          const getProject = await this.strategicDirectionService.getProjectInvestmentPaginated( filters );

          for (const x of getProject.data.array) {

            if( x.projectCode === workingData[i].project.toString() ){

              const res = await this.projectsRepository.getProjectByInvestmentProjectId(x.id);
              pkProject = res!.id;

            }

          }

          if( pkProject === 0 ){

            projectsError.push(`Error en la fila de excel # ${workingData[i].rowExcel}, no se encontró el proyecto ${workingData[i].project.toString()}`);

          }

        }else{

          //Vamos a traernos el último proyecto funcional registrado y activo
          const filters: IFunctionalProjectPaginated = {
            active: true,
            page: 1,
            perPage: 100,
          }

          const res: IFunctionalProject | any = await this.functionalProjectRepository.getFunctionalProjectRequest( filters );
          const aVar = res.array[0].id
          pkProject = Number(aVar);

          if( !pkProject || pkProject === null || pkProject === undefined ){

            projectsError.push(`Error en la fila de excel # ${workingData[i].rowExcel}, no se encontró el proyecto ${workingData[i].project.toString()}`);

          }

        }

        //? >>>>> VALIDACIÓN DE FONDO <<<<<<< ?//
        const dataFund: string = workingData[i].fundSapiencia.toString();

        const filtersFunds: IFundsFilters = {
          page: 1,
          perPage: 100,
          number: dataFund,
        }

        const getFund = await this.fundsRepository.getFundsPaginated( filtersFunds );

        for (const y of getFund.array){

          if( y.number === dataFund){

            pkFund = Number(y.id);

          }

        }

        if( pkFund === 0 ){

          fundsError.push(`Error en la fila de excel # ${workingData[i].rowExcel}, no se encontró el fondo ${workingData[i].fundSapiencia.toString()}`);

        }

        //? >>>>> VALIDACIÓN DE POSPRE SAPIENCIA Y POSPRE ORIGEN <<<<<<< ?//
        const dataPosPreSapi: string = workingData[i].sapienciaBudgetPosition.toString();

        const filtersPosPreSapi: IFiltersPosPreSapienciaMix = {
          page: 1,
          perPage: 100,
          budgetNumberSapi: dataPosPreSapi,
        }

        const getPosPres = await this.posPreSapienciaRepository.getListPosPreSapVinculationPaginated( filtersPosPreSapi );

        for (const z of getPosPres.array){

          if( z.number === dataPosPreSapi){

            pkPosPreOrg = Number(z.budgetId);
            pkPosPreSap = Number(z.id);

          }

        }

        if( pkPosPreOrg === 0 || pkPosPreSap === 0){

          posPreSapiError.push(`Error en la fila de excel # ${workingData[i].rowExcel}, no se encontró el PosPre Sapiencia ${workingData[i].sapienciaBudgetPosition.toString()}`);

        }

        //? >>>>> VALIDACIÓN DE RUTAS REPETIDAS (DE UNA VEZ QUE TENEMOS LA DATA) <<<<<<< ?//
        const concatRouteDef = `${pkProject}.${pkFund}.${pkPosPreOrg}.${pkPosPreSap}`;
        const concactRouteInitial = `[${workingData[i].project}.${workingData[i].fundSapiencia}.${workingData[i].sapienciaBudgetPosition}]`

        if( repeatRoutesErrors.includes(concatRouteDef) ){

          routesError.push(`Error en la fila de excel # ${workingData[i].rowExcel}, ruta presupuestal repetida con [Proyecto.Fondo.PosPreSapiencia] = ${concactRouteInitial}`);

        }

        repeatRoutesErrors.push(concatRouteDef);

        //? >>>>> VALIDACIÓN DE RUTA PRESUPUESTAL <<<<<<< ?//
        const getBudgetRoute = await this.budgetsRoutesRepository.getBudgetForAdditions(pkProject, pkFund, pkPosPreOrg, pkPosPreSap)
        pkBudgetRoute = Number(getBudgetRoute?.id);

        if( !pkBudgetRoute || pkBudgetRoute == null ){

          routesNotFound.push(`Error en la fila de excel # ${workingData[i].rowExcel}, ruta presupuestal con [Proyecto.Fondo.PosPreSapiencia] = ${concactRouteInitial} no fue encontrada en la base de datos`);

        }else{

          //* ***** ARMAMOS EL OBJETO RESPUESTA, SI TENEMOS RUTA, ES PORQUE EL OBJETO SE PUEDE ARMAR ***** *//
          const finalObjProccess: IResultProcRoutes = {

            numberExcelRom: workingData[i].rowExcel,
            sourceType: "Propio",
            budgetRouteId: pkBudgetRoute,
            version: 1,
            exercise: 2023,
            isActive: true,
            dateModify: new Date(),
            dateCreate: new Date(),
            pacAnnualizationProgrammed: workingData[i].pacAnnualization[0],
            pacAnnualizationCollected: workingData[i].pacAnnualization[1],

          }

          arrayResultCondensed.push(finalObjProccess);

        }

      } //* FOR GENERAL

      // console.log({ErroresProyectos: projectsError});
      // console.log({ErroresFondos: fundsError});
      // console.log({ErroresPosPreSapi: posPreSapiError});
      // console.log({ErroresRutasRepetidas: routesError});
      // console.log({ErroresRutasNoEncontradas: routesNotFound});

      //? >>>>> FINALMENTE DEBERÍAMOS ARMAR EL OBJETO DE RESPUESTA <<<<<<< ?//
      //TODO: Si tenemos errores, ¿Lo deberíamos armar o no?, NO DEBERÍAMOS, entonce ...
      if( projectsError.length <= 0 ||
          fundsError.length <= 0 ||
          posPreSapiError.length <= 0 ||
          routesError.length <= 0 ||
          routesNotFound.length <= 0) {

          const objOk: IResultProcRoutesWithErrors | IResultProcRoutes = {

            condensed: arrayResultCondensed as IResultProcRoutes,
            projectsError: projectsError,
            fundsError: fundsError,
            posPreSapiError: posPreSapiError,
            routesError: routesError,
            routesNotFound: routesNotFound,

          }

          arrayResultCondensedWithErrors = objOk;
          return new ApiResponse(arrayResultCondensedWithErrors, EResponseCodes.OK, "Validaciones pasadas con éxito!");

      }

      const objErrors: IResultProcRoutesWithErrors | IResultProcRoutes = {

        projectsError: projectsError,
        fundsError: fundsError,
        posPreSapiError: posPreSapiError,
        routesError: routesError,
        routesNotFound: routesNotFound,

      }

      arrayResultCondensedWithErrors = objErrors;
      return new ApiResponse(arrayResultCondensedWithErrors, EResponseCodes.FAIL, "Se tuvieron errores, no se pasaron todas las validaciones");

    }

    async transfersOnPac(data: any[]): Promise<ApiResponse<any>> {

      console.log(data);
      return new ApiResponse(null, EResponseCodes.INFO, "Método para transferencias en el PAC");

    }


}
