import { IBudgets, IFilterBudgets } from "App/Interfaces/BudgetsInterfaces";
import Budgets from "../Models/Budgets";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";
import { IBudgetsRoutes } from "App/Interfaces/BudgetsRoutesInterfaces";
import BudgetsRoutes from "../Models/BudgetsRoutes";
import AmountBudgetAvailability from "App/Models/AmountBudgetAvailability";
import ProductClassification from "App/Models/ProductClassification";

export interface IBudgetsRepository {
  updateBudgets(budgets: IBudgets, id: number): Promise<IBudgets | null>;
  getBudgetsById(id: number): Promise<IBudgets | null>;
  getBudgetsPaginated(filters: IFilterBudgets): Promise<IPagingData<IBudgets>>;
  createBudgets(role: IBudgets): Promise<IBudgets>;
  getAllBudgets(): Promise<IBudgets[]>;
  getBudgetsByNumber(number: string): Promise<IPagingData<IBudgets>>;
  getBudgetForCdp(projectId: number, foundId: number, posPreId: number): Promise<IBudgetsRoutes | null>;
  getAllCpc(): Promise<any[]>;
}

export default class BudgetsRepository implements IBudgetsRepository {
  constructor() { }

  async getBudgetsById(id: number): Promise<IBudgets | null> {
    const res = await Budgets.find(id);
    return res ? (res.serialize() as IBudgets) : null;
  }

  async getBudgetForCdp(
    projectId: number,
    foundId: number,
    posPreId: number
  ): Promise<IBudgetsRoutes | null> {
    const budgetRoutes: IBudgetsRoutes[] = await BudgetsRoutes.query()
      .where("RPP_CODVPY_PROYECTO", projectId)
      .where("RPP_CODFND_FONDO", foundId)
      .where("RPP_CODPPS_POSPRE_SAPIENCIA", posPreId);

    if (budgetRoutes && budgetRoutes.length > 0) {
      const serializedBudgetRoutes = JSON.stringify(budgetRoutes);
      const objInfo = JSON.parse(serializedBudgetRoutes);
      const idRoute = objInfo[0].id;
      const sumValues = await AmountBudgetAvailability.query().where("ICD_CODRPP_RUTA_PRESUPUESTAL", idRoute).where("ICD_ACTIVO", 1 ).sum('IDC_VALOR_FINAL as sumatotal');
      let value = sumValues[0]['$extras']['sumatotal'] !== null ? parseFloat(sumValues[0]['$extras']['sumatotal']) : 0;
      const dataRoute = budgetRoutes[0]['$original'];

      const information = { 
        ...dataRoute,
        totalIdc: value
      };

      return information;
    } else {
      return null;
    }
  }
  async getBudgetsPaginated(filters: IFilterBudgets): Promise<IPagingData<IBudgets>> {
    const query = Budgets.query();

    query.preload("pospresap", (q) => {
      q.preload("budget")
    });

    query.preload("vinculationmga", (q) => {
      q.select("id",
        "activityId",
        "consecutiveActivityDetailed",
        "detailedActivityId",
        "userCreate",
        "dateCreate"
      )
    });

    query.orderBy("denomination", "asc");

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
      query.whereILike("number", `%${filters.number}%`);
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
    if (budgets.userModify) {
      toUpdate.userModify = budgets.userModify;
    }

    await toUpdate.save();
    return toUpdate.serialize() as IBudgets;
  }

  async getAllBudgets(): Promise<IBudgets[]> {
    const query = Budgets.query();
    query.preload("entity");
    query.preload("pospresap");
    query.preload("vinculationmga");
    query.preload("productClassifications");
    const res = await query;

    return res as IBudgets[];
  }
  
  async getBudgetsByNumber(number: string): Promise<IPagingData<IBudgets>> {

    const query = Budgets.query();
    query.where("number", number);

    await query.preload("entity");

    const page = 1;
    const perPage = 1;

    const res = await query.paginate(page, perPage);

    const { data, meta } = res.serialize();

    return {
      array: data as IBudgets[],
      meta,
    };
  }
  
  async getAllCpc(): Promise<IBudgets[]> {
    const query = ProductClassification.query();
   
    const res = await query;

    return res as any[];
  }
  

}
