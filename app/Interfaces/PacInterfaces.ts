
export interface IReviewBudgetRoute {

  rowExcel: number; //? REQUERIDO
  managementCenter: string, //? REQUERIDO
  sapienciaPosition: string, //* Opcional
  sapienciaBudgetPosition: string, //? REQUERIDO
  fundSapiencia: string, //? REQUERIDO
  fund: string, //* Opcional
  functionArea: string, //* Opcional
  project: string; //? REQUERIDO
  totalBudget:string; // REQUERIDO
  pacAnnualization: PacAnnualization[]; //? REQUERIDO

}

export interface IBody {

  exercise: number;
  typeSource: string;
  typePac: string;
  version?:number;
}

//Desestructuración de interfaz final de data
export interface IDataFromExcel {
  data: Datum[];
}

export interface Datum {
  rowExcel:                number;
  managementCenter:        number;
  sapienciaPosition:       number | null | string;
  sapienciaBudgetPosition: number;
  fundSapiencia:           number;
  fund:                    number;
  functionArea:            string;
  project:                 number | string;
  pacAnnualization:        PacAnnualization[];
}


export interface PacAnnualization {
  type: Type;
  jan:  number | null;
  feb:  number | null;
  mar:  number | null;
  abr:  number | null;
  may:  number | null;
  jun:  number | null;
  jul:  number | null;
  ago:  number | null;
  sep:  number | null;
  oct:  number | null;
  nov:  number | null;
  dec:  number | null;
}

export enum Type {

  Programado = "Programado",
  Recaudado = "Recaudado",

}

export interface IDataFromExcelRouteProcess {

  errorsWithRoutes: IErrorMessageRoutes;
  routesResult: IResultProcRoutes;

}

export interface IErrorMessageRoutes {

  message: string,
  error: boolean,
  rowError: number,
  columnError: string | null

}

export interface IResultProcRoutes {

  id?: number,
  numberExcelRom?: number;
  sourceType?: string,
  budgetRouteId?: number,
  version?: number,
  exercise?: number,
  isActive?: boolean,
  dateModify?: Date,
  dateCreate?: Date,
  pacAnnualizationProgrammed?: PacAnnualization;
  pacAnnualizationCollected?: PacAnnualization;

  projectsError?: string[];
  fundsError?: string[];
  posPreSapiError?: string[];
  routesError?: string[];
  routesNotFound?: string[];

}

export interface IResultProcRoutesWithErrors {

  condensed?: IResultProcRoutes;

  projectsError?: string[];
  fundsError?: string[];
  posPreSapiError?: string[];
  routesError?: string[];
  routesNotFound?: string[];

}

export interface IProjectPaginated {

  nameOrCode?: string;
  excludeIds?: number[];
  page: number;
  perPage: number;

}

export interface IFunctionalProjectPaginated {

  active: boolean;
  page: number;
  perPage: number;

}

export interface IPacPrimary {

  id?: number;
  sourceType?: string;
  budgetRouteId?: number;
  version?: number;
  exercise?: number;
  isActive?: boolean;
  dateModify?: Date;
  dateCreate?: Date;

}

export interface IPacFilters {
  page: number;
  perPage: number;
  pacType?: string;
  exercise?: number;
  resourceType?: string;
}

//! Listado dinámicos para presentar en traslados.
//! Consultas a la inversa, de ruta -> proyecto-fondo-pospre
export interface IDinamicListForProjects {

  idVinculation: number;
  idProjectPlanning: number;
  projectCode: string;
  posPreSapiRef?: string;
  projectName: string;
  numberFunctionalArea: string;

}

export interface IDinamicListForFunds {

  idFund: number;
  fundCode: string;

}

export interface IDinamicListForPospres {

  idPosPreSapi: number;
  numberCodeSapi: string;
  descriptionSapi: string;
  idPosPreOrig: number;
  numberCodeOrig: string;

}

export interface IPacComplementary {

  headerComposition?: IPacFilters;
  listBudgetsRoutes?: number[];
  listProjects?: IDinamicListForProjects[];
  listFunds?: IDinamicListForFunds[];
  listPospreSapi ?: IDinamicListForPospres[];

}
