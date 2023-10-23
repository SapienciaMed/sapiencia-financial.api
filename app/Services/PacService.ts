import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import IPacRepository from "App/Repositories/PacRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";

import {
  IBody,
  IDinamicListForFunds,
  IDinamicListForPospres,
  IDinamicListForProjects,
  IErrosPac,
  IFunctionalProjectPaginated,
  IPacAnnualAdapter,
  IPacComplementary,
  IPacFilters,
  IPacPrimary,
  IProjectPaginated,
  IResultProcRoutes,
  IResultProcRoutesWithErrors,
  IReviewBudgetRoute,
  ITotalsByTransfers,
} from '../Interfaces/PacInterfaces';

import { IProjectsRepository } from '../Repositories/ProjectsRepository';
import { IFundsFilters } from '../Interfaces/FundsInterfaces';
import { IFunctionalProject } from '../Interfaces/FunctionalProjectInterfaces';
import { IFiltersPosPreSapienciaMix } from '../Interfaces/PosPreSapienciaInterfaces';

import { IResultSearchAnnualizationByRoute, ITotalsSimple } from '../Interfaces/PacInterfaces';
import { DataTransferPac, IDestinity, IDestinityNoAnnual } from '../Interfaces/PacTransferInterface';
import { IFunctionalProjectRepository } from "App/Repositories/FunctionalProjectRepository";
import { IFundsRepository } from "App/Repositories/FundsRepository";
import { IPosPreSapienciaRepository } from "App/Repositories/PosPreSapienciaRepository";
import { IBudgetsRoutesRepository } from "App/Repositories/BudgetsRoutesRepository";
import { IStrategicDirectionService } from "./External/StrategicDirectionService";

export default interface IPacService {

  uploadPac(file: any, body: IBody): Promise<ApiResponse<any>>;
  reviewBudgetsRoute(processBudgetRoute: IReviewBudgetRoute[]): Promise<ApiResponse<IResultProcRoutes>>;
  transfersOnPac(data: DataTransferPac): Promise<ApiResponse<DataTransferPac | null>>;
  validityList(filters: IPacFilters): Promise<ApiResponse<IPagingData<IPacPrimary | string>>>;
  resourcesTypeList(filters: IPacFilters): Promise<ApiResponse<IPagingData<IPacPrimary | string>>>;
  listDinamicsRoutes(filters: IPacFilters): Promise<ApiResponse<IPagingData<IPacPrimary | number>>>;
  searchAnnualDataRoutes(data: IPacAnnualAdapter): Promise<ApiResponse<IPagingData<IPacPrimary> | IResultSearchAnnualizationByRoute | IPacFilters | null>>;

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

  uploadPac = async (file: any, body: IBody): Promise<ApiResponse<any>> => {

    // Obtener información y validación de excel
    // Acciones por tipo de PAC.
    let exercise = body.exercise;
    let typePac = body.typePac;

    let pacsByExercise = await this.pacRepository.getPacByExcercise(exercise)

    let pacsByExerciseFixed = pacsByExercise.map(e => {
      e.$attributes['pacAnnualizations'] = {
        programmed: e?.$preloaded?.pacAnnualizations[0]?.$attributes,
        collected: e?.$preloaded?.pacAnnualizations[1]?.$attributes
      }
        ;

      return e.$attributes
    }
    )

    let version = this.getMajorVersion(pacsByExerciseFixed);
    let versionFixed: number = version ? version : 1;

    let loadedRoutesCurrentExcersice = pacsByExerciseFixed.filter(e => e.version == versionFixed)

    const { validTemplateStatus,
      data,
      rowsWithFieldsEmpty,
      rowsWithFieldNumberInvalid } = await this.pacRepository.uploadPac(file);
    
      if (validTemplateStatus.error) {
      return new ApiResponse({ validTemplateStatus, rowsWithFieldsEmpty, rowsWithFieldNumberInvalid }, EResponseCodes.FAIL, validTemplateStatus.message);
    }

    //* Validaciones de existencia de fondo, proyecto, pospre, ruta existente y ruta repetida
    body.version = body.typePac == 'Nueva versión' ? versionFixed + 1 : versionFixed;
    if (rowsWithFieldsEmpty.length > 0) {
      return new ApiResponse({ responseSave: false, errors: rowsWithFieldsEmpty }, EResponseCodes.OK, "Algún dato de la ruta está vacío");
      //return new ApiResponse({errors:validTemplateStatus.concat(rowsWithFieldsEmpty).concat(rowsWithFieldNumberInvalid)} , EResponseCodes.FAIL, "Algún dato de la ruta está vacío");
    }
    const routesValidationRequest: ApiResponse<IResultProcRoutes> = await this.reviewBudgetsRoute(data, body);

    let errors: IErrosPac[] = [];

    if (rowsWithFieldNumberInvalid.length > 0) {
      errors.push(...rowsWithFieldNumberInvalid)
    }

    routesValidationRequest?.data?.errors?.length! > 0 && errors.push(...routesValidationRequest.data.errors!)

    /* routesValidationRequest.data.errors?.forEach((err:IErrosPac, index:number)=>{
      errors.push(err)
    }) */
    let validateValuesByTypePac = this.validateValuesByTypePac(typePac, routesValidationRequest.data, loadedRoutesCurrentExcersice, versionFixed)
    let dataToUpdate;
    errors.push(...validateValuesByTypePac)
    let responseSave;
    switch (typePac) {
      case 'Carga inicial':
        if (pacsByExercise.length > 0) {
          return new ApiResponse({ responseSave: false, errors }, EResponseCodes.FAIL, "La carga inicial ya fue cargada, debe seleccionar Nueva versión");
        }
        responseSave = errors.length == 0 && await this.pacRepository.updateOrCreatePac(routesValidationRequest.data)
        break;
      case 'Adición':
        // ya debe existir una carga inicial
        if (pacsByExercise.length == 0) {
          return new ApiResponse({ responseSave: false, errors }, EResponseCodes.FAIL, "No tiene registros en la carga inicial, debe seleccionar carga inicial");
        }
        dataToUpdate = this.structureDataPacToUpdate(Object(routesValidationRequest).data.condensed, loadedRoutesCurrentExcersice)
        errors.length == 0 && await this.pacRepository.updatePacExcersiceVersion(dataToUpdate)
        break;
      case 'Reducción':
        /* ya debe existir una carga inicial */
        if (pacsByExercise.length == 0) {
          return new ApiResponse({ responseSave: false, errors }, EResponseCodes.FAIL, "No tiene registros en la carga inicial, debe seleccionar carga inicial");
        }

        dataToUpdate = this.structureDataPacToUpdate(Object(routesValidationRequest).data.condensed, loadedRoutesCurrentExcersice)
        errors.length == 0 && await this.pacRepository.updatePacExcersiceVersion(dataToUpdate)
        break;
      case 'Recaudo':
        // ya debe existir una carga inicial
        if (pacsByExercise.length == 0) {
          return new ApiResponse({ responseSave: false, errors }, EResponseCodes.FAIL, "No tiene registros en la carga inicial, debe seleccionar carga inicial");
        }
        dataToUpdate = this.structureDataPacToUpdate(Object(routesValidationRequest).data.condensed, loadedRoutesCurrentExcersice)
        errors.length == 0 && await this.pacRepository.updatePacExcersiceVersion(dataToUpdate)

        let validateCreatedRoutes = this.validatePreviouslyCreatedExerciseRoutes(loadedRoutesCurrentExcersice, routesValidationRequest.data);
        errors.push(...validateCreatedRoutes)
        break;
      case 'Nueva versión':
        // ya debe existir una carga inicial
        if (pacsByExercise.length == 0) {
          return new ApiResponse({ responseSave: false, errors }, EResponseCodes.FAIL, "No tiene registros en la carga inicial, debe seleccionar carga inicial");
        }
        let responseValidateNewVersion = this.validateRoutesWithCollectionInNewVersion(loadedRoutesCurrentExcersice, routesValidationRequest.data);
        errors.push(...responseValidateNewVersion)
        responseSave = errors.length == 0 && await this.pacRepository.updateOrCreatePac(routesValidationRequest.data)
        errors.length == 0 && await this.pacRepository.inactivateVersionPac(versionFixed, pacsByExerciseFixed)
        break;
      default:
        break;
    }
    //console.log({routesError:routesValidationRequest.data.routesError})
    //console.log({routesNotFound:routesValidationRequest.data.routesNotFound})

    if (errors.length > 0) {
      return new ApiResponse({ responseSave, errors }, EResponseCodes.OK, "El archivo no pudo ser cargado, revisa las validaciones.");
    }
    // return new ApiResponse({validTemplateStatus, rowsWithFieldsEmpty,rowsWithFieldNumberInvalid, data}, EResponseCodes.OK);
    return new ApiResponse({ responseSave, errors }, EResponseCodes.OK, "¡Guardado exitosamente!");

  }

