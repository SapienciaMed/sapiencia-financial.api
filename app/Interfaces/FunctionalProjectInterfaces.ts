
export interface IFunctionalProject {

  id?: number;
  entityId:number;
  number: string;
  name: string;
  isActivated: boolean;
  exercise: number;
  dateFrom: string;
  dateTo: string;
  budgetValue?: number;
  assignmentValue?: number;
  userModify?: string;
  dateModify?: string;
  userCreate?: string;
  dateCreate?: string;

}

export interface IFunctionalProjectFilters {
  page: number;
  perPage: number;
}