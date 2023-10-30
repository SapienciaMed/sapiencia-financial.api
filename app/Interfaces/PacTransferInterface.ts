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

export interface IDestinityNoAnnual {
  idProjectVinculation: number;
  idBudget:             number;
  idPospreSapiencia:    number;
  idFund:               number;
  idCardTemplate:       string;
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

export interface IStructureResponseTransferGlobalOriginals {

  originalTotalProgramming?: number;
  originalIdProgrammingByAnn?: number;
  originalPacProgrammingByAnn?: number;
  originalTotalCollected?: number;
  originalIdCollectedByAnn?: number;
  originalPacCollectedByAnn?: number;
  originalBalanceRoute?: number;
  originalCardFront?: string;

  transferTotalProgramming?: number;
  transferIdProgrammingByAnn?: number;
  transferPacProgrammingByAnn?: number;
  transferTotalCollected?: number;
  transferIdCollectedByAnn?: number;
  transferPacCollectedByAnn?: number;

  originalSourceType?: string;
  originalBudgetRouteId?: number;
  originalVersion?: number;
  originalExercise?: number;

}

export interface IStructureResponseTransferGenericOriginis {

  originsRoutesWithAllInfoOriginal: IStructureResponseTransferGlobalOriginals[];
  originsRoutesWithAllInfoTransfer: IStructureResponseTransferGlobalOriginals[];

}

export interface IStructureResponseTransferGlobalDestinities {

  destinitiesTotalProgramming?: number;
  destinitiesIdProgrammingByAnn?: number;
  destinitiesPacProgrammingByAnn?: number;
  destinitiesTotalCollected?: number;
  destinitiesIdCollectedByAnn?: number;
  destinitiesPacCollectedByAnn?: number;
  destinitiesBalanceRoute?: number;
  destinityCardFront?: string;

  transferTotalProgramming?: number;
  transferIdProgrammingByAnn?: number;
  transferPacProgrammingByAnn?: number;
  transferTotalCollected?: number;
  transferIdCollectedByAnn?: number;
  transferPacCollectedByAnn?: number;

  destinitiesSourceType?: string;
  destinitiesBudgetRouteId?: number;
  destinitiesVersion?: number;
  destinitiesExercise?: number;

}

export interface IStructureResponseTransferGenericDestinities {

  destinitiesRoutesWithAllInfoOriginal: IStructureResponseTransferGlobalDestinities[];
  destinitiesRoutesWithAllInfoTransfer: IStructureResponseTransferGlobalDestinities[];

}

export interface IPartialObjectResultTransferGeneric {

  getDataProccessOrigins: IStructureResponseTransferGenericOriginis | null;
  getDataProccessDestinities: IStructureResponseTransferGenericDestinities | null;
  resultUpdate?: {
    updateOrigins: IDestinity[] | boolean,
    updateDestinities: IDestinity[] | boolean
  }

}
