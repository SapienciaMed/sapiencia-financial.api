import {
  IBudgetAvailability,
  IBudgetAvailabilityFilters,
} from "App/Interfaces/BudgetAvailabilityInterfaces";
import BudgetAvailability from "../Models/BudgetAvailability";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IBudgetAvailabilityRepository {
  searchBudgetAvailability(
    filter: IBudgetAvailabilityFilters
  ): Promise<IPagingData<IBudgetAvailability>>;
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

    return {
      meta,
      array: data as IBudgetAvailability[],
    };
  }
}
