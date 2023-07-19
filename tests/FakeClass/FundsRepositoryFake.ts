import { IFunds, IFundsFilters } from "App/Interfaces/FundsInterfaces";
import { IFundsRepository } from "App/Repositories/FundsRepository";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

const fundFake: IFunds = {
  id: 1,
  number: 12,
  entityId: 1,
  denomination: "Denominacion",
  description: "Descripcion",
  dateFrom: DateTime.now(),
  dateTo: DateTime.now()
};

export class FundsRepositoryFake implements IFundsRepository {

  getFundsById(_id: number): Promise<IFunds | null> {
    const list = [fundFake];

    return new Promise((res) => {
      res(list.find((i) => i.id == _id) || null);
    });
  }

  getFundsPaginated(_filters: IFundsFilters): Promise<IPagingData<IFunds>> {
    return new Promise((res) => {
      res({ array: [fundFake], meta: { total: 1 } });
    });
  }

  createFund(_fund: IFunds): Promise<IFunds> {
    return new Promise((res) => {
      res(fundFake);
    });
  }

  updateFund(_fund: IFunds, _id: number): Promise<IFunds | null> {
    const list = [fundFake];

    return new Promise((res) => {
      res(list.find((i) => i.id == _id) || null);
    });
  }
}
