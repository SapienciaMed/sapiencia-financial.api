export interface IResponseUploadMasive {
  generalResponse: string;
  errorsResponse: IErrorsUploadMasive[] | null;
  headers?: any[]; //TODO!
  items?: any[]; //TODO!
}

export interface IErrorsUploadMasive {
  row: number;
  description: string;
  additionalDef?: string;
}

export interface IFundsUploadMasive {
  row?: number;
  entityId: number;
  number: string;
  denomination: string;
  description: string;
  dateFrom: Date;
  dateTo: Date;
  userCreate? : string;
}
