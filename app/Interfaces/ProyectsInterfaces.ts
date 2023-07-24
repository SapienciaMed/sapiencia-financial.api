import { DateTime } from "luxon";
import { IFunctionalArea } from "./FunctionalAreaInterfaces";

export interface IProyects {
  id?: number;
  entity?: IFunctionalArea,
  codeProyect:number,
  name: string;
  plannedValue: number;
  budgetValue:number;
  userCreate?: string;
  dateCreate?: DateTime;
  
}

export interface IProyectsFilters {
  page: number;
  perPage: number;
  entity?: IFunctionalArea,
  codeProyect:number,
  name: string;
  plannedValue: number;
  budgetValue:number;
}
