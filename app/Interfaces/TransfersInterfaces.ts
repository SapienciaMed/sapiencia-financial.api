import { DateTime } from 'luxon';

export interface ITransfers {
  id?: number;
  actAdminDistrict: string;
  actAdminSapiencia: string;
  observations: string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime
}

export interface ITransfersFilters {
  page: number;
  perPage: number;

  adminDistrict?: string;
  adminSapiencia?: string;
  observations?: string;
  budgetId?: number;
  number?: string;
}

export interface IOriginsAndDestinations {

  id?: number,
  transferId?: number;
  idCard?: string,
  type : string,
  managerCenter : string,
  projectId : number,
  fundId : number,
  budgetPosition : number,
  value : number

}

export interface ITransfersMovements {


    data : IOriginsAndDestinations[]


}

export interface ITransfersWithMovements {
  id?: number; //Para traslado
  headTransfer?: ITransfers,
  transferMovesGroups: ITransfersMovements[]
}


/**
 *
 *
 *
 */

//* ***********************************
export interface IFunctionalAreaTransfer {
  id?: number;
  number: string;
  denomination: string;
  description: string;
}

export interface IProjectTransfer {
  id : number;
  functionalAreaId : number;
  projectId : number;
  budgetValue : number;
  linked : boolean;
}

export interface IProjectTransferList {
  id : number;
  functionalAreaId : number;
  projectId : number;
  budgetValue : number;
  linked : boolean;
  areaFuntional?: IFunctionalAreaTransfer
}

export interface IEntitiesTransfer {
  id: number;
  name: string;
}

export interface IFundsTransfer {
  id?: number;
  entityId: number;
  number: number;
  denomination: string;
  description: string;
  dateFrom: DateTime;
  dateTo: DateTime;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IFundsTransferList {
  id?: number;
  entityId: number;
  number: string;
  denomination: string;
  description: string;
  dateFrom: DateTime;
  dateTo: DateTime;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  entity?: IEntitiesTransfer
}

export interface IBudgetsTransfer {
  id?: number;
  entityId: number;
  ejercise: number;
  number:string;
  denomination:string;
  description:string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  entity?: IEntitiesTransfer
}

export interface IPosPreSapienciaTransferList {
  id?: number;
  number: string;
  budgetId: number;
  ejercise: number;
  description: string;
  consecutive: number;
  assignedTo: string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  budget?: IBudgetsTransfer;
}

export interface IBudgetsTransfer {
  id?: number;
  entityId: number;
  ejercise: number;
  number:string;
  denomination:string;
  description:string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IPosPreTransfer {
  id?: number;
  number: string;
  budgetId: number;
  ejercise: number;
  description: string;
  consecutive: number;
  assignedTo: string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IPosPreTransfer {
  budget : IBudgetsTransfer;
  pospre : IPosPreTransfer;
  posPreSapArray : string[];
  posPreArray : string[];
}

export interface IProjectTransferFilters {
  page?: number;
  perPage?: number;
}
