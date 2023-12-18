import { DateTime } from "luxon";
import { IFunctionalArea } from "./FunctionalAreaInterfaces";
import { IFunctionalProject } from "./FunctionalProjectInterfaces";

export interface IProjectsVinculation {
  id?: number;
  functionalAreaId: number;
  linked: boolean;
  type: string;
  investmentProjectId: number;
  operationProjectId: number;
  userCreate?: string;
  dateCreate?: DateTime;
  areaFuntional?: IFunctionalArea;
  functionalProject?: IFunctionalProject;
  plannedValue?: number;
  assignedValue?: number;
}

export interface IProjectsVinculationFull extends IProjectsVinculation {
  projectId: string;
  conceptProject: string;
  plannedValue: number;
  assignmentValue: number;
}

export interface IProjectsVinculate {
  idFunctionalArea: number;
  projects: {
    id: number;
    type?: string;
    linked: boolean;
  }[];
  userCreate?: string;
}

export interface IProjectsVinculateFilters {
  page: number;
  perPage: number;
  id?: string;
}
