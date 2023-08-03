export interface IProject {
    id: string,
    name: string,
    plannedValue: number
}

export interface IProjectFilters {
    page: number;
    perPage: number;
    id: string;
}
