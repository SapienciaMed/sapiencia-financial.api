import { DateTime } from "luxon";
import { IEntities } from "./EntitiesInterfaces";

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