  getMajorVersion = (pacsByExerciseFixed: any) => {
    return pacsByExerciseFixed.reduce((mayorVersion, pacs) => {
      return Math.max(mayorVersion, pacs.version);
    }, 1); // Inicializar con un valor muy bajo
  }

  validatePreviouslyCreatedExerciseRoutes = (loadedRoutesCurrentExcersice: any, dataExcel: any) => {

    // Si es recaudo, no pueden existir rutas en el excel y que estas no esten creadas

    const errors: IErrosPac[] = [];

    dataExcel.condensed.forEach((excelItem, index) => {
      if (index == 0) { index += 1 }
      const budgetRouteId = excelItem.budgetRouteId;
      const matchingRoute = loadedRoutesCurrentExcersice.find((route) => route.budgetRouteId === budgetRouteId);

      if (!matchingRoute) {
        // No se encontró una coincidencia, agregar un objeto de error al array errors
        errors.push({
          message: "La ruta no ha sido previamente creada en el PAC",
          error: true,
          rowError: index + 1,
          columnError: null,
        });
      }
    });

    // El array errors ahora contiene los objetos de error para las filas que no tienen coincidencias
    return errors;

    //Si es recaudo, Las rutas que tienen recaudo si o si deben venir en la nueva version

  }

  // validar rutas con recaudo vengan en nueva version de excel
  validateRoutesWithCollectionInNewVersion = (loadedRoutesCurrentExcersice: any, dataExcel: any) => {
    let errors: IErrosPac[] = [];
    loadedRoutesCurrentExcersice.forEach((e: any, index: number) => {
      let totalCollected = e.pacAnnualizations.collected?.jan +
        e.pacAnnualizations.collected?.feb +
        e.pacAnnualizations.collected?.mar +
        e.pacAnnualizations.collected?.abr +
        e.pacAnnualizations.collected?.may +
        e.pacAnnualizations.collected?.jun +
        e.pacAnnualizations.collected?.jul +
        e.pacAnnualizations.collected?.ago +
        e.pacAnnualizations.collected?.sep +
        e.pacAnnualizations.collected?.oct +
        e.pacAnnualizations.collected?.nov +
        e.pacAnnualizations.collected?.dec

      if (totalCollected >= 0) {
        let budgetRouteIdMatch = dataExcel.condensed.find(el => el.budgetRouteId == e.budgetRouteId)
        if (index == 0) { index += 1 }
        if (!budgetRouteIdMatch) {
          errors.push({
            message: "Existen registros en el PAC con recaudos que no están en la nueva carga de archivo",
            error: true,
            rowError: index + 1,
            columnError: null,
          });
        }

      }

    })
    return errors;
  }

  structureDataPacToUpdate = (dataExcel: any, loadedRoutesCurrentExcersice: any) => {
    let dataExcelFixed: any[] = [];
    dataExcel.forEach(e => {
      let budgetRouteMatch = loadedRoutesCurrentExcersice.find(el => el.budgetRouteId == e.budgetRouteId)
      if (budgetRouteMatch) {
        e['id'] = budgetRouteMatch.id;
        e.pacAnnualizationProgrammed['id'] = budgetRouteMatch.pacAnnualizations.programmed.id;
        e.pacAnnualizationCollected['id'] = budgetRouteMatch.pacAnnualizations.collected.id;
        dataExcelFixed.push(e)
      } else {
        e['id'] = null;
        e.pacAnnualizationProgrammed['id'] = null;
        e.pacAnnualizationCollected['id'] = null
        dataExcelFixed.push(e)
      }

    })
    return dataExcelFixed;
  }

