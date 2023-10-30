import { IBudgetAvailabilityFilters, IBudgetAvailability } from 'App/Interfaces/BudgetAvailabilityInterfaces';
import BudgetAvailability from 'App/Models/BudgetAvailability';
import { IBudgetAvailabilityRepository } from 'App/Repositories/BudgetAvailabilityRepository';
import { IPagingData } from 'App/Utils/ApiResponses';



export class BudgetAvailabilityRepositoryFake implements IBudgetAvailabilityRepository {
    associateAmountsWithCdp(_cdpId: number, _amounts: any[]): Promise<void> {
        throw new Error('Method not implemented.');
    }
    cancelAmountCdp(_id: number, _reasonCancellation: string): Promise<BudgetAvailability> {
        throw new Error('Method not implemented.');
    }
    
    getById(_id: string): Promise<BudgetAvailability> {
        let oneRegister = new Array<BudgetAvailability>();
        oneRegister.push(new BudgetAvailability());
        return new Promise((res) => {
            res(oneRegister[0]);
        });
    }
    searchBudgetAvailability(_filter: IBudgetAvailabilityFilters): Promise<IPagingData<IBudgetAvailability>> {
        throw new Error('Method not implemented.');
    }
    async getAllCdps(): Promise<any[]> {
        return Promise.resolve([]);
    }

    async createCdps(cdpDataTotal: any): Promise<any> {
        return Promise.resolve({
            message: "Información guardada correctamente",
            cdp: { id: 1, ...cdpDataTotal },
            icd: [{ id: 1, ...cdpDataTotal.icdArr[0] }, { id: 2, ...cdpDataTotal.icdArr[1] }]
        });
    }

    async filterCdpsByDateAndContractObject(_date: string, _contractObject: string): Promise<any[]> {
        return Promise.resolve([]);
    }

    async deleteCdpById(_cdpId: number): Promise<void> {
        return Promise.resolve();
    }
}
