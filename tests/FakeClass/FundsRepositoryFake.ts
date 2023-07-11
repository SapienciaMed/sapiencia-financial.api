import { IFunds, IFundsFilters } from "App/Interfaces/FundsInterfaces";
import { IFundsRepository } from "App/Repositories/FundsRepository";
import { IPagingData } from "App/Utils/ApiResponses";

export class FundsRepositoryFake implements IFundsRepository {
  getFundsPaginated(_filters: IFundsFilters): Promise<IPagingData<IFunds>> {
    return new Promise((res) => {
      res({} as IPagingData<IFunds>);
    });
  }

  createFund(_fund: IFunds): Promise<IFunds> {
    return new Promise((res) => {
      res({} as IFunds);
    });
  }

  updateFund(_fund: IFunds, _id: number): Promise<IFunds | null> {
    return new Promise((res) => {
      res(null);
    });
  }
  getFundsById(_id: number): Promise<IFunds | null> {
    return new Promise((res) => {
      res(null);
    });
  }
}
