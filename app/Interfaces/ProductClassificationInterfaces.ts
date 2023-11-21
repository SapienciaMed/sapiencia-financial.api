import { DateTime } from "luxon";

export interface IProductClassification {
  id?: number;
  number: string;
  description: string;
  budgetId: number;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
}
