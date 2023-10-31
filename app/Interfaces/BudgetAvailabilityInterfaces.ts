import { IBudgetsRoutes } from "./BudgetsRoutesInterfaces";
import { DateTime } from "luxon";

export interface IBudgetAvailabilityFilters {
  dateOfCdp: string;
  page: number;
  perPage: number;
  initialDate?: DateTime;
  endDate?: DateTime;
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
  id?: number;
  exercise: string;
  date: DateTime;
  contractObject: string;
  consecutive: number;
  sapConsecutive?: number;
  rpAssocs?:string;
  icdArr: {
    id?: number;
    idRppCode: number;
    cdpPosition: number;
    amount: number;
    isActive?: boolean;
    reasonCancellation?: string;
  }[];
}

export interface IUpdateBasicDataCdp {
  id: number;
  date?: string;
  contractObject?: string;
  sapConsecutive?: number | null | undefined;
}

/* export interface IAmountBudgetAvailability{
  cdpCode: number;
  idRppCode: number;
  cdpPosition: number;
  amount: number;
  rpAssocs?: string;

} */

export interface IUpdateRoutesCDP {
  id?:                       number;
  idRppCode:                 number;
  cdpPosition:               number;
  amount:                    number;
  modifiedIdcCountercredit?: number;
  idcModifiedCredit?:        number;
  idcFixedCompleted?:        number;
  idcFinalValue?:            number;
}

