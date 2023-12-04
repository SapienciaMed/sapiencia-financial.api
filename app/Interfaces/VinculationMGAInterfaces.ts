import { DateTime } from "luxon";
import { IBudgets } from "./BudgetsInterfaces";
import { IPosPreSapiencia } from "./PosPreSapienciaInterfaces";

export interface IDetailedActivitiesFilter {
  page: number;
  perPage: number;
  budgetId: number;
}

export interface IDetailedActivity {
  id?: number;
  activityDetailedId: number; // PK Actividad Detallada
  consecutiveActivityDetailed: string; // Código Consecuetivo Actividad Detallada #.#.# ...
  detailActivityDetailed: string; // Descripción Actividad Detallada
  amountActivityDetailed: number; // Cantidad
  measurementActivityDetailed: number; // Medida
  measurementActivityDetailedName: string; // Unidad medida traducida
  unitCostActivityDetailed: number; // Costo Unitario
  totalCostActivityDetailed: number; // Costo Total
  activityId: number; // PK Actividad General
  codeMga: number; // Código General de Actividad MGA
  codeConsecutiveProductMga: string; // Consecutivo Código Producto
  productDescriptionMGA: string; // Descripción Producto
  codeConsecutiveActivityMga: string; // Consecutivo Código Actividad
  activityDescriptionMGA: string; // Descripción Actividad
}

export interface IActivityMGA {
  id?: number;
  budgetId: number;
  activityId: number;
  consecutiveActivityDetailed: string;
  detailedActivityId: number;
  userCreate?: string;
  dateCreate?: Date;
}

export interface IVinculationMGA {
  id: number;
  budgetId: number;
  detailedActivityId: number;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IVinculationMGAFilters {
  page: number;
  perPage: number;
  budgetId: number;
}

export interface IFiltersVinculationMGA {
  page: number;
  perPage: number;
  budgetId: number;
  mgaId?: number;
  active?: boolean;
}

export interface ICrudVinculation {
  budgetId: number;
  activities: number[];
  userCreate?: string;
}

//? Nuevo
export interface IVinculationMgaV2 {
  id?: number;
  budgetId: number;
  activityId: number;
  consecutiveActivityDetailed: string;
  detailedActivityId: number;
  userCreate?: string;
}

export interface IVinculationMgaWithMultipleV2 {
  id?: number;
  elementsDetail: IVinculationMgaV2[];
}

export interface IDesvinculationMgaV2 {
  id?: number;
  budgetId?: number;
  activityId?: number;
  consecutiveActivityDetailed?: string;
  detailedActivityId?: number;
  status?: string;
}

export interface IDesvinculationMgaWithMultipleV2 {
  id?: number;
  elementsDetail: IDesvinculationMgaV2;
}

export interface IUpdateVinculationMultiple {
  pospreorig: IBudgets;
  pospresapi?: IPosPreSapiencia[];
  vinculationmga: IDesvinculationMgaWithMultipleV2[];
}
