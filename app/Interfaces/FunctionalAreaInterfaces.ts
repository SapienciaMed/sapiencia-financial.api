import { DateTime } from "luxon";

export interface IFunctionalArea {
  id?: number;
  areaFunctionalCode: number;
  denomination: string;
  description: string;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IFunctionalAreaFilters {
  page: number;
  perPage: number;
  id?: number;
  areaFunctionalCode: number;
  denomination: string;
  description: string;
  userCreate?: string;
  dateCreate?: DateTime;
}
