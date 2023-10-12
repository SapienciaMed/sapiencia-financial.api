import { DateTime } from "luxon";
import { IBudgets } from "./BudgetsInterfaces";
import { IFunds } from "./FundsInterfaces";
import { IProjectsVinculation } from "./ProjectsVinculationInterfaces";
import { IPosPreSapiencia } from "./PosPreSapienciaInterfaces";

export interface IBudgetsRoutes {
  id?: number;
  idProjectVinculation: number;
  managementCenter: string;
  div: string;
  idBudget: number;
  idPospreSapiencia: number;
  idFund: number;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  projectVinculation?: IProjectsVinculation;
  pospreSapiencia?: IPosPreSapiencia;
  budget?: IBudgets;
  fund?: IFunds;
}

export interface IBudgetsRoutesFilters {
  page: number;
  perPage: number;
  idProjectVinculation?: number;
}
