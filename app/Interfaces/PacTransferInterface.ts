export interface DataTransferPac {
  headTransfer:        HeadTransfer;
  transferTransaction: TransferTransaction;
}

export interface HeadTransfer {
  pacType:      string;
  exercise:     number;
  resourceType: string;
}

export interface TransferTransaction {
  origins:     IDestinity[];
  destinities: IDestinity[];
}

export interface IDestinity {
  managementCenter:     string;
  idProjectVinculation: number;
  idBudget:             number;
  idPospreSapiencia:    number;
  idFund:               number;
  idCardTemplate:       string;
  annualRoute:          IAnnualRoute[];
}

export interface IAnnualRoute {
  id:         number;
  pacId:      number;
  type:       string;
  jan:        number;
  feb:        number;
  mar:        number;
  abr:        number;
  may:        number;
  jun:        number;
  jul:        number;
  ago:        number;
  sep:        number;
  oct:        number;
  nov:        number;
  dec:        number;
  dateModify: null;
  dateCreate: null;
}