  async reviewBudgetsRoute(processBudgetRoute: IReviewBudgetRoute[], body?: IBody): Promise<ApiResponse<IResultProcRoutes | any>> {

    // Para terminos de pruebas, voy a trabajar solo con 15 datos de los 118 (Daría todo OK)
    let workingData: IReviewBudgetRoute[] = [];
    for (let i = 0; i < processBudgetRoute.length; i++) {
      workingData.push(processBudgetRoute[i]);
    }
    let errors: IErrosPac[] = [];
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

    for (let i: number = 0; i < workingData.length; i++) {

      let pkProject: number = 0;
      let pkFund: number = 0;
      let pkPosPreOrg: number = 0;
      let pkPosPreSap: number = 0;
      let pkBudgetRoute: number = 0;
      let balanceRoute: number = 0;

      //? >>>>> VALIDACIÓN DE PROYECTO <<<<<<< ?//
      /* console.log({workingData:workingData[i],i}) */
      const dataProject: string = workingData[i]?.project?.toString();
      if (dataProject !== "9000000") {

        const filters: IProjectPaginated = {
          page: 1,
          perPage: 100,
        }
        const getProject = await this.strategicDirectionService.getProjectInvestmentPaginated(filters);
        for (const x of getProject.data.array) {
          if (x.projectCode === workingData[i].project?.toString()) {

            const res = await this.projectsRepository.getProjectByInvestmentProjectId(x.id);
            pkProject = res!.id;

          }

        }
        if (pkProject === 0) {
          projectsError.push(`Error en la fila de excel # ${workingData[i].rowExcel}, no se encontró el proyecto ${workingData[i].project?.toString()}`);

        }

      } else {
        //Vamos a traernos el último proyecto funcional registrado y activo
        const filters: IFunctionalProjectPaginated = {
          active: true,
          page: 1,
          perPage: 100,
        }

        const res: IFunctionalProject | any = await this.functionalProjectRepository.getFunctionalProjectRequest(filters);
        const aVar = res.array[0].id
        pkProject = Number(aVar);

        if (!pkProject || pkProject === null || pkProject === undefined) {
          projectsError.push(`Error en la fila de excel # ${workingData[i].rowExcel}, no se encontró el proyecto ${workingData[i].project?.toString()}`);

        }

      }
      //? >>>>> VALIDACIÓN DE FONDO <<<<<<< ?//
      const dataFund: string = workingData[i].fundSapiencia?.toString();

      const filtersFunds: IFundsFilters = {
        page: 1,
        perPage: 100,
        number: dataFund,
      }

      const getFund = await this.fundsRepository.getFundsPaginated(filtersFunds);

      for (const y of getFund.array) {

        if (y.number === dataFund) {

          pkFund = Number(y.id);

        }

      }

      if (pkFund === 0) {

        fundsError.push(`Error en la fila de excel # ${workingData[i].rowExcel}, no se encontró el fondo ${workingData[i].fundSapiencia.toString()}`);

      }

      //? >>>>> VALIDACIÓN DE POSPRE SAPIENCIA Y POSPRE ORIGEN <<<<<<< ?//
      const dataPosPreSapi: string = workingData[i].sapienciaBudgetPosition?.toString();

      const filtersPosPreSapi: IFiltersPosPreSapienciaMix = {
        page: 1,
        perPage: 100,
        budgetNumberSapi: dataPosPreSapi,
      }
      const getPosPres = await this.posPreSapienciaRepository.getListPosPreSapVinculationPaginated(filtersPosPreSapi);
      for (const z of getPosPres.array) {

        if (z.number === dataPosPreSapi) {

          pkPosPreOrg = Number(z.budgetId);
          pkPosPreSap = Number(z.id);

        }

      }

      if (pkPosPreOrg === 0 || pkPosPreSap === 0) {

        posPreSapiError.push(`Error en la fila de excel # ${workingData[i].rowExcel}, no se encontró el PosPre Sapiencia ${workingData[i].sapienciaBudgetPosition?.toString()}`);

      }

      //? >>>>> VALIDACIÓN DE RUTAS REPETIDAS (DE UNA VEZ QUE TENEMOS LA DATA) <<<<<<< ?//
      const concatRouteDef = `${pkProject}.${pkFund}.${pkPosPreOrg}.${pkPosPreSap}`;
      const concactRouteInitial = `[${workingData[i].project}.${workingData[i].fundSapiencia}.${workingData[i].sapienciaBudgetPosition}]`

      if (repeatRoutesErrors.includes(concatRouteDef)) {
        routesError.push(`Error en la fila de excel # ${workingData[i].rowExcel}, ruta presupuestal repetida con [Proyecto.Fondo.PosPreSapiencia] = ${concactRouteInitial}`);
        errors.push({
          message: 'Tiene rutas duplicadas en el archivo',
          error: true,
          rowError: workingData[i].rowExcel
        })
      }
      repeatRoutesErrors.push(concatRouteDef);

      //? >>>>> VALIDACIÓN DE RUTA PRESUPUESTAL <<<<<<< ?//
      const getBudgetRoute = await this.budgetsRoutesRepository.getBudgetForAdditions(pkProject, pkFund, pkPosPreOrg, pkPosPreSap)
      pkBudgetRoute = Number(getBudgetRoute?.id);
      balanceRoute = Number(getBudgetRoute?.balance);

      if (!pkBudgetRoute || pkBudgetRoute == null) {
        routesNotFound.push(`Error en la fila de excel # ${workingData[i].rowExcel}, ruta presupuestal con [Proyecto.Fondo.PosPreSapiencia] = ${concactRouteInitial} no fue encontrada en la base de datos`);
        errors.push({
          message: 'La ruta presupuestal no existe',
          error: true,
          rowError: workingData[i].rowExcel
        })
      } else {
        //* ***** ARMAMOS EL OBJETO RESPUESTA, SI TENEMOS RUTA, ES PORQUE EL OBJETO SE PUEDE ARMAR ***** *//
        workingData[i].pacAnnualization[0]['totalBudget'] = workingData[i].totalBudget;
        workingData[i].pacAnnualization[1]['totalBudget'] = workingData[i].totalBudget;
        const finalObjProccess: IResultProcRoutes = {

          numberExcelRom: workingData[i].rowExcel,
          sourceType: body!.typeSource,
          budgetRouteId: pkBudgetRoute,
          balance: balanceRoute,
          version: body!.version,
          exercise: body!.exercise,
          isActive: true,
          dateModify: new Date(),
          dateCreate: new Date(),
          pacAnnualizationProgrammed: workingData[i].pacAnnualization[0],
          pacAnnualizationCollected: workingData[i].pacAnnualization[1]
        }

        arrayResultCondensed.push(finalObjProccess);

      }
    } //* FOR GENERAL
    //? >>>>> FINALMENTE DEBERÍAMOS ARMAR EL OBJETO DE RESPUESTA <<<<<<< ?//
    if (projectsError.length <= 0 ||
      fundsError.length <= 0 ||
      posPreSapiError.length <= 0 ||
      routesError.length <= 0 ||
      routesNotFound.length <= 0 ||
      errors.length <= 0
    ) {

      const objOk: IResultProcRoutesWithErrors | IResultProcRoutes = {

        condensed: arrayResultCondensed as IResultProcRoutes,
        projectsError: projectsError,
        fundsError: fundsError,
        posPreSapiError: posPreSapiError,
        routesError: routesError,
        routesNotFound: routesNotFound,
        errors
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
      errors
    }

    arrayResultCondensedWithErrors = objErrors;
    return new ApiResponse(arrayResultCondensedWithErrors, EResponseCodes.FAIL, "Se tuvieron errores, no se pasaron todas las validaciones");

  }

  validateValuesByTypePac = (typePac: string, data: any, loadedRoutesCurrentExcersice: any, version: any) => {

    let errorsDetected: IErrosPac[] = []
    data.condensed.forEach((e: any, index: number) => {
      let balance = e.balance;
      if (index == 0) { index += 1 }
      let bugetPrgrammed = e.pacAnnualizationProgrammed.jan +
        e.pacAnnualizationProgrammed.feb +
        e.pacAnnualizationProgrammed.mar +
        e.pacAnnualizationProgrammed.abr +
        e.pacAnnualizationProgrammed.may +
        e.pacAnnualizationProgrammed.jun +
        e.pacAnnualizationProgrammed.jul +
        e.pacAnnualizationProgrammed.ago +
        e.pacAnnualizationProgrammed.sep +
        e.pacAnnualizationProgrammed.oct +
        e.pacAnnualizationProgrammed.nov +
        e.pacAnnualizationProgrammed.dec

      if (balance <= 0 || balance != e.pacAnnualizationProgrammed.totalBudget) {
        errorsDetected.push({
          message: "El valor del presupuesto no es correcto",
          error: true,
          rowError: index + 1,
          columnError: null
        })
      }


      if (typePac == 'Carga inicial' || typePac == 'adición' || typePac == 'Reducción' || typePac == 'Nueva versión') {

        // Valida que el valor total presupuestado coincida con el total programado de los meses
        if (bugetPrgrammed != e.pacAnnualizationProgrammed.totalBudget) {
          errorsDetected.push({
            message: "No coincide valor programado con valor presupuesto sapiencia",
            error: true,
            rowError: index + 1,
            columnError: null
          })
        }

      }
      //
      let lastCollected = loadedRoutesCurrentExcersice.filter(el => el.version == version && el.sourceType == e.sourceType && el.budgetRouteId == e.budgetRouteId);

      let lastCollectedTotal = lastCollected[0].pacAnnualizations.collected.jan
      + lastCollected[0].pacAnnualizations.collected.feb
      + lastCollected[0].pacAnnualizations.collected.mar
      + lastCollected[0].pacAnnualizations.collected.abr
      + lastCollected[0].pacAnnualizations.collected.may
      + lastCollected[0].pacAnnualizations.collected.jun
      + lastCollected[0].pacAnnualizations.collected.jul
      + lastCollected[0].pacAnnualizations.collected.ago
      + lastCollected[0].pacAnnualizations.collected.sep
      + lastCollected[0].pacAnnualizations.collected.oct
      + lastCollected[0].pacAnnualizations.collected.nov
      + lastCollected[0].pacAnnualizations.collected.dec
      
      if (typePac != 'Carga inicial') {
        let bugetCollectec = e.pacAnnualizationCollected.jan +
          e.pacAnnualizationCollected.feb +
          e.pacAnnualizationCollected.mar +
          e.pacAnnualizationCollected.abr +
          e.pacAnnualizationCollected.may +
          e.pacAnnualizationCollected.jun +
          e.pacAnnualizationCollected.jul +
          e.pacAnnualizationCollected.ago +
          e.pacAnnualizationCollected.sep +
          e.pacAnnualizationCollected.oct +
          e.pacAnnualizationCollected.nov +
          e.pacAnnualizationCollected.dec

        // Valida que el valor total presupuestado coincida con el total programado de los meses  

        if (typePac == 'Recaudo' && bugetCollectec > e.pacAnnualizationCollected.totalBudget) {
          errorsDetected.push({
            message: "La suma de los recaudos a incluir es mayor al presupuesto sapiencia",
            error: true,
            rowError: index + 1,
            columnError: null
          })
        } else if (typePac != 'Recaudo' && lastCollectedTotal > e.pacAnnualizationCollected.totalBudget) {
          errorsDetected.push({
            message: "El recaudo previamente guardado en el PAC es mayor al presupuesto sapiencia que va a ingresar",
            error: true,
            rowError: index + 1,
            columnError: null
          })


        }

      }

      if (typePac == 'Carga inicial' || typePac == 'Recaudo') {
        // Valida que el valor presupuesto Sapiensa sea mayo que cero

        if (parseFloat(e.pacAnnualizationProgrammed.totalBudget) <= 0 && typePac == 'Carga inicial') {
          errorsDetected.push({
            message: "Debe tener dato en presupuesto sapiencia y en lo programado del mes",
            error: true,
            rowError: index + 1,
            columnError: null
          })
        } else if (parseFloat(e.pacAnnualizationCollected.totalBudget) < 0 && typePac == 'Recaudo') {
          errorsDetected.push({
            message: "El recaudo no tiene presupuesto sapiencia",
            error: true,
            rowError: index + 1,
            columnError: null
          })
        }
      }

      if (typePac == 'Carga inicial') {
        // Valida que el valor presupuesto Sapiensa sea mayo que cero
        if (parseFloat(e.pacAnnualizationProgrammed.totalBudget) <= 0) {
          errorsDetected.push({
            message: "Debe tener dato en presupuesto sapiencia y en lo programado del mes",
            error: true,
            rowError: index + 1,
            columnError: null
          })
        }
      }

    })

    //console.log({ errorsDetected })
    return errorsDetected;
  }

  async validityList(filters: IPacFilters): Promise<ApiResponse<IPagingData<IPacPrimary | string>>> {

    const res = await this.pacRepository.validityList(filters);
    return new ApiResponse(res, EResponseCodes.OK);

  }

  async resourcesTypeList(filters: IPacFilters): Promise<ApiResponse<IPagingData<IPacPrimary | string>>> {

    const res = await this.pacRepository.resourcesTypeList(filters);
    return new ApiResponse(res, EResponseCodes.OK);

  }

  async listDinamicsRoutes(filters: IPacFilters): Promise<ApiResponse<IPagingData<IPacPrimary | number> | IPacComplementary | IPacFilters>> {

    //* Paso 0. Objeto inicial:
    const objInitial: IPacFilters = {
      page: filters.page,
      perPage: filters.perPage,
      pacType: filters.pacType,
      exercise: filters.exercise,
      resourceType: filters.resourceType
    }

    //* Paso 1. Hallemos las rutas presupuestales involucradas:
    const res = await this.pacRepository.listDinamicsRoutes(filters);

    if (!res || res.array.length <= 0) return new ApiResponse(objInitial, EResponseCodes.INFO, "No se encontraron rutas presupuestales con la vigencia y el tipo de recurso proporcionados.");

    //* Paso 2. Hallemos las PKs de Proyecto, Fondo y Pospre Sapi (Si pasamos la validación anterior aquí debería haber data):
    let arrayProjects: number[] = [];  // Vinculation Project
    let arrayFunds: number[] = [];     // Fund Number
    let arrayPosPreOrg: number[] = []; // PosPre Orig Number
    let arrayPosPreSap: number[] = []; // PosPre Sapi Number

    let listBudgetsRoutes: number[] = [];

    for (const seedAvailable of res.array) {

      const res: any = seedAvailable;
      const { budgetRouteId } = res;
      listBudgetsRoutes.push(budgetRouteId);

      const getRouteData = await this.budgetsRoutesRepository.getBudgetsRoutesById(budgetRouteId);

      //* Paso 3. Llenamos los arrays de una vez con las FK -> PK
      arrayProjects.push(getRouteData?.idProjectVinculation!);
      arrayFunds.push(getRouteData?.idFund!);
      arrayPosPreOrg.push(getRouteData?.idBudget!);
      arrayPosPreSap.push(getRouteData?.idPospreSapiencia!);

    }

    //* Paso 4. Hallemos la data que corresponda a los array y llenemos los objetos
    let listProjects: IDinamicListForProjects[] = [];
    let listFunds: IDinamicListForFunds[] = [];
    let listPospreSapi: IDinamicListForPospres[] = [];


    //* Sub Paso, 4.1. Vamos a hallar el fondo
    for (const fund of arrayFunds) {

      const getFund = await this.fundsRepository.getFundsById(fund);

      if (getFund!.id === fund) {

        const myObjForProjectList: IDinamicListForFunds = {

          idFund: getFund!.id,
          fundCode: getFund!.number

        }

        listFunds.push(myObjForProjectList);

      }

    }

    //* Sub Paso, 4.2. Vamos a hallar el pospre sapi
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

    //* Sub Paso, 4.3. Vamos a hallar el proyecto.
    let contForFunctionalProj: number = 0;
    for (const proj of arrayProjects) {

      const vinculationPK = Number(proj);
      let projectFunctionalName: string = "";

      //Consulto vinculaciones de proyectos
      const getVinculation = await this.projectsRepository.getProjectById(vinculationPK);

      const numberFunctionalArea: string = getVinculation?.areaFuntional?.number?.toString()!;

      //Debo verificar si es un proyecto de funcionamiento, si es así, debo asociar al pospre sapi
      //como estoy manejando arrays, contendre la posición auxiliar como un contador genérico:
      //?Guardemoslo de una vez :) ... para no tener que validar más abajo
      if (getVinculation?.operationProjectId && getVinculation?.operationProjectId != null) {

        projectFunctionalName = listPospreSapi[contForFunctionalProj].descriptionSapi;

        const myObjForProjectList: IDinamicListForProjects = {

          idVinculation: vinculationPK,
          idProjectPlanning: getVinculation.id,
          projectCode: "9000000",
          posPreSapiRef: listPospreSapi[contForFunctionalProj].numberCodeSapi,
          projectName: projectFunctionalName,
          numberFunctionalArea: numberFunctionalArea,

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
            projectName: xProjPlanning.name,
            numberFunctionalArea: numberFunctionalArea,

          }

          listProjects.push(myObjForProjectList);

        }

      }

    }

    const resultData: IPacComplementary = {

      headerComposition: objInitial,
      listBudgetsRoutes: listBudgetsRoutes,
      listProjects: listProjects,
      listFunds: listFunds,
      listPospreSapi: listPospreSapi

    }

    return new ApiResponse(resultData, EResponseCodes.OK, "Listados proporcioados a través de la vigencia y el tipo de recurso.");

  }

