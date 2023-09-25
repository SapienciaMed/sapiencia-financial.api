import { DateTime } from "luxon";

export interface IFunctionalProject {

  id?: number;
  entityId:number;
  number: string;
  name: string;
  isActivated: boolean;
  exercise: number;
  dateFrom: Date;
  dateTo: Date;
  budgetValue?: number;
  assignmentValue?: number;
  userModify: string;
  dateModify: Date;
  userCreate: string;
  dateCreate: DateTime;

}
