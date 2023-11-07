
export interface IPacReport {

  resourceType: string;
  managementCenter: string;
  posPreSapi: string;
  fundSapi: string;
  functionalArea: string;
  projectCode: string;
  projectName: string;
  budgetSapi: number;
  programmingJan: number;
  collectedJan: number;
  executeJan: number;
  diferenceJan: number;
  programmingFeb: number;
  collectedFeb: number;
  executeFeb: number;
  diferenceFeb: number;
  programmingMar: number;
  collectedMar: number;
  executeMar: number;
  diferenceMar: number;
  programmingApr: number;
  collectedApr: number;
  executeApr: number;
  diferenceApr: number;
  programmingMay: number;
  collectedMay: number;
  executeMay: number;
  diferenceMay: number;
  programmingJun: number;
  collectedJun: number;
  executeJun: number;
  diferenceJun: number;
  programmingJul: number;
  collectedJul: number;
  executeJul: number;
  diferenceJul: number;
  programmingAug: number;
  collectedAug: number;
  executeAug: number;
  diferenceAug: number;
  programmingSep: number;
  collectedSep: number;
  executeSep: number;
  diferenceSep: number;
  programmingOct: number;
  collectedOct: number;
  executeOct: number;
  diferenceOct: number;
  programmingNov: number;
  collectedNov: number;
  executeNov: number;
  diferenceNov: number;
  programmingDec: number;
  collectedDec: number;
  executeDec: number;
  diferenceDec: number;
  collected: number;
  forCollected: number;
  percentExecute: number;

}

export interface IDataBasicProject {

  projectCode: string;
  projectName: string;
  functionalArea: string;

}
