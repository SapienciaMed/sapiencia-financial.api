import {
         IAdditions,
         IAdditionsFilters,
         IAdditionsWithMovements,
         IFundsAdditionList,
         IPosPreAddition,
         IPosPreSapienciaAdditionList,
         IProjectAdditionFilters,
         IProjectAdditionList,
       } from "App/Interfaces/AdditionsInterfaces";
import { IAdditionsRepository } from "App/Repositories/AdditionsRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import AdditionsMovement from '../Models/AdditionsMovement';
import { IMovementAdditionRepository } from '../Repositories/MovementAdditionRepository';
import { IProjectsRepository } from '../Repositories/ProjectsRepository';
import { IFundsRepository } from '../Repositories/FundsRepository';
import { IPosPreSapienciaRepository } from '../Repositories/PosPreSapienciaRepository';
import { IBudgetsRepository } from '../Repositories/BudgetsRepository';
import { IBudgetsRoutesRepository } from '../Repositories/BudgetsRoutesRepository';

export interface IAdditionsService {

  getAdditionsPaginated(filters: IAdditionsFilters): Promise<ApiResponse<IPagingData<IAdditions>>>;
  createAdditions(addition: IAdditionsWithMovements): Promise<ApiResponse<IAdditionsWithMovements>>;
  getAllAdditionsList(list: string): Promise<ApiResponse<IAdditions[]>>;
  getAdditionById(id: number): Promise<ApiResponse<IAdditionsWithMovements>>;
  getProjectsList(filters: IProjectAdditionFilters): Promise<ApiResponse<IPagingData<IProjectAdditionList>>>;
  getFundsList(filters: IProjectAdditionFilters): Promise<ApiResponse<IPagingData<IFundsAdditionList>>>;
  getPosPreList(): Promise<IPosPreAddition | string[]>;
  getPosPreSapienciaList(filters: IProjectAdditionFilters): Promise<ApiResponse<IPagingData<IPosPreSapienciaAdditionList>>>;

  //*Validaciones Front y crear
  totalsMovementsValidations(addition: IAdditionsWithMovements): Promise<Boolean>;
  budgetPathValidations(idCard: string, projectId: string , foundId: number , posPreId: number): Promise<string>;
  executeCreateAdditions(addition: IAdditionsWithMovements): Promise<ApiResponse<IAdditionsWithMovements>>;

}

export default class AdditionsService implements IAdditionsService{

  constructor(
    private additionsRepository: IAdditionsRepository,
    private movementsRepository: IMovementAdditionRepository,
    private projectRepository: IProjectsRepository,
    private fundsRepository: IFundsRepository,
    private pospreSapRepository: IPosPreSapienciaRepository,
    private budgetRepository: IBudgetsRepository,
    private budgetRouteRepository: IBudgetsRoutesRepository
  ) {}

  //?OBTENER PAGINADO Y FILTRADO LAS ADICIONES CON SUS MOVIMIENTOS
  async getAdditionsPaginated(filters: IAdditionsFilters): Promise<ApiResponse<IPagingData<IAdditions>>> {

    const res = await this.additionsRepository.getAdditionsPaginated(filters);
    return new ApiResponse(res, EResponseCodes.OK);

  }

  //?CREACIÓN DE ADICIÓN CON SUS MOVIMIENTOS EN PARALELO (VALIDACIÓN)
  //* Vamos a terminar usando este como el validador general y un createAdditionExecute
  async createAdditions(addition: IAdditionsWithMovements): Promise<ApiResponse<IAdditionsWithMovements | any>>{

    //* Validación de totales ingresos/gastos
    const totalMovementsVal = await this.totalsMovementsValidations(addition);

    if(!totalMovementsVal){
      console.log(this.movementsRepository);
      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        "El total de ingresos no coincide con el total de gastos."
      );
    }

    //* Validación de proyecto a través de código de referencia


    //TODO: Registrar la Adición (CABECERA)
    //! const add = await this.additionsRepository.createAdditions(addition.headAdditon);

    //* Validación de ruta presupuestaria
    //? Esta validación la harémos sobre cada ingreso y gasto que llegue:

