import PacAnnualization from 'App/Models/PacAnnualization';
import { DateTime } from 'luxon';

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
  userCreate?:string;
  userModify?:string;
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
  pacAnnualization:        IPacAnnualization[];
}


export interface IPacAnnualization {
  id?: number;
  pacId?: number;
  type: string;
  jan:  number;
  feb:  number;
  mar:  number;
  abr:  number;
  may:  number;
  jun:  number;
  jul:  number;
  ago:  number;
  sep:  number;
  oct:  number;
  nov:  number;
  dec:  number;
  dateModify?: Date;
  dateCreate?: Date;
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
  balance?:number,
  version?: number,
  exercise?: number,
  isActive?: boolean,
  dateModify?: Date | string,
  dateCreate?: Date | string,
  userCreate?:string;
  userModify?:string;
  pacAnnualizationProgrammed?: any; //IPacAnnualization;
  pacAnnualizationCollected?: any; //IPacAnnualization;

  projectsError?: string[];
  fundsError?: string[];
  posPreSapiError?: string[];
  routesError?: string[];
  routesNotFound?: string[];
  errors?: IErrosPac[];

}

export interface IResultProcRoutesWithErrors {

  condensed?: IResultProcRoutes;

  projectsError?: string[];
  fundsError?: string[];
  posPreSapiError?: string[];
  routesError?: string[];
  routesNotFound?: string[];
  errors?: IErrosPac[];

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
  version?: number;
  resourceType?: string;
  route?: number;

  managementCenter?: string;
  idProjectVinculation?: number;
  idBudget?: number;
  idPospreSapiencia?: number;
  idFund?: number;
  idCardTemplate?: string;
}

export interface IPacAnnualAdapter {

  //Principales
  pacType: string; //* De este dependerá si traigo Programado/Recaudado/Ambos
  exercise: number;
  resourceType: string;

  managementCenter: string;
  idProjectVinculation: number;
  idBudget: number;
  idPospreSapiencia: number;
  idFund: number;
  idCardTemplate: string;

  //Complementarios
  numberFunctionalArea?: number;
  projectName?: string;
  idRouteComplete?: number;

}

export interface IBudgetsRoutesSimple {

  id?: number;
  idProjectVinculation?:number;
  managementCenter?:string;
  div?:string;
  idBudget?:number;
  idPospreSapiencia?:number;
  idFund?:number;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;

}

export interface ITotalsSimple {

  totalProgramming: number;
  totalCollected: number;

}

export interface IResultSearchAnnualizationByRoute {

  headerResult: IPacFilters;
  routeResult: IBudgetsRoutesSimple;
  annualRoute: IPacAnnualization[] | any;
  totalsRes: ITotalsSimple;

}

//! Listado dinámicos para presentar en traslados.
//! Consultas a la inversa, de ruta -> proyecto-fondo-pospre
//! Pendientes por bugs de traslados también
export interface macroTotalsWithTransferPac {

  plusOrigenProgramming: number;
  plusDestinitiesProgramming: number;
  plusOrigenCollected: number;
  plusDestinitiesCollected: number;

}

export interface IDinamicListForProjects {

  idVinculation: number;
  idProjectPlanning?: number | null;
  idProjectFunctional?: number | null;
  projectCode: string;
  posPreSapiRef?: string | null;
  posPreSapiRefId?: number | null;
  projectName: string;
  idFunctionalArea?: number;
  numberFunctionalArea?: string;

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
  candidatesRoutes?: number[];
  listProjects?: IDinamicListForProjects[];
  listFunds?: IDinamicListForFunds[];
  listPospreSapi ?: IDinamicListForPospres[];

}

export interface IErrosPac {
  message: string;
  error: boolean;
  rowError: number;
  columnError?: number | null;
}

export interface ITotalsByTransfers {

  idPac?: number;
  idRoute?: number;
  managementCenter?: string,
  idProjectVinculation?: number,
  idBudget?: number,
  idPospreSapiencia?: number,
  idFund?: number,
  idCardTemplate?: string,
  balance?: number;
  totalProgrammig: number;
  totalCollected: number;

}

export interface IPac {

  id?: number,
  sourceType?: string,
  budgetRouteId?: number,
  version?: number,
  exercise?: number,
  isActive?: boolean,
  dateModify?: Date,
  dateCreate?: Date,
  pacAnnualizations?: IPacAnnualization[],
  dataCondensed?: ISearchGeneralPac

}

export interface IResponseTransferPac {

  origins: IResponseSub;
  destinities: IResponseSub[];

}

export interface IResponseSub {

