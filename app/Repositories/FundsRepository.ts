import { IFunds, IFundsFilters } from "App/Interfaces/FundsInterfaces";
import Funds from "../Models/Funds";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

export interface IFundsRepository {
  getFundsById(id: number): Promise<IFunds | null>;
  getFundsPaginated(filters: IFundsFilters): Promise<IPagingData<IFunds>>;
  createFund(fund: IFunds): Promise<IFunds>;
  updateFund(fund: IFunds, id: number): Promise<IFunds | null>;
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

    if (filters.dateFrom) {
      query.where("dateFrom", ">=" , filters.dateFrom.toLocaleString());
    }
    
    if (filters.dateTo) {
      query.where("dateTo", "<=", filters.dateTo.toLocaleString());
    }

    await query.preload('entity');

    const res = await query.paginate(filters.page, filters.perPage);

    const { data, meta } = res.serialize();

    return {
      array: data as IFunds[],
      meta,
    };
  }

  async createFund(fund: IFunds): Promise<IFunds> {
    const toCreateFund = new Funds();
    toCreateFund.fill({ ...fund });
    await toCreateFund.save();

    return toCreateFund.serialize() as IFunds;
  }

  async updateFund(fund: IFunds, id: number): Promise<IFunds | null> {
    const toUpdate = await Funds.find(id);
    if (!toUpdate) {
      return null;
    }

    toUpdate.entityId = fund.entityId;
    toUpdate.number = fund.number;
    toUpdate.denomination = fund.denomination;
    toUpdate.description = fund.description;
    toUpdate.dateFrom = fund.dateFrom;
    toUpdate.dateTo = fund.dateTo;
    toUpdate.dateModify = DateTime.local().toJSDate();
    if(fund.userModify) {
      toUpdate.userModify = fund.userModify;
    }
    
    await toUpdate.save();
    return toUpdate.serialize() as IFunds;
  }
}
