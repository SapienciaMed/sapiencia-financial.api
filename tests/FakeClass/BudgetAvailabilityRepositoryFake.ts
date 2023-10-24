import { IBudgetAvailabilityFilters, IBudgetAvailability } from 'App/Interfaces/BudgetAvailabilityInterfaces';
import { IBudgetAvailabilityRepository } from 'App/Repositories/BudgetAvailabilityRepository';
import { IPagingData } from 'App/Utils/ApiResponses';



export class BudgetAvailabilityRepositoryFake implements IBudgetAvailabilityRepository {
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
