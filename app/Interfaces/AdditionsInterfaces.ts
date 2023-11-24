import { DateTime } from "luxon";
import { IBudgetsRoutes } from "./BudgetsRoutesInterfaces";

export interface IAdditionsMovements {
  idCard?: string;
  id?: number;
  additionId?: number;
  type: string;
  managerCenter: string;
  projectId: number; //Referencia a la otra API de planeación
  fundId: number;
  budgetPosition: number;
  value: number;
  typeMovement: string;
}

export interface IAdditionsMovement {
  id: number;
  additionId: number;
  type: string;
  budgetRouteId: number;
  value: string;
  budgetRoute: IBudgetsRoutes;
}

export interface IAdditions {
  id?: number;
  actAdminDistrict: string;
  actAdminSapiencia: string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  typeMovement: string;
}

export interface IAdditionsReport {
  id?: number;
  actAdminDistrict: string;
  actAdminSapiencia: string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: Date;
  typeMovement: string;
  additionMove: IAdditionsMovement[];
}

export interface IAdditionsWithMovements {
  id?: number; //Para edición
  headAdditon?: IAdditions; //Opcional porque en edición no lo requerimos
  additionMove: IAdditionsMovements[];
}

export interface IAdditionsFull {
  head: IAdditions;
  details: IAdditionsMovement[];
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
  id: number;
  functionalAreaId: number;
  projectId: number;
  budgetValue: number;
  linked: boolean;
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
  entity?: IEntitiesAddition;
}

export interface IBudgetsAddition {
  id?: number;
  entityId: number;
  ejercise: number;
  number: string;
  denomination: string;
  description: string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  entity?: IEntitiesAddition;
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
  number: string;
  denomination: string;
  description: string;
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
  budget: IBudgetsAddition;
  pospre: IPosPreAddition;
  posPreSapArray: string[];
  posPreArray: string[];
}

export interface IProjectAdditionFilters {
  page?: number;
  perPage?: number;
}

export interface IFilterUpdateAdditionValues {
  additionId: number;
  type: string;
  budgetRouteId: number;
  value: number;
}

export interface IUpdateAdditionValues {
  id: number;
  idProjectVinculation: number;
  managementCenter: string;
  div: string;
  idBudget: number;
  idPospreSapiencia: number;
  idFund: number;
  initialBalance: string;
  balance: number;
  userModify: string;
  dateModify: Date;
  userCreate: string;
  dateCreate: Date;
}

export interface IFiltersValidationGetTotalCostsByFilter {
  validityYear: number;
  projectId: number;
  posPreOriginId: number;
  valueTotalExpenses: number;
  sumBalancesBudgetRoutes: number;
  total: number;
}