  original: ITotalsByTransfers[] | null;
  request: ITotalsByTransfers[] | null;

}

export interface IPacSecondary {

  id?: number;
  sourceType?: string;
  budgetRouteId?: number;
  version?: number;
  exercise?: number;
  isActive?: boolean;
  dateModify?: Date;
  dateCreate?: Date;

}

export interface ISearchGeneralPac {

  projectName: string;
  numberFund: string | number;
  posPreSapi: string | number;
  budgetSapi: string | number;
  budgetCollected: string | number;
  percentExecute: number;

  pacId?: number;
  routeId?: number;
  posPreOrig?: string | number;

  projectVinculationId?: number;
  fundId?: number;
  posPreSapiId?: number;
  posPreOrigId?: number;

}

export interface ICreateAssociation {

    exercise?: number;
    resourceType?: string;
    route?: number;
    pacId?: number;
    type?: string;
    version?: number;
    idProjectVinculation?: number;
    idFund?: number;
    idPospreSapiencia?: number;
    idBudget?: number;
    budgetSapiencia?: number;
    annualization?: IPacAnnualization;

}

export interface IAssociationSuccess {

  Pac : IPac;
  PacAnnualization : IPacAnnualization;

}

export interface IResultSearchDinamicPac {
  resultPac : IPac | null,
  totalsPac : {
    totalProgramming : number;
    totalCollected : number;
  }
  resultRoute: {
    managementCenter : string;
    fundNumber : string;
    fundId : number;
    posPreSapiDescription : string;
    posPreSapiNumber : string;
    posPreSapiId : number;
    posPreOrigNumber : string;
    posPreOrigId : number;
    projectVinculationId : number;
    projectPlanningId : number;
    projectCode : string;
    projectName : string;
    functionalAreaId : number;
    functionalAreaNumber : string;
  }
}

export interface IEditPac  {

  route?: number;
  pacId?: number;
  budgetRouteId?: number;
  type?: string;
  version?: number;
  resourceType?: string;
  pacType?: string;

  idProjectVinculation?: number;
  idFund?: number;
  idPospreSapiencia?: number;
  idBudget?: number;

  budgetSapiencia?: number;
  totalProgramming?: number;
  totalCollected?: number;
  annProgrammingPac?: IPacAnnualization;
  annCollectyerPac?: IPacAnnualization;
  dataCondensed?: ISearchGeneralPac;

}

export interface IResultEditPac {

  toUpdateProgramming : IEditPac;
  toUpdateCollected : IEditPac;

}

export interface IViewPacComplete {

  managementCenter: string;
  fundNumber: string;
  posPreSapiNumber: string;
  projectCode: string;
  projectName: string;
  functionalAreaNumber: string;
  totalProgrammingAnnual: number;
  totalCollectedAnnual: number;
  percentExecuteAnnual: number;
  forCollected: number;
  Jan : {
    totalProgrammingJan: number;
    totalCollectedJan: number;
    executeJan: number;
    diferenceJan: number;
  },
  Feb : {
    totalProgrammingFeb: number;
    totalCollectedFeb: number;
    executeFeb: number;
    diferenceFeb: number;
  },
  Mar : {
    totalProgrammingMar: number;
    totalCollectedMar: number;
    executeMar: number;
    diferenceMar: number;
  },
  Abr : {
    totalProgrammingAbr: number;
    totalCollectedAbr: number;
    executeAbr: number;
    diferenceAbr: number;
  },
  May : {
    totalProgrammingMay: number;
    totalCollectedMay: number;
    executeMay: number;
    diferenceMay: number;
  },
  Jun : {
    totalProgrammingJun: number;
    totalCollectedJun: number;
    executeJun: number;
    diferenceJun: number;
  },
  Jul : {
    totalProgrammingJul: number;
    totalCollectedJul: number;
    executeJul: number;
    diferenceJul: number;
  },
  Ago : {
    totalProgrammingAgo: number;
    totalCollectedAgo: number;
    executeAgo: number;
    diferenceAgo: number;
  },
  Sep : {
    totalProgrammingSep: number;
    totalCollectedSep: number;
    executeSep: number;
    diferenceSep: number;
  },
  Oct : {
    totalProgrammingOct: number;
    totalCollectedOct: number;
    executeOct: number;
    diferenceOct: number;
  },
  Nov : {
    totalProgrammingNov: number;
    totalCollectedNov: number;
    executeNov: number;
    diferenceNov: number;
  },
  Dec : {
    totalProgrammingDec: number;
    totalCollectedDec: number;
    executeDec: number;
    diferenceDec: number;
  }

}



