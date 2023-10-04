import { DateTime } from "luxon";

export interface IProjectsVinculation {
  id?: number;
  functionalAreaId?: number,
  projectId: string,
  budgetValue: number;
  linked: boolean;
  type?: string;
  idFunctional?: number;
  idInvestment?: number;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IProjectsVinculate {
  idFunctionalArea: number;
  projects: {
    id: any;
    linked: boolean;
  }[];
  userCreate?: string;
}

export interface IProjectsVinculateFilters {
  page: number;
  perPage: number;
  id?: string;
}
