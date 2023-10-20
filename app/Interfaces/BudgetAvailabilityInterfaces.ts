import { IBudgetsRoutes } from "./BudgetsRoutesInterfaces";

export interface IBudgetAvailabilityFilters {
  dateOfCdp: string;
  page: number;
  perPage: number;
  initialDate?: string;
  endDate?: string;
  pospreId?: number;
  fundId?: number;
  projectId?: number;
  consecutiveSap?: string;
  consecutiveAurora?: string;
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
  icdAmounts: IAmountBudgetAvailability[];
}
