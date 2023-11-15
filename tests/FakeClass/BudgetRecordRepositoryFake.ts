import { IBudgetRecord, IBudgetRecordFilter, ILinkRPCDP } from "App/Interfaces/BudgetRecord";
import ActivityObjectContract from "App/Models/ActivityObjectContract";
import BudgetRecord from "App/Models/BudgetRecord";
import Component from "App/Models/Component";
import LinkRpcdp from "App/Models/LinkRpcdp";
import { IBudgetRecordRepository } from "App/Repositories/BudgetRecordRepository";

interface IActivityObjectContract{
    id: number;
    description: string;
    isActive: boolean;
}

const activityObjectContractFake: IActivityObjectContract = {
    id:1,
    description:'Descripcion de la activiad',
    isActive:true
  };


export class BudgetRecordRepositoryFake implements IBudgetRecordRepository {
    createCdps(_budgetRecord: IBudgetRecord): Promise<BudgetRecord> {
        throw new Error("Method not implemented.");
    }
    updateDataBasicRp(_budgetRecord: IBudgetRecord): Promise<BudgetRecord | null> {
        throw new Error("Method not implemented.");
    }
    getComponents(): Promise<Component[]> {
        throw new Error("Method not implemented.");
    }
    getRpByFilters(_budgetRecordFilter: IBudgetRecordFilter): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getTotalValuesImports(_id: number): Promise<LinkRpcdp | null> {
        throw new Error("Method not implemented.");
    }
    getRpById(_id: number): Promise<IBudgetRecord | null> {
        throw new Error("Method not implemented.");
    }
    updateRp(_id: number, _budgetRecordDataBasic: ILinkRPCDP): Promise<ILinkRPCDP | null> {
        throw new Error("Method not implemented.");
    }
    getAllActivityObjectContracts(): Promise<any> {
        const list = [activityObjectContractFake];
        return new Promise((res) => {
            res(list);
        });;
    }
    getCausation(_id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }




}