  async searchAnnualDataRoutes(data: IPacAnnualAdapter): Promise<ApiResponse<IPagingData<IPacPrimary> | IResultSearchAnnualizationByRoute | IPacFilters | null>> {

    const {
      pacType, //2 - Programado, 3 - Recaudado , 4 - Ambos
      exercise,
      resourceType,
      managementCenter,
      idProjectVinculation,
      idBudget,
      idPospreSapiencia,
      idFund,
      idCardTemplate
    } = data;

    const objHeaderInitial: IPacFilters = {
      page: 1,
      perPage: 1000000,
      pacType,
      exercise,
      resourceType,
      idCardTemplate
    }

    const objSearchRouteAndAnnual: IPacFilters = {
      page: 1,
      perPage: 1000000,
      pacType,
      exercise: data.exercise,
      resourceType,
      managementCenter,
      idProjectVinculation,
      idBudget,
      idPospreSapiencia,
      idFund,
      idCardTemplate
    }

    //* Primero encontremos las rutas que hacen parte del objHeaderInitial
    //? Cuando hallemos la ruta con objSearchRouteAndAnnual, el idRoute será paneado con el listado disponible
    //? si se encuentran datos, re usamos el mismo método pero para traer sus distribución anual.
    let arrayRoutesIdOnPac: number[] = []; //Rutas
    let arrayPacsIdOnPac: number[] = [];   //Pacs

    const getPacs = await this.pacRepository.searchPacByMultiData(objHeaderInitial);

    if (!getPacs || getPacs.array.length <= 0) return new ApiResponse(null, EResponseCodes.FAIL, "No tenemos PACs con la vigencia y/o tipo recurso dados");

    for (const w of getPacs.array) {
      arrayRoutesIdOnPac.push(w?.budgetRouteId!);
      arrayPacsIdOnPac.push(w?.id!);
    }

    // console.log(objSearchRouteAndAnnual.idProjectVinculation);
    // console.log(objSearchRouteAndAnnual.idFund);
    // console.log(objSearchRouteAndAnnual.idBudget);
    // console.log(objSearchRouteAndAnnual.idPospreSapiencia);

    //* Hallamos ruta con la data proporcionada inicialmente:
    const getRoute = await this.budgetsRoutesRepository
      .getBudgetForAdditions(objSearchRouteAndAnnual.idProjectVinculation!,
        objSearchRouteAndAnnual.idFund!,
        objSearchRouteAndAnnual.idBudget!,
        objSearchRouteAndAnnual.idPospreSapiencia!)

    if (!getRoute) {
      // Devolvemos con la CARD incluida para que se pinte el error si es el caso de que no encontró combinación ruta.
      return new ApiResponse(objSearchRouteAndAnnual, EResponseCodes.FAIL, "No se encontró la ruta presupuestal");

    }

    //* Comparamos si la ruta proporcionada está dentro del PAC:
    let controlBand: boolean = false;
    let viewPac: number = 0;
    const viewType: string = objHeaderInitial.pacType?.toString()!;
    for (const x of getPacs.array) {

      if (Number(x?.budgetRouteId) === Number(getRoute.id)) {

        controlBand = true;
        viewPac = Number(x?.id);

      }

    }

    //* Con base a lo anterior, obtenemos las anualizaciones respectivas:
    if (!controlBand || viewPac === 0) {

      return new ApiResponse(objSearchRouteAndAnnual, EResponseCodes.FAIL, "La ruta presupuestal no se encuentra dispuesta para la vigencia y/o tipo recurso dados");

    }

    //* Obtengamos la anualización coincidente:
    const getAnnualization = await this.pacRepository.getAnnualizationsByPacAndType(viewPac, viewType);

    if (!getAnnualization || getAnnualization.array.length <= 0) {

      return new ApiResponse(objSearchRouteAndAnnual, EResponseCodes.FAIL, "La ruta presupuestal no tiene asociada anualización, esto es un error");

    }

    //* Calculemos los totales programado y recaudado
    let totalProgramming: number = 0;
    let totalCollected: number = 0;

    for (const annualizations of getAnnualization.array) {

      if( annualizations?.type == "Programado" ){

        totalProgramming += (Number(annualizations!.jan) +
                             Number(annualizations!.feb) +
                             Number(annualizations!.mar) +
                             Number(annualizations!.abr) +
                             Number(annualizations!.may) +
                             Number(annualizations!.jun) +
                             Number(annualizations!.jul) +
                             Number(annualizations!.ago) +
                             Number(annualizations!.sep) +
                             Number(annualizations!.oct) +
                             Number(annualizations!.nov) +
                             Number(annualizations!.dec))

      }else{

        totalCollected += (Number(annualizations!.jan) +
                           Number(annualizations!.feb) +
                           Number(annualizations!.mar) +
                           Number(annualizations!.abr) +
                           Number(annualizations!.may) +
                           Number(annualizations!.jun) +
                           Number(annualizations!.jul) +
                           Number(annualizations!.ago) +
                           Number(annualizations!.sep) +
                           Number(annualizations!.oct) +
                           Number(annualizations!.nov) +
                           Number(annualizations!.dec))

      }

    }

    const objTotals: ITotalsSimple = {

      totalProgramming,
      totalCollected

    }

    const objResult: IResultSearchAnnualizationByRoute = {

      headerResult: objHeaderInitial,
      routeResult: getRoute,
      annualRoute: getAnnualization.array,
      totalsRes: objTotals

    }

    return new ApiResponse(objResult, EResponseCodes.OK, "Obteniendo las anualizaciones e información de ruta");

  }

