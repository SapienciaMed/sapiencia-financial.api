import { IBudgets, IFilterBudgets} from "App/Interfaces/BudgetsInterfaces";
import Budgets from "../Models/Budgets";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

export interface IBudgetsRepository {
  updateBudgets(budgets: IBudgets, id: number): Promise<IBudgets | null>;
  getBudgetsById(id: number): Promise<IBudgets | null>;
  getBudgetsPaginated(filters: IFilterBudgets): Promise<IPagingData<IBudgets>>;
  createBudgets(role: IBudgets): Promise<IBudgets>;
}

export default class BudgetsRepository implements IBudgetsRepository {
  constructor() {}

  async getBudgetsById(id: number): Promise<IBudgets | null> {
    const res = await Budgets.find(id);
    return res ? (res.serialize() as IBudgets) : null;
  }
  
  async getBudgetsPaginated(filters: IFilterBudgets): Promise<IPagingData<IBudgets>> {
    const query = Budgets.query();

    if (filters.entity) {
      query.where("entityId", filters.entity);
    }

    if (filters.ejercise) {
      query.where("ejercise", filters.ejercise);
    }

    if (filters.denomination) {
      query.where("denomination", filters.denomination);
    }
    
    if (filters.number) {
      query.where("number", filters.number);
    }

    await query.preload("entity");

    const res = await query.paginate(filters.page, filters.perPage);

    const { data, meta } = res.serialize();

    return {
      array: data as IBudgets[],
      meta,
    };
  }

  async createBudgets(budgets: IBudgets): Promise<IBudgets> {
    const toCreateIBudgets = new Budgets();
    toCreateIBudgets.fill({ ...budgets });
    await toCreateIBudgets.save();

    return toCreateIBudgets.serialize() as IBudgets;
  }

  async updateBudgets(budgets: IBudgets, id: number): Promise<IBudgets | null> {
    const toUpdate = await Budgets.find(id);
    if (!toUpdate) {
      return null;
    }

    toUpdate.entityId = budgets.entityId;
    toUpdate.number = budgets.number;
    toUpdate.denomination = budgets.denomination;
    toUpdate.description = budgets.description;
    toUpdate.ejercise = budgets.ejercise;
    toUpdate.dateModify = DateTime.local().toJSDate();
    if(budgets.userModify) {
      toUpdate.userModify = budgets.userModify;
    }
    
    await toUpdate.save();
    return toUpdate.serialize() as IBudgets;
  }
}
