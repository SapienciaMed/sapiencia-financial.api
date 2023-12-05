import {
  IBudgetsRoutes,
  IBudgetsRoutesFilters,
} from "App/Interfaces/BudgetsRoutesInterfaces";
import BudgetsRoutes from "../Models/BudgetsRoutes";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";


export interface IBudgetsRoutesRepository {
  updateBudgetsRoutes(
    budgets: IBudgetsRoutes,
    id: number
  ): Promise<IBudgetsRoutes | null>;
  getBudgetsRoutesById(id: number): Promise<IBudgetsRoutes | null>;
  getBudgetsRoutesPaginated(
    filters: IBudgetsRoutesFilters
  ): Promise<IPagingData<IBudgetsRoutes>>;
  createBudgetsRoutes(budgets: IBudgetsRoutes): Promise<IBudgetsRoutes>;
  getBudgetsRoutesWithoutPagination(): Promise<IBudgetsRoutes[]>;

  getBudgetForAdditions(
    projectId: number,
    idProjectVinculation: number,
    posPreOriginId: number,
    posPreId: number
  ): Promise<IBudgetsRoutes | null>;
  getBudgetForCdp(
    projectId: number,
    foundId: number,
    posPreId: number
  ): Promise<IBudgetsRoutes | null>;
  getBudgetsSpcifyExerciseWithPosPreSapi(
    posPreSapi: number
  ): Promise<IBudgetsRoutes[] | null>;
  getFundsByProject(
    ids: number
  ): Promise<IBudgetsRoutes[] | null>;
  getPospreByProjectAndFund(
    projectId: number,
    fundId: number
  ): Promise<IBudgetsRoutes[] | null>;
}

export default class BudgetsRoutesRepository
  implements IBudgetsRoutesRepository
{
  constructor() {}
  async getBudgetsRoutesById(id: number): Promise<IBudgetsRoutes | null> {
    const res = await BudgetsRoutes.find(id);
    return res ? (res.serialize() as IBudgetsRoutes) : null;
  }

  async getBudgetsRoutesPaginated(
    filters: IBudgetsRoutesFilters
  ): Promise<IPagingData<IBudgetsRoutes>> {
    const query = BudgetsRoutes.query();

    query.preload("projectVinculation");
    query.preload("budget");
    query.preload("funds");
    query.preload("pospreSapiencia");

    if (filters.idProjectVinculation)
      query.where("idProjectVinculation", filters.idProjectVinculation);
    if (filters.idRoute) query.where("id", Number(filters.idRoute));

    query.preload("projectVinculation");
    query.preload("budget");
    query.preload("funds");
    query.preload("pospreSapiencia");

    const res = await query.paginate(filters.page, filters.perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IBudgetsRoutes[],
      meta,
    };
  }

  async getBudgetsRoutesWithoutPagination(): Promise<IBudgetsRoutes[]> {
    const query = BudgetsRoutes.query();

    query.preload("projectVinculation");
    query.preload("budget");
    query.preload("funds");
    query.preload("pospreSapiencia");

    const res = await query;

    return res;
  }
  async getFundsByProject(id:number): Promise<IBudgetsRoutes[]> {
    const query = BudgetsRoutes.query().where('idProjectVinculation',id);
    query.preload("funds");
   
    const res = await query;

    return res;
  }
  

  async getPospreByProjectAndFund(projectId: number, fundId: number): Promise<IBudgetsRoutes[] | null> {
    const query = BudgetsRoutes.query().where('idProjectVinculation',projectId).andWhere('idFund',fundId);
    query.preload("pospreSapiencia");
    const res = await query;

    return res;
  }

  async createBudgetsRoutes(
    budgetsRoutes: IBudgetsRoutes
  ): Promise<IBudgetsRoutes> {
    const toCreateIBudgetsRoutes = new BudgetsRoutes();
    toCreateIBudgetsRoutes.idProjectVinculation =
      budgetsRoutes.idProjectVinculation;
    toCreateIBudgetsRoutes.managementCenter = budgetsRoutes.managementCenter;
    toCreateIBudgetsRoutes.div = budgetsRoutes.div;
    toCreateIBudgetsRoutes.idBudget = budgetsRoutes.idBudget;
    toCreateIBudgetsRoutes.idPospreSapiencia = budgetsRoutes.idPospreSapiencia;
    toCreateIBudgetsRoutes.idFund = budgetsRoutes.idFund;
    if (budgetsRoutes.userCreate)
      toCreateIBudgetsRoutes.userCreate = budgetsRoutes.userCreate;

    await toCreateIBudgetsRoutes.save();

    return toCreateIBudgetsRoutes.serialize() as IBudgetsRoutes;
  }

  async updateBudgetsRoutes(
    budgetsRoutes: IBudgetsRoutes,
    id: number
  ): Promise<IBudgetsRoutes | null> {
    const toUpdate = await BudgetsRoutes.find(id);
    if (!toUpdate) {
      return null;
    }

    toUpdate.idProjectVinculation = budgetsRoutes.idProjectVinculation;
    toUpdate.managementCenter = budgetsRoutes.managementCenter;
    toUpdate.div = budgetsRoutes.div;
    toUpdate.idBudget = budgetsRoutes.idBudget;
    toUpdate.idPospreSapiencia = budgetsRoutes.idPospreSapiencia;
    toUpdate.idFund = budgetsRoutes.idFund;
    toUpdate.dateModify = DateTime.local().toJSDate();
    if (budgetsRoutes.userModify) {
      toUpdate.userModify = budgetsRoutes.userModify;
    }

    await toUpdate.save();
    return toUpdate.serialize() as IBudgetsRoutes;
  }

  async getBudgetForAdditions(
    projectId: number,
    foundId: number,
    posPreOriginId: number,
    posPreId: number
  ): Promise<IBudgetsRoutes | null> {
    const res = await BudgetsRoutes.query()
      .where("idProjectVinculation", projectId)
      .andWhere("idBudget", posPreOriginId)
      .andWhere("idPospreSapiencia", posPreId)
      .andWhere("idFund", foundId)
      .first();

    return res ? (res.serialize() as IBudgetsRoutes) : null;
  }

  async getBudgetForCdp(
    projectId: number,
    foundId: number,
    posPreId: number
  ): Promise<IBudgetsRoutes | null> {
    const res = await BudgetsRoutes.query()
      .where("idProjectVinculation", projectId)
      .andWhere("idPospreSapiencia", posPreId)
      .andWhere("idFund", foundId)
      .first();

    return res ? (res.serialize() as IBudgetsRoutes) : null;
  }

  async getBudgetsSpcifyExerciseWithPosPreSapi(
    posPreSapi: number
  ): Promise<IBudgetsRoutes[] | null> {
    const query = await BudgetsRoutes.query()
      .preload("projectVinculation", (a) => {
        // a.preload("areaFuntional");
        a.select("id", "type", "operationProjectId", "investmentProjectId");
      })
      .preload("funds", (b) => {
        b.select("id", "number", "denomination", "description");
      })
      .preload("pospreSapiencia", (c) => {
        c.select("id", "number", "ejercise", "description");
      })
      .preload("budget", (d) => {
        d.select("id", "number", "ejercise", "denomination", "description");
      })
      .select(
        "id",
        "idProjectVinculation",
        "managementCenter",
        "div",
        "idBudget",
        "idPospreSapiencia",
        "idFund",
        "balance"
      )
      .where("idPospreSapiencia", posPreSapi);

    return query.map((i) => i.serialize() as IBudgetsRoutes);
  }
}