  async transfersOnPac(data: DataTransferPac): Promise<ApiResponse<DataTransferPac | null>> {

    //* PASO 1.1 (Origen). Calculo tanto lo programado como lo recaudado ¡ ORIGINAL ! y aparte el ¡ QUE LLEGA EN LA PETICIÓN !
    const originsGetCalculatedOriginal: ApiResponse<ITotalsByTransfers[] | null> = await this.calculatedValuesOriginal(data, "origin");
    const originsGetCalculatedOfRequestTransfer: ApiResponse<ITotalsByTransfers | null> = await this.getCalculatedOfRequestTransfer(data, "origin");

    //* PASO 2.1 (Destino). Calculo tanto lo programado como lo recaudado ¡ ORIGINAL ! y aparte el ¡ QUE LLEGA EN LA PETICIÓN !
    const destinitiesGetCalculatedOriginal: ApiResponse<ITotalsByTransfers[] | null> = await this.calculatedValuesOriginal(data, "destinities");
    const destinitiesGetCalculatedOfRequestTransfer: ApiResponse<ITotalsByTransfers | null> = await this.getCalculatedOfRequestTransfer(data, "destinities");

    //? ************************************************************************************
    //? Validación 2
    //? ************************************************************************************
    if( originsGetCalculatedOfRequestTransfer.data == null || destinitiesGetCalculatedOfRequestTransfer == null){

      return new ApiResponse(null, EResponseCodes.FAIL, 'El valor del presupuesto sapiencia es diferente al valor del presupuesto.');

    }

    //? ************************************************************************************
    //? Validación 5
    //? ************************************************************************************
    if (data.headTransfer.pacType == "Recaudado" || data.headTransfer.pacType == "Ambos") {

      //Obtengo valor recaudado original del origen (Recordemos que viene como un array en sumatoria)
      const origenOriginalResultCall: ITotalsByTransfers[] | null = originsGetCalculatedOriginal.data;
      const origenOriginalValueCollectec: number | null = origenOriginalResultCall![origenOriginalResultCall?.length! - 1].totalCollected;

      //Obtengo valor recaudado original del destino (Recordemos que viene como un array en sumatoria)
      const destinityOriginalResultCall: ITotalsByTransfers[] | null = destinitiesGetCalculatedOriginal.data;
      const destinityOriginalValueCollectec: number | null = destinityOriginalResultCall![destinityOriginalResultCall?.length! - 1].totalCollected;

      //Guardo la suma del valor recaudado entre origen y destino ORIGINAL.
      const plusCollectedOriginal: number = origenOriginalValueCollectec + destinityOriginalValueCollectec;

      //Calcular el valor extraído del recaudo desde el origen
      const extractValue: number = origenOriginalValueCollectec - originsGetCalculatedOfRequestTransfer.data?.totalCollected!;
      console.log({extractValue});

      //Calcular el nuevo valor recaudado origen y el nuevo valor recaudado destino
      const newCollectedOriginalOrigin: number = originsGetCalculatedOfRequestTransfer.data?.totalCollected!;
      const newCollectedOriginalDestinity: number = destinitiesGetCalculatedOfRequestTransfer.data?.totalCollected!;

      //Ahora sumo los nuevos valores y debería obtener la sumatoria original de recaudo
      const plusCollectedsWithTransfer: number = newCollectedOriginalOrigin + newCollectedOriginalDestinity;

      //* Validación 5
      if (plusCollectedsWithTransfer !== plusCollectedOriginal) {

        return new ApiResponse(null, EResponseCodes.FAIL, "No puede aumentar o reducir el valor del recaudo, solo moverlo entre rutas");

      }

      //? ******************************************************************************************************************************
      //? Validación 6.
      //? ******************************************************************************************************************************
      //Calculamos lo que será el nuevo valor programado para validar
      const newProgrammingOriginalOrigin: number = originsGetCalculatedOfRequestTransfer.data?.totalProgrammig!;
      const newProgrammingOriginalDestinity: number = destinitiesGetCalculatedOfRequestTransfer.data?.totalProgrammig!;
      console.log({newProgrammingOriginalDestinity});

      if (newCollectedOriginalOrigin > newProgrammingOriginalOrigin) {

        return new ApiResponse(null, EResponseCodes.FAIL, "El recaudo es mayor al presupuesto sapiencia del PAC");

      }

    }

    //? *****************************************************************************************************************
    //? Validación 3
    //? *****************************************************************************************************************

    if (data.headTransfer.pacType == "Programado" || data.headTransfer.pacType == "Ambos") {

      //Obtengo valor programado original del origen (Recordemos que viene como un array en sumatoria)
      const origenOriginalResultCall: ITotalsByTransfers[] | null = originsGetCalculatedOriginal.data;
      const origenOriginalValueProgramming: number | null = origenOriginalResultCall![origenOriginalResultCall?.length! - 1].totalProgrammig;

      //Obtengo valor programado original del destino (Recordemos que viene como un array en sumatoria)
      const destinityOriginalResultCall: ITotalsByTransfers[] | null = destinitiesGetCalculatedOriginal.data;
      const destinityOriginalValueProgramming: number | null = destinityOriginalResultCall![destinityOriginalResultCall?.length! - 1].totalProgrammig;

      //Guardo la suma del valor programado entre origen y destino ORIGINAL.
      const plusProgrammingOriginal: number = origenOriginalValueProgramming + destinityOriginalValueProgramming;

      //Calcular el valor extraído del programado desde el origen
      const extractValue: number = origenOriginalValueProgramming - originsGetCalculatedOfRequestTransfer.data?.totalProgrammig!;
      console.log({extractValue});

      //Calcular el nuevo valor programado origen y el nuevo valor programado destino
      const newProgrammingOriginalOrigin: number = originsGetCalculatedOfRequestTransfer.data?.totalProgrammig!;
      const newProgrammingOriginalDestinity: number = destinitiesGetCalculatedOfRequestTransfer.data?.totalProgrammig!;

      //Ahora sumo los nuevos valores y debería obtener la sumatoria original de programado
      const plusProgrammingsWithTransfer: number = newProgrammingOriginalOrigin + newProgrammingOriginalDestinity;

      //*Validación 3
      if (plusProgrammingsWithTransfer !== plusProgrammingOriginal) {

        return new ApiResponse(null, EResponseCodes.FAIL, "No puede aumentar o reducir el valor del presupuesto, solo moverlo entre rutas");

      }

      //? ******************************************************************************************************************************
      //? Validación 4.
      //? ******************************************************************************************************************************
      //Calculamos lo que será el nuevo valor recaudado para validar
      const newCollectedOriginalOrigin: number = originsGetCalculatedOfRequestTransfer.data?.totalCollected!;
      const newCollectedOriginalDestinity: number = destinitiesGetCalculatedOfRequestTransfer.data?.totalCollected!;
      console.log({newCollectedOriginalDestinity});

      if (newProgrammingOriginalOrigin < newCollectedOriginalOrigin) {

        return new ApiResponse(null, EResponseCodes.FAIL, "El recaudo previamente guardado en el PAC es mayor que lo programado a ingresar");

      }

    }

    //* Se pasaron los filtros, entonces procedemos a justar los meses a nivel de programado y recaudado
    //* de las rutas involucradas.
    const updateOrigins = await this.updateOriginsWithNewData(data);
    const updateDestinities = await this.updateDestinitiesWithNewData(data);

    //TODO: Buscar alternativa de any, debemos dejarlo por ahora mientras ajustamos validaciones
    const primaryObject: any = {

      origins: {
        original: originsGetCalculatedOriginal.data,
        request: originsGetCalculatedOfRequestTransfer.data
      },
      destinities: {
        original: destinitiesGetCalculatedOriginal.data,
        request: destinitiesGetCalculatedOfRequestTransfer.data
      },
      resultsTransfer: {
        updateOrigins,
        updateDestinities
      }

    }

    return new ApiResponse(primaryObject, EResponseCodes.OK, "¡Guardado exitosamente!");

  }

