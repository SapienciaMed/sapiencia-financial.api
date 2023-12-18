import {
  IBudgetsRoutes,
  IBudgetsRoutesFilters,
} from "App/Interfaces/BudgetsRoutesInterfaces";
import BudgetsRoutes from "../Models/BudgetsRoutes";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";
import { IStrategicDirectionService } from "App/Services/External/StrategicDirectionService";
import ProjectsVinculation from "App/Models/ProjectsVinculation";
import FunctionalProject from "App/Models/FunctionalProject";

export interface IBudgetsRoutesRepository {
  updateBudgetsRoutes(
    budgets: IBudgetsRoutes,
    id: number
  ): Promise<IBudgetsRoutes | null>;
  getBudgetsRoutesById(id: number): Promise<IBudgetsRoutes | null>;
  getBudgetsRoutesPaginated(
    filters: IBudgetsRoutesFilters
  ): Promise<IPagingData<IBudgetsRoutes>>;
  getBudgetsRoutesPaginatedV2(
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
  getAllRoutesByExcercise(
    excercise: number
  ): Promise<IBudgetsRoutes[] | null>;
  createManyBudgetRoutes(budgetsRoutes:IBudgetsRoutes[]):Promise<BudgetsRoutes[]>
  getFundsByProject(ids: number): Promise<IBudgetsRoutes[] | null>;
  getPospreByProjectAndFund(
    projectId: number,
    fundId: number
  ): Promise<IBudgetsRoutes[] | null>;
}

export default class BudgetsRoutesRepository
  implements IBudgetsRoutesRepository
{
  constructor(private strategicDirectionService: IStrategicDirectionService) {}
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

  async getBudgetsRoutesPaginatedV2(
    filters: IBudgetsRoutesFilters
  ): Promise<IPagingData<IBudgetsRoutes>> {
    let isValid: boolean = false;
    let idProject: number = 0;
    const idsProjects: number[] = [];
    const initalEmptyData = {
      array: [],
      meta: {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
        first_page: 1,
        first_page_url: "/?page=1",
        last_page_url: "/?page=1",
        next_page_url: null,
        previous_page_url: null,
      },
    };
    if (filters.idProjectVinculation) {
      const queryPfu = await FunctionalProject.query().where(
        "number",
        filters.idProjectVinculation.toString()
      );

      const resPfu = queryPfu.map((i) => i.serialize());

      if (!resPfu.length) {
        const queryStrategyDirection =
          await this.strategicDirectionService.getProjectByFilters({
            codeList: [filters.idProjectVinculation.toString()],
          });

        if (
          queryStrategyDirection.operation.code === "OK" &&
          queryStrategyDirection.data.length > 0
        ) {
          idProject = queryStrategyDirection.data[0].id;
          isValid = true;
        }
      } else {
        idProject = resPfu[0].id;
        isValid = true;
      }

      const queryVpy = await ProjectsVinculation.query().where(
        !resPfu.length ? "investmentProjectId" : "operationProjectId",
        idProject
      );
      const resVpy = queryVpy.map((i) => i.serialize());

      resVpy.forEach((element) => {
        idsProjects.push(element.id);
      });
    }

    if (isValid) {
      const query = BudgetsRoutes.query();

      if (filters.idProjectVinculation)
        query.whereIn("idProjectVinculation", idsProjects);
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
    } else {
      return initalEmptyData;
    }
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
  async getFundsByProject(id: number): Promise<IBudgetsRoutes[]> {
    const query = BudgetsRoutes.query().where("idProjectVinculation", id);
    query.preload("funds");

    const res = await query;

    return res;
  }

  async getPospreByProjectAndFund(
    projectId: number,
    fundId: number
  ): Promise<IBudgetsRoutes[] | null> {
    const query = BudgetsRoutes.query()
      .where("idProjectVinculation", projectId)
      .andWhere("idFund", fundId);
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
  
  async  getAllRoutesByExcercise(
    excercise: number
  ): Promise<IBudgetsRoutes[] | null> {
    const routes = await BudgetsRoutes.query()
      .preload('budget')
      .preload('funds')
      .whereHas('pospreSapiencia',(query)=>{
        query.where('ejercise',excercise)
      })
      .preload('pospreSapiencia')
      .preload('projectVinculation')
      
    return routes.map((i) => i.serialize() as IBudgetsRoutes);
  }

  async createManyBudgetRoutes(budgetsRoutes:IBudgetsRoutes[]): Promise<BudgetsRoutes[]> {
    const res = BudgetsRoutes.createMany(budgetsRoutes);
    return res;
  }
}
