// import { IAdditionsRepository } from "App/Repositories/AdditionsRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import {
  ITransfers,
  ITransfersFilters,
  ITransfersWithMovements,
  IFundsTransferList,
  IPosPreTransfer,
  IPosPreSapienciaTransferList,
  IProjectTransferFilters,
  IProjectTransferList,
} from "App/Interfaces/TransfersInterfaces";

// import AdditionsMovement from '../Models/AdditionsMovement';
// import Addition from '../Models/Addition';

// import { IMovementAdditionRepository } from '../Repositories/MovementAdditionRepository';
import { IProjectsRepository } from '../Repositories/ProjectsRepository';
import { IFundsRepository } from '../Repositories/FundsRepository';
import { IPosPreSapienciaRepository } from '../Repositories/PosPreSapienciaRepository';
import { IBudgetsRepository } from '../Repositories/BudgetsRepository';
import { IBudgetsRoutesRepository } from '../Repositories/BudgetsRoutesRepository';

import { ITransfersRepository } from '../Repositories/TransfersRepository';
// import { IMovementTransferRepository } from '../Repositories/MovementTransferRepository';
import Transfer from '../Models/Transfer';
import TransfersMovement from '../Models/TransfersMovement';

export interface ITransfersService {

  getTransfersPaginated(filters: ITransfersFilters): Promise<ApiResponse<IPagingData<ITransfers>>>;
  createTransfers(transfer: ITransfersWithMovements): Promise<ApiResponse<ITransfersWithMovements>>;
  executeCreateTransfers(transfer: ITransfersWithMovements): Promise<ApiResponse<ITransfersWithMovements | any>>;
  totalTransferCalculator(transfer: ITransfersWithMovements): Promise<ApiResponse<number>>;
  // getAllAdditionsList(list: string): Promise<ApiResponse<IAdditions[]>>;
  // getAdditionById(id: number): Promise<ApiResponse<IAdditionsWithMovements>>;
  getProjectsList(filters: IProjectTransferFilters): Promise<ApiResponse<IPagingData<IProjectTransferList>>>;
  getFundsList(filters: IProjectTransferFilters): Promise<ApiResponse<IPagingData<IFundsTransferList>>>;
  getPosPreList(): Promise<IPosPreTransfer | string[]>;
  getPosPreSapienciaList(filters: IProjectTransferFilters): Promise<ApiResponse<IPagingData<IPosPreSapienciaTransferList>>>;
  // updateAdditionWithMov(id: number, addition: IAdditionsWithMovements): Promise<ApiResponse<IAdditionsWithMovements>>;
  // executeUpdateAdditionWithMov(id: number, addition: IAdditionsWithMovements): Promise<ApiResponse<IAdditionsWithMovements>>;


  //*Validaciones Front y CREAR/ACTUALIZAR
  namesAndObservationsValidations(transfer: ITransfersWithMovements): Promise<Boolean>;
  totalsMovementsValidations(transfer: ITransfersWithMovements): Promise<string>;
  budgetPathValidations(idCard: string, projectId: number, foundId: number, posPreId: number): Promise<string>;

}

export default class TransfersService implements ITransfersService {

  constructor(
    private transfersRepository: ITransfersRepository,
    // private movementsRepository: IMovementTransferRepository,
    private projectRepository: IProjectsRepository,
    private fundsRepository: IFundsRepository,
    private pospreSapRepository: IPosPreSapienciaRepository,
    private budgetRepository: IBudgetsRepository,
    private budgetRouteRepository: IBudgetsRoutesRepository
  ) { }

  //?OBTENER PAGINADO Y FILTRADO LAS ADICIONES CON SUS MOVIMIENTOS
  async getTransfersPaginated(filters: ITransfersFilters): Promise<ApiResponse<IPagingData<ITransfers>>> {

    const res = await this.transfersRepository.getTransfersPaginated(filters);
    return new ApiResponse(res, EResponseCodes.OK);

  }

