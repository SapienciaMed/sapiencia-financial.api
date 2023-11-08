import { IBudgetRecord, IBudgetRecordFilter, ILinkRPCDP } from "App/Interfaces/BudgetRecord";
import BudgetRecord from "App/Models/BudgetRecord";
import Component from "App/Models/Component";

export interface IBudgetRecordRepository {
    createCdps(budgetRecord: IBudgetRecord): Promise<BudgetRecord>
    getComponents(): Promise<Component[]>
    getRpByFilters(budgetRecordFilter: IBudgetRecordFilter): Promise<any>
}
export default class BudgetRecordRepository implements IBudgetRecordRepository {
    createCdps = async (budgetRecord: IBudgetRecord): Promise<BudgetRecord> => {
        let linkRpData: ILinkRPCDP[] = [];
        budgetRecord?.linksRp!.length > 0 && linkRpData.push(...budgetRecord.linksRp!)
        const toCreateBudgetRecord = new BudgetRecord();

        toCreateBudgetRecord.fill(
            {
                supplierType: budgetRecord.supplierType,
                supplierId: budgetRecord.supplierId,
                contractorDocument: budgetRecord.contractorDocument,
                documentDate: new Date(budgetRecord.documentDate),
                dateValidity: new Date(budgetRecord.dateValidity),
                dependencyId: budgetRecord.dependencyId,
                contractualObject: budgetRecord.contractualObject,
                componentId: budgetRecord.componentId,
                userCreate: budgetRecord.userCreate,
                userModify: budgetRecord.userModify,
                dateModify: budgetRecord.dateModify
            }
        );
        let BudgetRecordCreated = await toCreateBudgetRecord.save();
        await BudgetRecordCreated
            .related('linksRp')
            .createMany(linkRpData)
        return BudgetRecordCreated;
    }

    getComponents = async (): Promise<Component[]> => {
        return await Component.query();
    }

    getRpByFilters = async (budgetRecordFilter: IBudgetRecordFilter): Promise<any> => {
        return await BudgetRecord.query()
            /* .if(budgetRecordFilter.consecutiveRpSap,()=>{
                Query.where()
            })
            .if(budgetRecordFilter.consecutiveRpAurora,()=>{
                Query.where()
            })*/
            .if(budgetRecordFilter.contractorDocument, (query) => {
                query.where('contractorDocument', budgetRecordFilter.contractorDocument!)
            })
            .if(budgetRecordFilter.supplierType, (query) => {
                query.where('supplierType', budgetRecordFilter.supplierType!)
            })
            /*.if(budgetRecordFilter.taxAccreditedId,()=>{
                Query.where()
            })
            .if(budgetRecordFilter.name,()=>{
                Query.where()
            }) */
            .preload('creditor')
            .preload('linksRp', (query) => {
                query.preload('amountBudgetAvailability')
            });
    }

}