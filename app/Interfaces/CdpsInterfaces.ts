import { IBudgetsRoutes } from "./BudgetsRoutesInterfaces";

export interface ICdps {
    dateOfCdp: string;
    initialDate?: string;
    endDate?: string;
    pospre?: number;
    fund?: number;
    project?: number;
}

export interface IIcdAmount {
    id: number;
    cdpCode: number;
    idRppCode: number;
    cdpPosition: number;
    amount: string;
    budgetRoute: IBudgetsRoutes;
}

export interface ICdpData {
    id: number;
    date: string;
    contractObject: string;
    consecutive: number;
    icdAmounts: IIcdAmount[];
}

export interface IMeta {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    first_page: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    previous_page_url: string | null;
}

export interface Operation {
    code: string;
}

export interface IGetAllCdps {
    data: {
        meta: IMeta;
        data: ICdpData[];
    };
    operation?: Operation;
}