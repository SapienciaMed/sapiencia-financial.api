import { DateTime } from "luxon";

export interface ICPC {
  id?: number;
  number: string;
  description: string;
  budgetId: number;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
}
