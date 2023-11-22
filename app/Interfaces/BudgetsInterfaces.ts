import { DateTime } from "luxon";
import { IEntities } from "./EntitiesInterfaces";
import { IProductClassification } from "./ProductClassificationInterfaces";

export interface IBudgets {
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
  entity?: IEntities;
  productClassifications?: IProductClassification[];
}

export interface IFilterBudgets {
  page: number;
  perPage: number;
  entity?: number;
  ejercise?: number;
  number:string;
  denomination:string;
}
