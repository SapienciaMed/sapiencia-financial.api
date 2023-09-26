import { DateTime } from "luxon";

export interface IAdditionsMovements {
  idCard? : string;
  id?: number;
  additionId?: number;
  type: string;
  managerCenter: string;
  projectId: number //Referencia a la otra API de planeación
  fundId: number;
  budgetPosition: number;
  value: number;
  typeMovement: string;
}

export interface IAdditions {
  id?: number;
  actAdminDistrict: string;
  actAdminSapiencia: string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime,
  typeMovement: string;
}

export interface IAdditionsWithMovements {
  id?: number;                //Para edición
  headAdditon?: IAdditions,   //Opcional porque en edición no lo requerimos
  additionMove: IAdditionsMovements[]
}

//Lo dejarémos genérico para todos los elementos subyacentes
export interface IAdditionsFilters {
  page: number;
  perPage: number;

  adminDistrict?: string;
  adminSapiencia?: string;
  budgetId?: number;
  number?: string;
  typeMovement?: string;
}

//* ***********************************
export interface IFunctionalAreaAddition {
  id?: number;
  number: string;
  denomination: string;
  description: string;
}

export interface IProjectAddition {
  id : number;
  functionalAreaId : number;
  projectId : number;
  budgetValue : number;
  linked : boolean;
}

export interface IProjectAdditionList {
  id : number;
  functionalAreaId : number;
  projectId : number;
  budgetValue : number;
  linked : boolean;
  areaFuntional?: IFunctionalAreaAddition
}

export interface IEntitiesAddition {
  id: number;
  name: string;
}

export interface IFundsAddition {
  id?: number;
  entityId: number;
  number: number;
  denomination: string;
  description: string;
  dateFrom: DateTime;
  dateTo: DateTime;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IFundsAdditionList {
  id?: number;
  entityId: number;
  number: string;
  denomination: string;
  description: string;
  dateFrom: DateTime;
  dateTo: DateTime;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  entity?: IEntitiesAddition
}

export interface IBudgetsAddition {
  id?: number;
  entityId: number;
  ejercise: number;
  number:string;
  denomination:string;
  description:string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  entity?: IEntitiesAddition
}

export interface IPosPreSapienciaAdditionList {
  id?: number;
  number: string;
  budgetId: number;
  ejercise: number;
  description: string;
  consecutive: number;
  assignedTo: string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  budget?: IBudgetsAddition;
}

export interface IBudgetsAddition {
  id?: number;
  entityId: number;
  ejercise: number;
  number:string;
  denomination:string;
  description:string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IPosPreAddition {
  id?: number;
  number: string;
  budgetId: number;
  ejercise: number;
  description: string;
  consecutive: number;
  assignedTo: string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IPosPreAddition {
  budget : IBudgetsAddition;
  pospre : IPosPreAddition;
  posPreSapArray : string[];
  posPreArray : string[];
}

export interface IProjectAdditionFilters {
  page?: number;
  perPage?: number;
}

