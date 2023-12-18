
import { DateTime } from "luxon";
import { IBudgets } from "./BudgetsInterfaces";
import { IEntities } from './EntitiesInterfaces';

export interface IPosPreSapiencia {
  id?: number;
  number: string;
  budgetId: number;
  ejercise: number;
  description: string;
  consecutive: string;
  assignedTo: string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  budget?: IBudgets;
}

export interface IPosPreOrigen {
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
  entity?: IEntities
}

export interface IFiltersPosPreSapiencia {
  page: number;
  perPage: number;
  budgetId: number;
  number: string;
}

export interface IFiltersPosPreSapienciaMix {
  page: number;
  perPage: number;
  budgetIdOrig?: number; //Id Pospre Origen
  budgetNumberOrig?: number; //Number Pospre Origen
  budgetIdSapi?: number; //Id Pospre Sapienica
  budgetNumberSapi?: number | string; //Number Pospre Sapienica
}

export interface IPospreUploadMasive {
  id?: number;
  number?: string;
  budgetId?: number;
  ejercise?: number;
  description?: string;
  consecutive?: string;
  assignedTo?: string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  entityId?: number;
  denomination?: string;
  descriptionOrigen?: string;
}

export interface IErrorsUploadMasive {
  rowIndex: number;
  columnName: string;
  errorMessage: string;
}

export interface IResponsePospreUploadMasive {
  generalResponse: string;
  errorsResponse: IErrorsUploadMasive[] | null;
  headers: string[];
  items: IPospreUploadMasive[];
}