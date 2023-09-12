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
