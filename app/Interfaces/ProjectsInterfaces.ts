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
