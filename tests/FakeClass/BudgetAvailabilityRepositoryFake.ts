import {
  IBudgetAvailabilityFilters,
  IBudgetAvailability,
} from "App/Interfaces/BudgetAvailabilityInterfaces";
import { IBudgetAvailabilityRepository } from "App/Repositories/BudgetAvailabilityRepository";
import { IPagingData } from "App/Utils/ApiResponses";

const filter: IBudgetAvailability = {
  date: "2022",
  consecutive: 12345,
  contractObject: "example",
  id: 0,
  sapConsecutive: 12345,
  icdAmounts: [],
};

export class BudgetAvailabilityRepositoryFake
  implements IBudgetAvailabilityRepository
{
  async updateBasicDataCdp(updatedData: any) {
    throw new Error(updatedData + "Method not implemented.");
  }
  searchBudgetAvailability(
    _filter: IBudgetAvailabilityFilters
  ): Promise<IPagingData<IBudgetAvailability>> {
    return Promise.resolve({
      array: [filter],
      meta: { total: 1 },
    });
  }
  async getAllCdps(): Promise<any[]> {
    return Promise.resolve([]);
  }

  async createCdps(cdpDataTotal: any): Promise<any> {
    return Promise.resolve({
      message: "Información guardada correctamente",
      cdp: { id: 1, ...cdpDataTotal },
      icd: [
        { id: 1, ...cdpDataTotal.icdArr[0] },
        { id: 2, ...cdpDataTotal.icdArr[1] },
      ],
    });
  }

  async filterCdpsByDateAndContractObject(
    _date: string,
    _contractObject: string
  ): Promise<any[]> {
    return Promise.resolve([]);
  }

  async deleteCdpById(_cdpId: number): Promise<void> {
    return Promise.resolve();
  }
}
