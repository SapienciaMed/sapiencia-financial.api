import { DateTime } from "luxon";

export interface IFunctionalArea {
  id?: number;
  number: string;
  denomination: string;
  description: string;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IFunctionalAreaFilters {
  page: number;
  perPage: number;
  number?: number;
}
