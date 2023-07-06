import { IFunds, IFundsFilters } from "App/Interfaces/FundsInterfaces";
import Funds from "../Models/Funds";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IFundsRepository {
  getFundsById(id: number): Promise<IFunds | null>;
  getFundsPaginated(filters: IFundsFilters): Promise<IPagingData<IFunds>>;
}

export default class FundsRepository implements IFundsRepository {
  constructor() {}

  async getFundsById(id: number): Promise<IFunds | null> {
    const res = await Funds.find(id);
    await res?.load('entity');
    return res ? (res.serialize() as IFunds) : null;
  }

  async getFundsPaginated(filters: IFundsFilters): Promise<IPagingData<IFunds>> {
    const query = Funds.query();

    if (filters.number) {
      query.where("number", filters.number);
    }

    if (filters.entity) {
      query.where("entityId", filters.entity);
    }
    
    /*if (filters.dateFrom) {
      query.where("dateFrom", filters.dateFrom);
    }
    
    if (filters.dateTo) {
      query.where("dateTo", filters.entity);
    }*/

    const res = await query.paginate(filters.page, filters.perPage);

    const { data, meta } = res.serialize();

    return {
      array: data as IFunds[],
      meta,
    };
  }
}
