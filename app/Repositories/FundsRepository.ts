import { IFunds, IFundsFilters } from "App/Interfaces/FundsInterfaces";
import Funds from "../Models/Funds";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";
import {
  IProjectAdditionFilters,
  IFundsAdditionList,
} from "../Interfaces/AdditionsInterfaces";

export interface IFundsRepository {
  getFundsById(id: number): Promise<IFunds | null>;
  getFundsPaginated(filters: IFundsFilters): Promise<IPagingData<IFunds>>;
  createFund(fund: IFunds): Promise<IFunds>;
  updateFund(fund: IFunds, id: number): Promise<IFunds | null>;
  getAllFunds(): Promise<IFunds[]>;
  getFundsList(filters: IProjectAdditionFilters): Promise<IPagingData<IFundsAdditionList>>;
  getFundsByNumber(number: string): Promise<IPagingData<IFundsAdditionList | null>>;
}

export default class FundsRepository implements IFundsRepository {
  constructor() {}

  async getFundsById(id: number): Promise<IFunds | null> {
    const res = await Funds.find(id);
    await res?.load("entity");
    return res ? (res.serialize() as IFunds) : null;
  }

  async getFundsPaginated(
    filters: IFundsFilters
  ): Promise<IPagingData<IFunds>> {
    const query = Funds.query();
    query.orderBy("dateFrom", "desc");

    if (filters.number) {
      query.where("number", filters.number);
    }

    if (filters.entity) {
      query.where("entityId", filters.entity);
    }

    if (filters.dateFrom) {
      query.where("dateFrom", ">=", filters.dateFrom.toLocaleString());
    }

    if (filters.dateTo) {
      query.where("dateTo", "<=", filters.dateTo.toLocaleString());
    }

    await query.preload("entity");

    const res = await query.paginate(filters.page, filters.perPage);

    const { data, meta } = res.serialize();

    return {
      array: data as IFunds[],
      meta,
    };
  }

  async createFund(fund: IFunds): Promise<IFunds> {
    const toCreateFund = new Funds();
    toCreateFund.fill({
      ...fund,
      dateTo: new Date(fund.dateTo.toJSDate()),
      dateFrom: new Date(fund.dateFrom.toJSDate()),
    });
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
    toUpdate.dateFrom = new Date(fund.dateFrom.toJSDate());
    toUpdate.dateTo = new Date(fund.dateTo.toJSDate());
    toUpdate.dateModify = DateTime.local().toJSDate();
    if (fund.userModify) {
      toUpdate.userModify = fund.userModify;
    }

    await toUpdate.save();
    return toUpdate.serialize() as IFunds;
  }

  async getAllFunds(): Promise<IFunds[]> {
    const res = await Funds.query();
    return res as unknown as IFunds[];
  }

  async getFundsList(
    filters: IProjectAdditionFilters
  ): Promise<IPagingData<IFundsAdditionList>> {
    let { page, perPage } = filters;

    const res = Funds.query();

    res.preload("entity");

    page = 1;
    perPage = (await res).length;

    const fundsPaginated = await res.paginate(page, perPage);

    const { data, meta } = fundsPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IFundsAdditionList[],
      meta,
    };
  }

  async getFundsByNumber(number: string): Promise<IPagingData<IFundsAdditionList | null>> {
    const res = Funds.query();
    res.where("number", number);
    await res.preload("entity");

    const page = 1;
    const perPage = 1;

    const fundsPaginated = await res.paginate(page, perPage);

    const { data, meta } = fundsPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IFundsAdditionList[],
      meta,
    };
  }
}
