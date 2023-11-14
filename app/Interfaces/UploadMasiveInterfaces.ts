export interface IResponseUploadMasive {
  generalResponse: string;
  errorsResponse: IErrorsUploadMasive[] | null;
  headers?: any[]; //TODO!
  items?: any[]; //TODO!
}

export interface IErrorsUploadMasive {
  row: number;
  description: string;
}

export interface IFundsUploadMasive {
  row?: number;
  cpEntity: string;
  code: string;
  denomination: string;
  description: string;
  dateFrom: Date;
  dateTo: Date;
}
