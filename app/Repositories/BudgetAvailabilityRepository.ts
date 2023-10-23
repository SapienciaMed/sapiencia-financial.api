import {
  IBudgetAvailability,
  IBudgetAvailabilityFilters,
} from "App/Interfaces/BudgetAvailabilityInterfaces";
import BudgetAvailability from "../Models/BudgetAvailability";
import { IPagingData } from "App/Utils/ApiResponses";
import { ICreateCdp } from "App/Interfaces/BudgetAvailabilityInterfaces";

export interface IBudgetAvailabilityRepository {
  searchBudgetAvailability(
    filter: IBudgetAvailabilityFilters
  ): Promise<IPagingData<IBudgetAvailability>>;
  createCdps(cdpDataTotal: ICreateCdp): Promise<any>;
}

export default class BudgetAvailabilityRepository
  implements IBudgetAvailabilityRepository
{
  async searchBudgetAvailability(
    filter: IBudgetAvailabilityFilters
  ): Promise<IPagingData<IBudgetAvailability>> {
    const query = BudgetAvailability.query().preload("amounts", (subq) => {
      subq.preload("budgetRoute", (subq2) => {
        subq2.preload("budget");
        subq2.preload("pospreSapiencia");
        subq2.preload("funds");
        subq2.preload("projectVinculation");
      });
    });

    if (filter.initialDate && filter.endDate) {
      query.where("date", ">=", filter.initialDate);
      query.where("date", "<=", filter.endDate);
    }

    if (filter.consecutiveSap) {
      query.where("sapConsecutive", filter.consecutiveSap);
    }

    if (filter.contractObject) {
      query.whereILike("contractObject", `%${filter.contractObject}%`);
    }

    if (filter.pospreId) {
      query.whereHas("amounts", (sub) =>
        sub.whereHas("budgetRoute", (sub2) =>
          sub2.where("idPospreSapiencia", Number(filter.pospreId))
        )
      );
    }

    if (filter.fundId) {
      query.whereHas("amounts", (sub) =>
        sub.whereHas("budgetRoute", (sub2) =>
          sub2.where("idFund", Number(filter.fundId))
        )
      );
    }

    if (filter.projectId) {
      query.whereHas("amounts", (sub) =>
        sub.whereHas("budgetRoute", (sub2) =>
          sub2.where("idProjectVinculation", Number(filter.projectId))
        )
      );
    }

    const res = await query.paginate(filter.page, filter.perPage);

    const { meta, data } = res.serialize();

    const filteredData = data.filter((item) => {
      const yearOfDate = item.date.substring(0, 4);
      return yearOfDate === filter.dateOfCdp;
    });
    if (filteredData.length === 0) {
      meta.total = 0;
    }

    return {
      meta,
      array: filteredData as IBudgetAvailability[],
    };
  }

  async filterCdpsByDateAndContractObject(
    date: string,
    contractObject: string
  ): Promise<any[]> {
    const results = await BudgetAvailability.query()
      .where("CDP_FECHA", new Date(date).toISOString().split("T")[0])
      .where("CDP_OBJETO_CONTRACTUAL", "LIKE", `%${contractObject}%`)
      .preload("amounts");

    const cdps = results.map((result) => result.toJSON());
    return cdps;
  }

  async deleteCdpById(cdpId: number): Promise<void> {
    const cdp = await BudgetAvailability.find(cdpId);
    if (!cdp) {
      throw new Error("El registro no existe");
    }
    await cdp.delete();
  }

  async createCdps(cdpDataTotal: any) {
    const { date, contractObject, consecutive, sapConsecutive, icdArr } =
      cdpDataTotal;

    const existingCdps = await this.filterCdpsByDateAndContractObject(
      date,
      contractObject
    );
    let alert = "";

    if (existingCdps.length > 0) {
      alert = `Ya existe un CDP registrado para el objeto contractual ${contractObject} y la fecha ${date}`;
      throw new Error(alert);
    }

    const cdp = new BudgetAvailability();
    cdp.date = date;
    cdp.contractObject = contractObject;
    cdp.consecutive = consecutive;
    cdp.sapConsecutive = sapConsecutive;
    await cdp.save();
    await cdp.related("amounts").createMany(icdArr);
  }
}
