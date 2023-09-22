import { DateTime } from "luxon";

export interface IFunctionalProject {

  id?: number;
  entityId:number;
  number: string;
  name: string;
  isActivated: boolean;
  exercise: number;
  dateFrom: DateTime;
  dateTo: DateTime;
  budgetValue: number;
  assignmentValue: number;
  userModify: string;
  dateModify: DateTime;
  userCreate: string;
  dateCreate: DateTime;

}
