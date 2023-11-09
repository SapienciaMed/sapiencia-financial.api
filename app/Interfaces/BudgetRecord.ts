import { DateTime } from "luxon";

export interface IBudgetRecord {
    id?: number;
    supplierType: string;
    supplierId?: number;
    contractorDocument?: string;
    documentDate: any;
    dateValidity: any;
    dependencyId: number;
    contractualObject: string;
    componentId: number;
    consecutiveSap?: number;
    userCreate?: string;
    userModify?: string;
    dateCreate?: DateTime;
    dateModify?: string;
    linksRp?: ILinkRPCDP[]
}

export interface ILinkRPCDP {
    id?: number;
    rpId?: number;
    amountCdpId: number;
    initialAmount?: number;
    creditAmount?: number;
    againtsAmount?: number;
    fixedCompleted?: number;
    finalAmount?: number;
    isActive?: boolean;
    reasonCancellation?: string;
    position?: number;
}

export interface IBudgetRecordFilter {
    consecutiveRpSap?: number;
    consecutiveRpAurora?: number;
    taxAccreditedId?: number;
    supplierType?: string;
    contractorDocument?: string;
    name?: string;
}

export interface ITotalImports {
    totalImport: number;
}