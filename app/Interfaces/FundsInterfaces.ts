import { DateTime } from "luxon";
import { IEntities } from "./EntitiesInterfaces";

export interface IFunds {
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
  entity?: IEntities
}

export interface IFundsFilters {
  page: number;
  perPage: number;
  entity?: number;
  number?: string;
  dateFrom?: DateTime;
  dateTo?: DateTime;
}
