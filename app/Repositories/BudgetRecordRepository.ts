import { IBudgetRecord, ILinkRPCDP,ITotalImports } from "App/Interfaces/BudgetRecord";
import BudgetRecord from "App/Models/BudgetRecord";
import Component from "App/Models/Component";
import LinkRpcdp from "App/Models/LinkRpcdp";

export interface IBudgetRecordRepository {
    createCdps(budgetRecord: IBudgetRecord): Promise<BudgetRecord>
    getComponents(): Promise<Component[]>
    getTotalValuesImports(id: number): Promise<LinkRpcdp | null>;
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


    getComponents = async(): Promise<Component[]>=> {
        return await Component.all();
    }

    async  getTotalValuesImports(id: number): Promise<any | 0> {
      
        const res = await LinkRpcdp.query()
        .where('VRP_CODICD_IMPORTES_CDP', id)
        .where('VRP_ACTIVO', 1)        
        .sum('VRP_VALOR_INICIAL');  

        const totalValue = res[0]?.$extras['sum(`VRP_VALOR_INICIAL`)'] || 0;         
       
        const totalImport: ITotalImports = { totalImport: totalValue };
    
        return totalImport;
    }
}