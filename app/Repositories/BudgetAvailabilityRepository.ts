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

    if (filter.pospreId) {
      query.whereHas("amounts", (sub) =>
        sub.whereHas("budgetRoute", (sub2) =>
          sub2.where("idPospreSapiencia", Number(filter.pospreId))
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