  async getCalculatedOfRequestTransfer(info: DataTransferPac, space: string): Promise<ApiResponse<ITotalsByTransfers | null>> {

    let totalProgrammig: number = 0;
    let totalCollected: number = 0;
    let method: IDestinity[];
    let arrayProgramming: IDestinityNoAnnual[] = [];

    if (space === "origin") {
      method = info.transferTransaction.origins;
    } else {
      method = info.transferTransaction.destinities;
    }

    //* Calculamos primero origenes.
    for (const x of method) {

      for (const xx of x.annualRoute) {

        const val: number =
          Number(xx.jan) +
          Number(xx.feb) +
          Number(xx.mar) +
          Number(xx.abr) +
          Number(xx.may) +
          Number(xx.jun) +
          Number(xx.jul) +
          Number(xx.ago) +
          Number(xx.sep) +
          Number(xx.oct) +
          Number(xx.nov) +
          Number(xx.dec);

        //? ******************************************************************************************************************************
        //? Validación 2.
        //TODO: !
        //? ******************************************************************************************************************************
        if (xx.type === "Programado"){

          totalProgrammig += val;

          const obj: IDestinityNoAnnual = {
            idProjectVinculation: x.idProjectVinculation,
            idBudget: x.idBudget,
            idPospreSapiencia: x.idPospreSapiencia,
            idFund: x.idFund,
            idCardTemplate: x.idCardTemplate
          }

          arrayProgramming.push(obj);

        }

        if (xx.type === "Recaudado"){

          totalCollected += val;

        }

      }

    }

    const objResult: ITotalsByTransfers = {

      totalProgrammig: totalProgrammig,
      totalCollected: totalCollected

    }

    //? Vamos a validar que este nuevo valor programado nos de menor o igual al saldo de la ruta
    //? esto es importante para mantener la homoneneidad entre los datos.
    //TODO: !
    // for (const complement of arrayProgramming) {

    //   const getRoute = await this.budgetsRoutesRepository
    //                              .getBudgetForAdditions(complement.idProjectVinculation,
    //                                                     complement.idFund,
    //                                                     complement.idBudget,
    //                                                     complement.idPospreSapiencia);

    //   const getBalanceOfRoute: number = Number(getRoute?.balance);

    //   if( !getRoute ||
    //       getRoute == null ||
    //       getRoute == undefined ||
    //       getBalanceOfRoute == null ||
    //       getBalanceOfRoute == undefined ||
    //       getBalanceOfRoute == 0 ){

    //     return new ApiResponse(null, EResponseCodes.FAIL, 'No se encontró saldo en la ruta presupuesta. Error general.');

    //   }

    //   console.log({totalProgrammig});
    //   console.log({getBalanceOfRoute});


    //   if( getBalanceOfRoute >= totalProgrammig  ){
    //     console.log("Aca °°°°°°°°°°°°°°°°°°")
    //     return new ApiResponse(null, EResponseCodes.FAIL, 'El valor del presupuesto sapiencia es diferente al valor del presupuesto.');

    //   }

    // }


    return new ApiResponse(objResult, EResponseCodes.OK, 'Cálculos de la request para origen.');

  }