  // //?CREACIÓN DE ADICIÓN CON SUS MOVIMIENTOS EN PARALELO (VALIDADOR GENERAL ANTES DE CREAR)
  async createTransfers(transfer: ITransfersWithMovements): Promise<ApiResponse<ITransfersWithMovements | any>> {

    if (!transfer ||
      !transfer.headTransfer ||
      !transfer.transferMovesGroups ||
      transfer.transferMovesGroups.length <= 0) {

      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        "No se envió la cabecera del traslado y/o los traslados respectivos, verifique."
      );

    }

    //! Validamos los nombres acto admin distrito y el de sapiencia
    const respNames = await this.namesAndObservationsValidations(transfer);

    if (respNames) {

      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        "El nombre de Acto Admin Distrito, Acto Admin Sapiencia y/o Observaciones ya se encuentran registrados."
      );

    }

    //! Vamos a validar los totales
    const totals = await this.totalsMovementsValidations(transfer);
    const responseTotalAction = totals.split("@")[0];
    const responseTotalDescription = totals.split("@")[1];
    const responseInfoDescription = totals.split("@")[2];

    if (responseTotalAction === "ERROR") {

      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        `Mensaje_Backend_Totales:@${responseTotalDescription}@Info_Mensaje_Backend_Totales:@${responseInfoDescription}`
      );

    }

    //! Validación de existencia de Rutas Presupuestarias
    //! Validación de existenica de Proyecto y Área Funcional
    //! Validación Pospre Origen y Pospre Sapiencia
    //! Validación Fondo asociado
    //! Validación Rutas Presupuestarias Repetidas
    //! Validación Existencia Proyecto
    let bandControl: boolean = false;
    let arrayCardsErrorRoutes: string[] = [];
    let arrayCardsErrorProjects: string[] = [];

    let arrayNoRepeatRoutes: string[] = [];
    let arrayCardsErrorRepeatRoutes: string[] = [];

    for (let i of transfer.transferMovesGroups) {

      for (let j of i.data) {

        const concat: string = `${j.projectId},${j.fundId},${j.budgetPosition}`; //Concatenar rutas para no repetir
        const idCard: string = j.idCard!;          // ID Card del FRONT para pintar si hay errores
        const projectId: number = j.projectId;     // Id Proyecto - De acá saco el área funcional
        const foundId: number = j.fundId;          // Id del Fondo
        const posPreId: number = j.budgetPosition; // Id del Pos Pre Sapiencia - De acá saco el pospre origen

        //* No repetir rutas durante el traslado, A NIVEL DE GRUPO TRASLADO
        if (arrayNoRepeatRoutes.includes(concat)) {
          arrayCardsErrorRepeatRoutes.push(idCard);
          bandControl = true;
        }
        arrayNoRepeatRoutes.push(concat);

        //* Validación proyectos y que exista ruta presupuestaria en paralelo
        //* Validación de Pospre Origen y Pospre Sapiencia en paralelo
        const resp = await this.budgetPathValidations(idCard, projectId, foundId, posPreId);
        const status = resp.split('-')[0];
        const card = resp.split('-')[1];

        //* Validación si no encontré la ruta presupuestaria
        if (status == "ERROR_RUTAPRESUPUESTARIA") {

          bandControl = true;
          arrayCardsErrorRoutes.push(card);

        }

        //* Validación si no encontré proyecto en presupuesto
        if (status == "ERROR_CODIGOPROYECTO") {

          bandControl = true;
          arrayCardsErrorProjects.push(card);

        }

      }

    }

    if (bandControl) {

      const arrayResponse = `@@@Se ha encontrado un error en los datos, revisa rutas presupuestales@@@NOEXISTERUTASPRESUPUESTARIAS@@@${JSON.stringify(arrayCardsErrorRoutes)}@@@Se ha encontrado un error en los datos, revise proyectos@@@PROYECTOS@@@${JSON.stringify(arrayCardsErrorProjects)}@@@Se ha encontrado un error, datos duplicados en el sistema@@@RUTASPRESUPUESTARIASREPETIDAS@@@${JSON.stringify(arrayCardsErrorRepeatRoutes)}`;

      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        `Se han detectado errores en uno o varios elementos para la creación de la adición, por favor revise__${arrayResponse}`
      );

    }

    //! << ****************************************************** >>
    //! << REALIZAMOS LAS VALIDACIONES ESPECÍFICAS PARA TRASLADOS >>
    //! << ****************************************************** >>
    let transferCards: string = "";
    let errorType: string = "";

    let errorDetected_PiToPf: boolean = false;

    for (let i of transfer.transferMovesGroups) {

      //? VALIDAMOS QUE NO SE PUEDA PASAR DE UN PROYECTO DE INVERSIÓN A UNO DE FUNCIONAMIENTO
      const dePiToPf = await this.noPermitedInversionProyToFunctionalProy(i);
      const resultPiToPf = dePiToPf.data.split('@')[0];

      if(resultPiToPf === "true"){

        transferCards = dePiToPf.data.split('@')[1];
        errorType = "Se esta intentado trasladar de un Proyecto de Inversión a uno de Funcionamiento";
        errorDetected_PiToPf = true;
        break;

      }

      for (let j of i.data) {

        console.log(j);

      }

    }

    if(errorDetected_PiToPf){

      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        `Se ha detectado un error en las validaciones de traslados.@Tipo Error: ${errorType}@Cards grupales de falla: ${transferCards}`
      );

    }

    //! Si llega hasta acá entonces pasó los filtros
    return new ApiResponse(
      null,
      EResponseCodes.OK,
      "Validaciones pasadas con éxito para agregar traslado."
    );

  }

  // //?ACTUALIZACIÓN DE ADICIÓN CON SUS MOVIMIENTOS EN PARALELO (VALIDADOR GENERAL ANTES DE EDITAR)
  // async updateAdditionWithMov(id: number, addition: IAdditionsWithMovements): Promise<ApiResponse<IAdditionsWithMovements | any>> {

  //   //! Validación de totales ingresos/gastos
  //   //! Validación de que no venga movimientos
  //   if (!addition.additionMove || addition.additionMove.length <= 0) {

  //     return new ApiResponse(
  //       null,
  //       EResponseCodes.FAIL,
  //       "No se permite guardar, debe diligenciar ingresos y gastos."
  //     );

  //   }

  //   //! Validación de totales ingresos/gastos
  //   const { bandEquals, bandZeros, income, spend } = await this.totalsMovementsValidations(addition);

  //   if (bandEquals) {

  //     return new ApiResponse(
  //       null,
  //       EResponseCodes.FAIL,
  //       "El total de ingresos no coincide con el total de gastos."
  //     );

  //   }

  //   //! Totales no pueden ser iguales a cero
  //   if (bandZeros) {

  //     return new ApiResponse(
  //       null,
  //       EResponseCodes.FAIL,
  //       "El total de ingresos y/o el total de gastos no pueden ser cero."
  //     );

  //   }

  //   //! Existencia de totales es requerida
  //   if (!income || !spend) {

  //     return new ApiResponse(
  //       null,
  //       EResponseCodes.FAIL,
  //       "El total de ingresos y/o el total de gastos deben existir en la transacción."
  //     );

  //   }

  //   //! Validación de existencia de Rutas Presupuestarias
  //   //! Validación de existenica de Proyecto y Área Funcional
  //   //! Validación Pospre Origen y Pospre Sapiencia
  //   //! Validación Rutas Presupuestarias Repetidas
  //   let bandControl: boolean = false;
  //   let arrayCardsErrorRoutes: string[] = [];
  //   let arrayCardsErrorProjects: string[] = [];

  //   let arrayNoRepeatRoutes: string[] = [];
  //   let arrayCardsErrorRepeatRoutes: string[] = [];

  //   for (let i of addition.additionMove) {

  //     const concat: string = `${i.projectId},${i.fundId},${i.budgetPosition}`; //Concatenar rutas para no repetir
  //     const idCard: string = i.idCard!;          // ID Card del FRONT para pintar si hay errores
  //     const projectId: number = i.projectId;     // Id Proyecto - De acá saco el área funcional
  //     const foundId: number = i.fundId;          // Id del Fondo
  //     const posPreId: number = i.budgetPosition; // Id del Pos Pre Sapiencia - De acá saco el pospre origen

  //     //! Validación si se nos repite ruta presupuestaria ...
  //     if (arrayNoRepeatRoutes.includes(concat)) {
  //       arrayCardsErrorRepeatRoutes.push(idCard);
  //       bandControl = true;
  //     }
  //     arrayNoRepeatRoutes.push(concat);

  //     //! Validación proyectos y que exista ruta presupuestaria en paralelo
  //     //! Validación de Pospre Origen y Pospre Sapiencia en paralelo
  //     const resp = await this.budgetPathValidations(idCard, projectId, foundId, posPreId);
  //     const status = resp.split('-')[0];
  //     const card = resp.split('-')[1];

  //     //! Validación si no encontré la ruta presupuestaria
  //     if (status == "ERROR_RUTAPRESUPUESTARIA") {

  //       bandControl = true;
  //       arrayCardsErrorRoutes.push(card);

  //     }

  //     //! Validación si no encontré proyecto en presupuesto
  //     if (status == "ERROR_CODIGOPROYECTO") {

  //       bandControl = true;
  //       arrayCardsErrorProjects.push(card);

  //     }

  //   } //Fin For Of

  //   if (bandControl) {

  //     const arrayResponse = `@@@Se ha encontrado un error en los datos, revisa rutas presupuestales@@@NOEXISTERUTASPRESUPUESTARIAS@@@${JSON.stringify(arrayCardsErrorRoutes)}@@@Se ha encontrado un error en los datos, revise proyectos@@@PROYECTOS@@@${JSON.stringify(arrayCardsErrorProjects)}@@@Se ha encontrado un error, datos duplicados en el sistema@@@RUTASPRESUPUESTARIASREPETIDAS@@@${JSON.stringify(arrayCardsErrorRepeatRoutes)}`;

  //     return new ApiResponse(
  //       null,
  //       EResponseCodes.FAIL,
  //       `Se han detectado errores en uno o varios elementos para la actualización de la adición ${id}, por favor revise__${arrayResponse}`
  //     );

  //   }

  //   //! Si llega hasta acá entonces pasó los filtros
  //   return new ApiResponse(
  //     null,
  //     EResponseCodes.OK,
  //     `Validaciones pasadas con éxito para editar adición ${id}.`
  //   );

  // }

  // //?OBTENER LISTADO GENERAL DE ADICIONES - CON PARAMETRO LIST DEFINIMOS QUE LISTADO MOSTRAR
  // async getAllAdditionsList(list: string): Promise<ApiResponse<IAdditions[]>> {

  //   const res = await this.additionsRepository.getAllAdditionsList(list);

  //   if (!res) {

  //     return new ApiResponse(
  //       [] as IAdditions[],
  //       EResponseCodes.FAIL,
  //       "No se encontraron registros"
  //     );

  //   }

  //   return new ApiResponse(res, EResponseCodes.OK);

  // }

  // //?

  // //?OBTENER UNA ADICIÓN CON SUS MOVIMIENTOS EN PARALELO A TRAVÉS DE UN ID PARAM
  // async getAdditionById(id: number): Promise<ApiResponse<IAdditionsWithMovements>> {

  //   const addition = await this.additionsRepository.getAdditionById(id);

  //   if (!addition) {

  //     return new ApiResponse(
  //       {} as IAdditionsWithMovements,
  //       EResponseCodes.FAIL,
  //       "Registro no encontrado"
  //     );

  //   }

  //   return new ApiResponse(addition, EResponseCodes.OK);

  // }

  // //?OBTENER LISTADO DE PROYECTOS CON SU ÁREA FUNCIONAL VINCULADA
  async getProjectsList(filters: IProjectTransferFilters): Promise<ApiResponse<IPagingData<IProjectTransferList | any>>> {

    const projects = await this.projectRepository.getProjectsList(filters);
    return new ApiResponse(projects, EResponseCodes.OK);

  }

  // //?OBTENER LISTADO DE FONDOS
  async getFundsList(filters: IProjectTransferFilters): Promise<ApiResponse<IPagingData<IFundsTransferList>>> {

    const funds = await this.fundsRepository.getFundsList(filters);
    return new ApiResponse(funds, EResponseCodes.OK);

  }

  // //?OBTENER POS PRE - COMBINAMOS RESULTADO DE POS PRE SAPIENCIA CON BUDGETS
  async getPosPreList(): Promise<IPosPreTransfer | string[]> {

    const posPreRes = await this.pospreSapRepository.getAllPosPreSapiencia();
    const budgetRes = await this.budgetRepository.getAllBudgets();
    const arrayResult: string[] = [];

    for (let i of posPreRes) {
      arrayResult.push(i.number);
    }

    for (let j of budgetRes) {
      arrayResult.push(j.number.toString());
    }

    return arrayResult;

  }

  // //?OBTENER LISTADO DE POS PRE SAPIENCIA ANIDADOS CON POSPRE ORIGEN
  async getPosPreSapienciaList(filters: IProjectTransferFilters): Promise<ApiResponse<IPagingData<IPosPreSapienciaTransferList>>> {

    const posPreRes = await this.pospreSapRepository.getPosPreSapienciaList(filters);
    return new ApiResponse(posPreRes, EResponseCodes.OK);

  }




  // //! |------------------------------------------------------------|
  // //* |************************************************************|
  // //? |******************** VALIDACIONES EXTRA ********************|
  // //* |************************************************************|
  // //! |------------------------------------------------------------|

  //Validador manual para que los nombres no se repitan
  async namesAndObservationsValidations(transfer: ITransfersWithMovements): Promise<Boolean> {

    const nameActAdminDis: string = transfer.headTransfer!.actAdminDistrict.trim().toUpperCase();
    const nameActAdminSap: string = transfer.headTransfer!.actAdminSapiencia.trim().toUpperCase();
    const nameObservations: string = transfer.headTransfer!.observations.trim().toUpperCase();

    const res1 = await Transfer.query()
      .where('actAdminDistrict', nameActAdminDis)
      .first();

    const res2 = await Transfer.query()
      .where('actAdminSapiencia', nameActAdminSap)
      .first();

    const res3 = await Transfer.query()
      .where('observations', nameObservations)
      .first();

    return (res1 || res2 || res3) ? true : false;

  }

  //Validador manual para que los valores tengan coincidencia respecto a la información
  //?NOTA: En este método validaremos no solo el total crédito y contra crédito de un gran taslado.
  //?      sino que también validaremos especificamente crédito y contra crédito por traslado específico.
  async totalsMovementsValidations(transfer: ITransfersWithMovements): Promise<string> {

    let globalAgainstCredit: number = 0; //Contra Crédito Global - Origen
    let globalCredit: number = 0; //Crédito Global - Destino

    let bandGeneral: boolean = false;
    let bandSpecify: boolean = false;
    let cardsArray: string[] = [];
    let spcifyAgainstCredit: number = 0; //Contra Crédito Específico - Origen
    let spcifyCredit: number = 0; //Crédito Específico - Destino

    for (let i of transfer.transferMovesGroups) {

      spcifyAgainstCredit = 0;
      spcifyCredit = 0;
      cardsArray = [];


      for (let j of i.data) {

        if (j.type === "Origen") {
          globalAgainstCredit += j.value;
          spcifyAgainstCredit += j.value;
        }

        if (j.type === "Destino") {
          globalCredit += j.value;
          spcifyCredit += j.value;
        }

        cardsArray.push(j.idCard!);

      }

      //!Valido el segmento, el contra crédito y crédito tienen que ser iguales
      if (spcifyAgainstCredit !== spcifyCredit) {

        bandSpecify = true;
        break;
      }

    }

    //* Errores específicos
    if (bandSpecify && !bandGeneral) {

      return `ERROR@Error en total específico, cards:@${cardsArray}`;

    }

    //* Errores generales
    if (globalAgainstCredit !== globalCredit) {

      bandGeneral = true;
      return `ERROR@Error en totales generales, totales:@ContraCredito:${globalAgainstCredit},Credito:${globalCredit}`;

    }

    if (!bandSpecify && !bandGeneral) {

      return `OK@Se pasaron las validaciones de los totales y subtotales satisfactoriamente@TodoOK`;

    }

    return "";

  }

  //Validar proyecto, área funcional, fondo, pos pre origen y pos pre sapiencia
  async budgetPathValidations(idCard: string, projectId: number, foundId: number, posPreId: number): Promise<string> {

    //* Consulta pos pre sapiencia para obtener el de origen
    const query = await this.pospreSapRepository.getPosPreSapienciaById(posPreId);
    const posPreOriginId = Number(query?.budget?.id);


    //* Primero busquemos si encontramos el proyecto
    const resultProj = await this.projectRepository.getProjectById(projectId);
    if (!resultProj) return `ERROR_CODIGOPROYECTO-${idCard}`;

    //* Validación contra ruta presupuestal
    const resultRPP = await this.budgetRouteRepository.getBudgetForAdditions(projectId,
      foundId,
      posPreOriginId,
      posPreId);

    //Devolvemos el id card para que pueda ser pintado en el Frontend
    if (!resultRPP) return `ERROR_RUTAPRESUPUESTARIA-${idCard}`;

    return `OK-${idCard}`;

  }

  //? EJECUTAMOS EL GUARDADO
  async executeCreateTransfers(transfer: ITransfersWithMovements): Promise<ApiResponse<ITransfersWithMovements | any>>{

    //* Calcular total traslado. Se asume que ya paso las anteriores validaciones.
    const totalTransfer: ApiResponse<number> = await this.totalTransferCalculator(transfer);

    if( !totalTransfer || totalTransfer.data <= 0 ){

      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        "Ocurrio un error al calcular el total del traslado. Copie los datos de trabajo y consule con el admin del sistema"
      );

    }

    //* Agregar cabecera de traslado
    const addToHead = await this.transfersRepository.createTransfers({

      actAdminDistrict : transfer.headTransfer!.actAdminDistrict.trim().toUpperCase(),
      actAdminSapiencia : transfer.headTransfer!.actAdminSapiencia.trim().toUpperCase(),
      value : Number(totalTransfer.data),
      observations : transfer.headTransfer!.observations,
      userCreate : transfer.headTransfer!.userCreate,
      dateCreate : transfer.headTransfer!.dateCreate,
      userModify : transfer.headTransfer!.userModify,
      dateModify : transfer.headTransfer!.dateModify

    });

    // const objAddToHead: ITransfers = {

    //   actAdminDistrict : transfer.headTransfer!.actAdminDistrict.trim().toUpperCase(),
    //   actAdminSapiencia : transfer.headTransfer!.actAdminSapiencia.trim().toUpperCase(),
    //   value : Number(totalTransfer.data),
    //   observations : transfer.headTransfer!.observations,
    //   userCreate : transfer.headTransfer!.userCreate,
    //   dateCreate : transfer.headTransfer!.dateCreate,
    //   userModify : transfer.headTransfer!.userModify,
    //   dateModify : transfer.headTransfer!.dateModify

    // }

    // console.log(objAddToHead);

    if(addToHead.id){

      //* Agreguemos los detalles del traslado
      for (let i of transfer.transferMovesGroups) {

        for (let j of i.data) {

          //Obtengamos primero PosPreOrigen para procesar en la ruta.
          const q = await this.pospreSapRepository.getPosPreSapienciaById(j.budgetPosition);
          const posPreOriginId = Number(q?.budget?.id);
          const getRouteId = await this.budgetRouteRepository.getBudgetForAdditions(j.projectId,
                                                                                    j.fundId,
                                                                                    posPreOriginId,
                                                                                    j.budgetPosition);

          const routeId = Number(getRouteId?.id);
          const toCreate = new TransfersMovement();

          toCreate.fill({
                          transferId : addToHead.id,
                          type : j.type,
                          budgetRouteId : routeId,
                          value : j.value
                        });

          await toCreate.save();

        }

      }

    }else{

      return new ApiResponse(
        transfer,
        EResponseCodes.FAIL,
        "Ocurrio un error al intentar realizar la transacción."
      );

    }

    return new ApiResponse(
      transfer,
      EResponseCodes.OK,
      "¡Se ha guardado la información correctamente en el sistema!"
    );


  }

  async totalTransferCalculator(transfer: ITransfersWithMovements): Promise<ApiResponse<number>> {

    let total: number = 0;

    for (let i of transfer.transferMovesGroups) {

      for (let j of i.data) {

        //También podríamos con Origen
        if( j.type === "Destino" ) total += j.value;

      }

    }

    return new ApiResponse(
      total,
      EResponseCodes.OK,
      "Devolviendo el total obtenido"
    );

  }

  // //? ACCIÓN DIRECTA PARA ACTUALIZAR LA ADICIÓN (AQUÍ YA NO HAY VALIDACIONES, SE ASUME QUE YA PASO POR EL VALIDADOR)
  // async executeUpdateAdditionWithMov(id: number, addition: IAdditionsWithMovements): Promise<ApiResponse<IAdditionsWithMovements>> {

  //   //* Borramos los que encontremos
  //   const deleteMovementsOld = await this.movementsRepository.deleteMovementById(id);

  //   //* Agregar los nuevos detalles de adición
  //   if (deleteMovementsOld) {

  //     for (let i of addition.additionMove) {

  //       //* Al pasar las validaciones, garantizamos que tenemos rutas presupuestales.
  //       //* Obtengamos el pospre origen a partir del sapiencia para contra validar la ruta:
  //       const query = await this.pospreSapRepository.getPosPreSapienciaById(i.budgetPosition);
  //       const posPreOriginId = Number(query?.budget?.id);
  //       const getRouteId = await this.budgetRouteRepository.getBudgetForAdditions(i.projectId,
  //         i.fundId,
  //         posPreOriginId,
  //         i.budgetPosition);

  //       const routeId = Number(getRouteId?.id);
  //       const toCreate = new AdditionsMovement();

  //       toCreate.fill({
  //         additionId: id,
  //         type: i.type,
  //         budgetRouteId: routeId,
  //         value: i.value
  //       });

  //       await toCreate.save();

  //     }

  //   } else {

  //     return new ApiResponse(
  //       addition,
  //       EResponseCodes.FAIL,
  //       "Ocurrio un error al intentar realizar la transacción."
  //     );

  //   }

  //   const res: IAdditionsWithMovements = {
  //     id,
  //     additionMove: addition.additionMove
  //   }

  //   return new ApiResponse(
  //     res,
  //     EResponseCodes.OK,
  //     "¡Se ha guardado la información correctamente en el sistema!"
  //   );

  // }

  //Validación de que no se puede trasladasr de un proyecto de inversión a uno de funcionamiento.
  async noPermitedInversionProyToFunctionalProy(i: ITransfersWithMovements | any): Promise<ApiResponse<string>> {

    let arrayCards: string[] = [];
    let bandInveProject: boolean = false; //Si detectamos que es proyecto de inversión.
    let bandFuncProject: boolean = false; //Si detectamos que es proyecto de funcionamiento.

    for (const iter of i.data) {

      arrayCards.push(iter.idCard);

      //?Debemos sacar el código del proyecto!
      const resultProj = await this.projectRepository.getProjectById(iter.projectId);
      const referenceCodeProject = resultProj?.projectId.toString();

      if(iter.type === "Origen" && referenceCodeProject !== "9000000") bandInveProject = true;
      if(iter.type === "Destino" && referenceCodeProject === "9000000") bandFuncProject = true;

      // console.log("*************************")
      // console.log(iter.idCard)
      // console.log(referenceCodeProject)

    }

    console.log({bandInveProject , bandFuncProject});

    if(bandInveProject && bandFuncProject){

      return new ApiResponse(
        `true@${arrayCards}`,
        EResponseCodes.OK,
        "¡Este traslado ¡NO cumple! con el NO TRASLADAR de PI a PF!"
      );

    }else{

      arrayCards = [];
      return new ApiResponse(
        `false@${arrayCards}`,
        EResponseCodes.OK,
        "¡Este traslado cumple con el NO TRASLADAR de PI a PF!"
      );

    }

  }

}
