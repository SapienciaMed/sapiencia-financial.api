import { DateTime } from "luxon";

export interface IFunctionalArea {
  id?: number;
  number: string;
  denomination: string;
  description: string;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IFunctionalAreaFilters {
  page: number;
  perPage: number;
  number?: number;
}
export interface IErrorsUploadMasive {
  rowIndex: number;
  columnName: string;
  errorMessage: string;
}

export interface IResponseUploadMasiveFunctionalArea {
  generalResponse: string;
  errorsResponse: IErrorsUploadMasive[] | null;
  headers: string[];
  items: IFunctionalAreaMasiveSave[];
}

export interface IFunctionalAreaMasiveSave {
  number: string;
  userCreate?: string;
  denomination?: string;
  description?: string;
  dateCreate?: DateTime;
  tipoProyecto?: string; // Puedes quitar estas propiedades si no son necesarias
  proyecto?: string;     // Puedes quitar estas propiedades
}