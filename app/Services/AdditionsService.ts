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

export interface IAdditionsService {

  getAdditionsPaginated(filters: IAdditionsFilters): Promise<ApiResponse<IPagingData<IAdditions>>>;
  createAdditions(addition: IAdditionsWithMovements): Promise<ApiResponse<IAdditionsWithMovements>>;
  getAllAdditionsList(list: string): Promise<ApiResponse<IAdditions[]>>;
  getAdditionById(id: number): Promise<ApiResponse<IAdditionsWithMovements>>;
  getProjectsList(filters: IProjectAdditionFilters): Promise<ApiResponse<IPagingData<IProjectAdditionList>>>;
  getFundsList(filters: IProjectAdditionFilters): Promise<ApiResponse<IPagingData<IFundsAdditionList>>>;
  getPosPreList(): Promise<IPosPreAddition | string[]>;
  getPosPreSapienciaList(filters: IProjectAdditionFilters): Promise<ApiResponse<IPagingData<IPosPreSapienciaAdditionList>>>;

  //*Validaciones Front
  totalsMovementsValidations(addition: IAdditionsWithMovements): Promise<Boolean>

}

export default class AdditionsService implements IAdditionsService{

  constructor(
    private additionsRepository: IAdditionsRepository,
    private movementsRepository: IMovementAdditionRepository,
    private projectRepository: IProjectsRepository,
    private fundsRepository: IFundsRepository,
    private pospreSapRepository: IPosPreSapienciaRepository,
    private budgetRepository: IBudgetsRepository
  ) {}

  //?OBTENER PAGINADO Y FILTRADO LAS ADICIONES CON SUS MOVIMIENTOS
  async getAdditionsPaginated(filters: IAdditionsFilters): Promise<ApiResponse<IPagingData<IAdditions>>> {

    const res = await this.additionsRepository.getAdditionsPaginated(filters);
    return new ApiResponse(res, EResponseCodes.OK);

  }

  //?CREACIÓN DE ADICIÓN CON SUS MOVIMIENTOS EN PARALELO
  async createAdditions(addition: IAdditionsWithMovements): Promise<ApiResponse<IAdditionsWithMovements | any>>{

    //* Validación de totales ingresos/gastos


    //* Validación de ruta presupuestaria


    // return new ApiResponse(
    //   addition,
    //   EResponseCodes.OK,
    //   "Adición con movimientos creada exitosamente."
    // );

    const add = await this.additionsRepository.createAdditions(addition.headAdditon);
    console.log(this.movementsRepository);

    if(add.id){

      for( let i of addition.additionMove ){

        const toCreate = new AdditionsMovement();
        toCreate.fill({ additionId : add.id, ...i });
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


  //* **************************************
  //? ************ VALIDATIONS ************
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

}
