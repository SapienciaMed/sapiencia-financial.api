import BudgetRecord from "App/Models/BudgetRecord";

export interface IBudgetRecordRepository {
    createCdps(): Promise<BudgetRecord>
}

export default class BudgetRecordRepository implements IBudgetRecordRepository {
    createCdps(): Promise<BudgetRecord> {
        throw new Error("Method not implemented.");
    }


}