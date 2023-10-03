import { DateTime } from "luxon";
import { IFunctionalArea } from "./FunctionalAreaInterfaces";

export interface IProjectsVinculation {
  id?: number;
  functionalAreaId: number;
  projectId: string;
  budgetValue: number;
  linked: boolean;
  type: string;
  investmentProjectId: number;
  operationProjectId: number;
  userCreate?: string;
  dateCreate?: DateTime;

  areaFuntional?: IFunctionalArea
}

export interface IProjectsVinculate {
  idFunctionalArea: number;
  projects: {
    id: number;
    type: string;
    linked: boolean;
  }[];
  userCreate?: string;
}

export interface IProjectsVinculateFilters {
  page: number;
  perPage: number;
  id?: string;
}
