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

export interface ITransfersMovements {
  idCard? : string;
  id?: number;
  additionId?: number;
  type: string;
  managerCenter: string;
  projectId: number //Referencia a la otra API de planeación
  fundId: number;
  budgetPosition: number;
  value: number;
}

export interface ITransfersWithMovements {
  id?: number;                //Para edición
  headTransfer?: ITransfers,   //Opcional porque en edición no lo requerimos
  transferMove?: ITransfersMovements[]
}
