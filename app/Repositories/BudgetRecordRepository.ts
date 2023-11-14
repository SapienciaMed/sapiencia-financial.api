import { IBudgetRecord, IBudgetRecordFilter, ILinkRPCDP, ITotalImports } from "App/Interfaces/BudgetRecord";
import BudgetRecord from "App/Models/BudgetRecord";
import Component from "App/Models/Component";
import LinkRpcdp from "App/Models/LinkRpcdp";

export interface IBudgetRecordRepository {
    createCdps(budgetRecord: IBudgetRecord): Promise<BudgetRecord>
    updateDataBasicRp(budgetRecord: IBudgetRecord): Promise<BudgetRecord | null>
    getComponents(): Promise<Component[]>
    getRpByFilters(budgetRecordFilter: IBudgetRecordFilter): Promise<any>
    getTotalValuesImports(id: number): Promise<LinkRpcdp | null>;
    getRpById(id: number): Promise<IBudgetRecord | null>;
    updateRp(id: number, budgetRecordDataBasic: ILinkRPCDP): Promise<ILinkRPCDP | null>
    getCausation(id: number): Promise<any | null>;
}
export default class BudgetRecordRepository implements IBudgetRecordRepository {
    getRpById(_id: number): Promise<IBudgetRecord | null> {
        throw new Error("Method not implemented.");
    }

    updateDataBasicRp = async (budgetRecord: IBudgetRecord): Promise<BudgetRecord | null> => {
        const toUpdate = await BudgetRecord.find(budgetRecord.id);
        if (!toUpdate) {
            return null;
        }

        toUpdate.documentDate = new Date(budgetRecord.documentDate);
        toUpdate.dateValidity = new Date(budgetRecord.dateValidity);
         toUpdate.dependencyId = budgetRecord.dependencyId;
        toUpdate.contractualObject = budgetRecord.contractualObject;
        toUpdate.componentId = budgetRecord.componentId;
        budgetRecord.consecutiveSap ? toUpdate.consecutiveSap = budgetRecord.consecutiveSap : '';
        budgetRecord?.contractNumber ? toUpdate.contractNumber = budgetRecord?.contractNumber : '';
        budgetRecord.responsibleDocument ? toUpdate.responsibleDocument = budgetRecord.responsibleDocument : '';
        budgetRecord.supervisorDocument ? toUpdate.supervisorDocument = budgetRecord.supervisorDocument : '';

        const res = await toUpdate.save();
        return res;
    }

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
            .if(budgetRecordFilter.consecutiveRpSap, (query) => {
                query.where('consecutiveSap', '=', budgetRecordFilter.consecutiveRpSap!)
            })
            .if(budgetRecordFilter.consecutiveRpAurora, (query) => {
                query.where('id', budgetRecordFilter.consecutiveRpAurora!)
            })
            .if(budgetRecordFilter.contractorDocument, (query) => {
                query.where('contractorDocument', budgetRecordFilter.contractorDocument!)
            })
            .if(budgetRecordFilter.supplierType, (query) => {
                query.where('supplierType', budgetRecordFilter.supplierType!)
            })
            .if(budgetRecordFilter.taxAccreditedId, (query) => {
                query.whereHas('creditor', (query) => {
                    query.where('taxIdentification', '=', budgetRecordFilter.taxAccreditedId!)
                })
            })
            .if(budgetRecordFilter.name, (query) => {
                query.whereHas('creditor', (query) => {
                    query.where('name', '=', budgetRecordFilter.name!)
                })
            })
            .preload('creditor')
            .preload('linksRp', (query) => {
                query.where('isActive', true)
                query.preload('amountBudgetAvailability', (query) => {
                    query.preload('budgetRoute', (query) => {
                        query.preload('budget')
                        query.preload('funds')
                        query.preload('pospreSapiencia')
                        query.preload('projectVinculation', (query) => {
                            query.preload('functionalProject')
                        })
                    })
                })
            });
    }

    async getTotalValuesImports(id: number): Promise<any | 0> {

        const res = await LinkRpcdp.query()
            .where('VRP_CODICD_IMPORTES_CDP', id)
            .where('VRP_ACTIVO', 1)
            .sum('VRP_VALOR_INICIAL');

        const totalValue = res[0]?.$extras['sum(`VRP_VALOR_INICIAL`)'] || 0;

        const totalImport: ITotalImports = { totalImport: totalValue };

        return totalImport;
    }



    async updateRp(id: number, budgets: ILinkRPCDP): Promise<ILinkRPCDP | null> {
        const toUpdate = await LinkRpcdp.find(id);
        if (!toUpdate) {
            return null;
        }

        /* toUpdate.isActive = budgets.isActive!;
        toUpdate.reasonCancellation = budgets.reasonCancellation!;        */

        toUpdate.fill({ ...toUpdate, ...budgets });


        await toUpdate.save();
        return toUpdate.serialize() as IBudgetRecord;
    }

    /*   async getCausation(id: number): Promise<any | null> {
        const res = await LinkRpcdp.query()
        .where("id", id)    
        .preload('pagos')
        
        return res.length > 0 ? (res[0].serialize() as any) : null;    
      } */

      async getCausation(id: number): Promise<any | null> {
        const linkRpcdpInstances = await LinkRpcdp.query()
            .where("id", id)
            .preload('pagos');
    
        if (linkRpcdpInstances.length > 0) {
            const linkRpcdp = linkRpcdpInstances[0];
            await linkRpcdp.preload('pagos');
    
            let totalValorPagado = 0;
            let totalValorCausado = 0;
    
            for (const pago of linkRpcdp.pagos) {
                totalValorPagado += Number(pago.valorPagado) || 0;
                totalValorCausado += Number(pago.valorCausado) || 0;
            }
    
            const serializedData = linkRpcdp.serialize() as any;
            serializedData.totalValorPagado = totalValorPagado;
            serializedData.totalValorCausado = totalValorCausado;
            serializedData.total = totalValorCausado + totalValorPagado;
    
            return serializedData;
        }
    
        return null;
    }
    
    
    
    
    
}