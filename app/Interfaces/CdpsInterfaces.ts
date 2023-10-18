import { DateTime } from 'luxon';


export interface ICertificateBudgetAvailability {
    id?: number;
    contractObject: string;
    consecutive: number;
    date: DateTime;
}

export interface IIcdAmountsCdp {
    id?: number;
    cdpCode: number;
    idRppCode: number;
    cdpPosition: number;
    amount: number;
    certificateBudgetAvailability: number;
    budgetRoute: number;
}