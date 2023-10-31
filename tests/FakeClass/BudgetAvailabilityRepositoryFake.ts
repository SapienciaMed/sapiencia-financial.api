import {
  IBudgetAvailabilityFilters,
  IBudgetAvailability,
  IUpdateBasicDataCdp,
  IUpdateRoutesCDP,
} from "App/Interfaces/BudgetAvailabilityInterfaces";
import BudgetAvailability from "App/Models/BudgetAvailability";
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
  getRouteCDPId(_id: number): Promise<IUpdateRoutesCDP | null> {
    throw new Error("Method not implemented.");
  }
  updateRoutesCDP(_updateRoutesCDP: IUpdateRoutesCDP, _id: number): Promise<IUpdateRoutesCDP | null> {
    throw new Error("Method not implemented.");
  }
  associateAmountsWithCdp(_cdpId: number, _amounts: any[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
  linkMga(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async editBudgetAvailabilityBasicDataCDP(updatedData: IUpdateBasicDataCdp) {
    const updatedDataNew: any = {
      id: 1,
      date: "2023-10-18T05:00:00.000Z",
      contractObject: "Este es el objeto vamos a actualizar",
      consecutive: 1,
      sapConsecutive: 1,
    };

    if (updatedData.date) {
      updatedDataNew.date = updatedData.date;
    }
    if (updatedData.contractObject) {
      updatedDataNew.contractObject = updatedData.contractObject;
    }

    return updatedDataNew;
  }

  cancelAmountCdp(
    _id: number,
    _reasonCancellation: string
  ): Promise<BudgetAvailability> {
    throw new Error("Method not implemented.");
  }

  getById(_id: string): Promise<BudgetAvailability> {
    let oneRegister = new Array<BudgetAvailability>();
    oneRegister.push(new BudgetAvailability());
    return new Promise((res) => {
      res(oneRegister[0]);
    });
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
