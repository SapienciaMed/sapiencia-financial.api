import { IBudgetsRoutes } from "./BudgetsRoutesInterfaces";
import { DateTime } from "luxon";

export interface IBudgetAvailabilityFilters {
  dateOfCdp: string;
  page: number;
  perPage: number;
  initialDate?: string;
  endDate?: string;
  pospreId?: number;
  fundId?: number;
  projectId?: number;
  consecutiveSap?: number;
  consecutiveAurora?: number;
  contractObject?: string;
}

export interface IAmountBudgetAvailability {
  id: number;
  cdpCode: number;
  idRppCode: number;
  cdpPosition: number;
  amount: string;
  budgetRoute: IBudgetsRoutes;
}

export interface IBudgetAvailability {
  id: number;
  date: string;
  contractObject: string;
  consecutive: number;
  sapConsecutive: number;
  icdAmounts: IAmountBudgetAvailability[];
}

export interface ICreateCdp {
  date: DateTime;
  contractObject: string;
  consecutive: number;
  sapConsecutive: number;
  icdArr: {
    idRppCode: number;
    cdpPosition: number;
    amount: number;
  }[];
}

export interface IUpdateBasicDataCdp {
  id: number;
  dateOfCdp?: DateTime;
  contractObject?: string;
}
