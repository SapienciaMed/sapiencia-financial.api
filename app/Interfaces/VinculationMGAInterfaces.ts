import { DateTime } from "luxon";


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
  id?: number;
  mgaId: number;
  budgetId: number;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IFiltersVinculationMGA {
  page: number;
  perPage: number;
  budgetId: number;
  mgaId?:number;
  active?:boolean;
}

export interface ICrudVinculation{
  budgetId:number;
  activities:number[];
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
  elementsDetail: IVinculationMgaV2[]

}

export interface IDesvinculationMgaV2 {

  id: number;
  budgetId?: number;
  activityId?: number;
  consecutiveActivityDetailed?: string;
  detailedActivityId?: number;

}

export interface IDesvinculationMgaWithMultipleV2 {

  id?: number;
  elementsDetail: IDesvinculationMgaV2[]

}