  async calculatedValuesOriginal(info: DataTransferPac, space: string): Promise<ApiResponse<ITotalsByTransfers[] | null>> {

    let totalProgrammig: number = 0;
    let totalCollected: number = 0;
    let exercise: number = info.headTransfer.exercise;
    let arrayResult: ITotalsByTransfers[] = [];
    let method: IDestinity[];

    if (space === "origin") {
      method = info.transferTransaction.origins;
    } else {
      method = info.transferTransaction.destinities;
    }

    for (const x of method) {

      //A. Valido Ruta
      const getMyRoute = await this.budgetsRoutesRepository.getBudgetForAdditions(x.idProjectVinculation, x.idFund, x.idBudget, x.idPospreSapiencia);
      if (!getMyRoute)
        return new ApiResponse(null, EResponseCodes.FAIL, `No se encontro la ruta con V.Proyecto:${x.idProjectVinculation}, Fondo:${x.idFund}, PosPreOrigen:${x.idBudget} y PosPreSapi:${x.idPospreSapiencia}. Revise la combinación de datos.`);

      //B. Valido PAC
      const getPacWithAnnual = await this.pacRepository.getPacByRouteAndExercise(Number(getMyRoute.id), Number(exercise), 0, "no");
      if (!getPacWithAnnual)
        return new ApiResponse(null, EResponseCodes.FAIL, `No se encontró un PAC con la ruta: ${getMyRoute.id} que está compuesta por V.Proyecto:${x.idProjectVinculation}, Fondo:${x.idFund}, PosPreOrigen:${x.idBudget} y PosPreSapi:${x.idPospreSapiencia}. No se hizo match con la vigencia que es ${exercise}`);

      //C. Obtengo programado y recaudado (así traigan 0 alguna columna), [0]: Programado - [1]: Recaudado
      const valProgramming: number =
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[0].jan) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[0].feb) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[0].mar) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[0].abr) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[0].may) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[0].jun) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[0].jul) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[0].ago) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[0].sep) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[0].oct) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[0].nov) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[0].dec);

      const valCollected: number =
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[1].jan) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[1].feb) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[1].mar) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[1].abr) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[1].may) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[1].jun) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[1].jul) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[1].ago) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[1].sep) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[1].oct) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[1].nov) +
        Number(getPacWithAnnual.array[0]?.pacAnnualizations[1].dec);

      totalProgrammig += valProgramming;
      totalCollected += valCollected;

      const objResult: ITotalsByTransfers = {

        idPac: Number(getPacWithAnnual.array[0]?.id),
        idRoute: Number(getMyRoute.id),
        managementCenter: x.managementCenter,
        idProjectVinculation: x.idProjectVinculation,
        idBudget: x.idBudget,
        idPospreSapiencia: x.idPospreSapiencia,
        idFund: x.idFund,
        idCardTemplate: x.idCardTemplate,
        totalProgrammig: totalProgrammig,
        totalCollected: totalCollected

      }

      arrayResult.push(objResult);

    }

    return new ApiResponse(arrayResult, EResponseCodes.OK, 'Primeros cálculos para origen.');

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


}
