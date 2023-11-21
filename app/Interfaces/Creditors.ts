import { DateTime } from "luxon";

export interface ICreditor {
    id?: number;
    typeDocument?: string;
    document?: string;
    taxIdentification?: string;
    name?: string;
    city?: string;
    address?: string;
    phone?: number;
    email?: string;
    userModify?: string;
    userCreate?: string;
    dateCreate?: DateTime;
    dateModify?: DateTime;

}


export interface ICreditorsFilter {
    id?: number;
    typeDocument?:'',
    document?:'',
    taxIdentification?:'',
    name?:'',
    page: number;
    perPage: number;
}