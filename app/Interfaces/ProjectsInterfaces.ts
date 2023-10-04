export interface IProject {
    id: string,
    name: string,
    plannedValue: number,
    assignmentValue: number,
}

export interface IProjectFilters {
    page: number;
    perPage: number;
    id: string;
}

export interface IProjectFiltersWithPlanning {
  page?: number;
  perPage?: number;
  id?: string;
  nameOrCode?: string;
  searchFunctionaArea?: number;
}
