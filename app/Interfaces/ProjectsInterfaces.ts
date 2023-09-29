export interface IProject {
    id: number;
    type: string;
    projectCode: string;
    name: string;
    plannedValue: number;
    assignmentValue: number;
    linked?: number;
}



export interface IProjectFilters {
    page: number;
    perPage: number;
    id: string;
}