    let bandControl: boolean = false;
    let arrayCardsErrorRoutes: string[] = [];
    let arrayCardsErrorProjects: string[] = [];

    for( let i of addition.additionMove ){

      const idCard: string = i.idCard!;          // ID Card del FRONT para pintar si hay errores
      const projectId: string = i.projectId;     // Id Proyecto - De acá saco el área funcional
      const foundId: number = i.fundId;          // Id del Fondo
      const posPreId: number = i.budgetPosition; // Id del Pos Pre Sapiencia - De acá saco el pospre origen

      const resp = await this.budgetPathValidations(idCard, projectId , foundId , posPreId);
      const status = resp.split('-')[0];
      const card = resp.split('-')[1];

      if(status == "ERROR_RUTAPRESUPUESTARIA"){

        bandControl = true;
        arrayCardsErrorRoutes.push(card);

      }

      if(status == "ERROR_CODIGOPROYECTO"){

        bandControl = true;
        arrayCardsErrorProjects.push(card);

      }

    }

    if(bandControl){

      const arrayResponse = `RUTASPRESUPUESTARIAS@@@${JSON.stringify(arrayCardsErrorRoutes)}@@@PROYECTOS@@@${JSON.stringify(arrayCardsErrorProjects)}`;

      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        `Se han detectado errores en uno o varios elementos, por favor revise__${arrayResponse}`
      );

    }

    //? Si llega hasta acá entonces pasó los filtros

    return new ApiResponse(
      null,
      EResponseCodes.OK,
      "Validaciones pasadas con éxito."
    );

    // const add = await this.additionsRepository.createAdditions(addition.headAdditon);
    // console.log(this.movementsRepository);

    // if(add.id){

    //   for( let i of addition.additionMove ){

    //     const toCreate = new AdditionsMovement();
    //     toCreate.fill({ additionId : add.id, ...i });
    //     await toCreate.save();

    //   }

    // }else{

    //   return new ApiResponse(
    //     addition,
    //     EResponseCodes.FAIL,
    //     "Ocurrio un error al intentar realizar la transacción."
    //   );

    // }

    // return new ApiResponse(
    //   addition,
    //   EResponseCodes.OK,
    //   "Adición con movimientos creada exitosamente."
    // );

  }

  //?OBTENER LISTADO GENERAL DE ADICIONES - CON PARAMETRO LIST DEFINIMOS QUE LISTADO MOSTRAR
  async getAllAdditionsList(list: string): Promise<ApiResponse<IAdditions[]>> {

    const res = await this.additionsRepository.getAllAdditionsList(list);

    if (!res) {

      return new ApiResponse(
          [] as IAdditions [],
          EResponseCodes.FAIL,
          "No se encontraron registros"
      );

    }

    return new ApiResponse(res, EResponseCodes.OK);

  }

  //?OBTENER UNA ADICIÓN CON SUS MOVIMIENTOS EN PARALELO A TRAVÉS DE UN ID PARAM
  async getAdditionById(id: number): Promise<ApiResponse<IAdditionsWithMovements>> {

    const addition = await this.additionsRepository.getAdditionById(id);

    if (!addition) {

      return new ApiResponse(
        {} as IAdditionsWithMovements,
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );

    }

    return new ApiResponse(addition, EResponseCodes.OK);

  }

  //?OBTENER LISTADO DE PROYECTOS CON SU ÁREA FUNCIONAL VINCULADA
  async getProjectsList(filters: IProjectAdditionFilters): Promise<ApiResponse<IPagingData<IProjectAdditionList | any>>>{

    const projects = await this.projectRepository.getProjectsList(filters);
    return new ApiResponse(projects, EResponseCodes.OK);

  }

  //?OBTENER LISTADO DE FONDOS
  async getFundsList(filters: IProjectAdditionFilters): Promise<ApiResponse<IPagingData<IFundsAdditionList>>> {

    const funds = await this.fundsRepository.getFundsList(filters);
    return new ApiResponse(funds, EResponseCodes.OK);

  }

  //?OBTENER POS PRE - COMBINAMOS RESULTADO DE POS PRE SAPIENCIA CON BUDGETS
  async getPosPreList(): Promise<IPosPreAddition | string[]> {

    const posPreRes = await this.pospreSapRepository.getAllPosPreSapiencia();
    const budgetRes = await this.budgetRepository.getAllBudgets();
    const arrayResult: string[] = [];

    for( let i of posPreRes ){
      arrayResult.push(i.number);
    }

    for( let j of budgetRes ){
      arrayResult.push(j.number.toString());
    }

    return arrayResult;

  }

  //?OBTENER LISTADO DE POS PRE SAPIENCIA ANIDADOS CON POSPRE ORIGEN
  async getPosPreSapienciaList(filters: IProjectAdditionFilters): Promise<ApiResponse<IPagingData<IPosPreSapienciaAdditionList>>>{

    const posPreRes = await this.pospreSapRepository.getPosPreSapienciaList(filters);
    return new ApiResponse(posPreRes, EResponseCodes.OK);

  }



  //* ********************************************
  //? ************ VALIDACIONES EXTRA ************
  //* ********************************************

  //Validador manual para que los valores tengan coincidencia respecto a la información
  async totalsMovementsValidations(addition: IAdditionsWithMovements): Promise<Boolean> {

    let income: number = 0; //Ingresos
    let spend : number = 0; //Gastos

    for( let i of addition.additionMove ){

        if(i.type == "Ingreso"){
          income += i.value;
        }else{
          spend += i.value;
        }

    }

    return (income === spend) ? true : false;

  }

  //Validar que el proyecto, área funcional, fondo, pos pre origen y pos pre sapiencia pertenezcan
  //a una ruta presupuestal ya proveida en la aplicación. Validar existencia de proyecto a partir
  //del código de proyecto referencial.
  async budgetPathValidations(idCard: string, projectId: string , foundId: number , posPreId: number): Promise<string> {

    //* Consulta pos pre sapiencia para obtener el de origen
    const query = await this.pospreSapRepository.getPosPreSapienciaById(posPreId);
    const posPreOriginId = Number(query?.budget?.id);

    //* Primero busquemos si encontramos el proyecto
    const resultProj = await this.projectRepository.getProjectByCode(projectId);
    if(!resultProj) return `ERROR_CODIGOPROYECTO-${idCard}`;
    const presupuestalProjectId = resultProj.id;

    //* Validación contra ruta presupuestal
    // Debe existir una row que tenga todos estos elementos en coincidencia:
    const resultRPP = await this.budgetRouteRepository.getBudgetForAdditions(presupuestalProjectId,
                                                                             foundId,
                                                                             posPreOriginId,
                                                                             posPreId);

    if(!resultRPP) return `ERROR_RUTAPRESUPUESTARIA-${idCard}`;

    console.log({idCard});
    console.log({projectId});
    console.log({presupuestalProjectId});
    console.log({foundId});
    console.log({posPreOriginId});
    console.log({posPreId});

    return `OK-${idCard}`;

  }

  async executeCreateAdditions(addition: IAdditionsWithMovements): Promise<ApiResponse<IAdditionsWithMovements>> {

    const add = await this.additionsRepository.createAdditions(addition.headAdditon);
    console.log(this.movementsRepository);

    if(add.id){

      for( let i of addition.additionMove ){

        //*Hallamos primero el id de proyecto presupuestal a través del código referencial
        const resultProj = await this.projectRepository.getProjectByCode(i.projectId);
        const presupuestalProjectId = Number(resultProj!.id);

        const toCreate = new AdditionsMovement();

        toCreate.fill({
                        additionId : add.id,
                        type : i.type,
                        managerCenter : i.managerCenter,
                        projectId : presupuestalProjectId,
                        fundId : i.fundId,
                        budgetPosition : i.budgetPosition,
                        value : i.value
                      });
        await toCreate.save();

      }

    }else{

      return new ApiResponse(
        addition,
        EResponseCodes.FAIL,
        "Ocurrio un error al intentar realizar la transacción."
      );

    }

    return new ApiResponse(
      addition,
      EResponseCodes.OK,
      "Adición con movimientos creada exitosamente."
    );

  }

}
