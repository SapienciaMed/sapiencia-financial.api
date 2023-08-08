import { IBudgetsRoutes, IBudgetsRoutesFilters} from "App/Interfaces/BudgetsRoutesInterfaces";
import BudgetsRoutes from "../Models/BudgetsRoutes";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

export interface IBudgetsRoutesRepository {
  updateBudgetsRoutes(budgets: IBudgetsRoutes, id: number): Promise<IBudgetsRoutes | null>;
  getBudgetsRoutesById(id: number): Promise<IBudgetsRoutes | null>;
  getBudgetsRoutesPaginated(filters: IBudgetsRoutesFilters): Promise<IPagingData<IBudgetsRoutes>>;
  createBudgetsRoutes(budgets: IBudgetsRoutes): Promise<IBudgetsRoutes>;
}

export default class BudgetsRoutesRepository implements IBudgetsRoutesRepository {
  constructor() {}

  async getBudgetsRoutesById(id: number): Promise<IBudgetsRoutes | null> {
    const res = await BudgetsRoutes.find(id);
    return res ? (res.serialize() as IBudgetsRoutes) : null;
  }
  
  async getBudgetsRoutesPaginated(filters: IBudgetsRoutesFilters): Promise<IPagingData<IBudgetsRoutes>> {
     const query =  BudgetsRoutes.query();
     
     query.preload("projectVinculation");
     query.preload("budget");
     query.preload("funds");
     query.preload("pospreSapiencia");
      
    if (filters.idProjectVinculation) {
      query.where("idProjectVinculation", filters.idProjectVinculation);
    }

    const res = await query.paginate(filters.page, filters.perPage);

    const { data, meta } = res.serialize();

    return {
      array: data as IBudgetsRoutes[],
      meta,
    };
  }

  async createBudgetsRoutes(budgetsRoutes: IBudgetsRoutes): Promise<IBudgetsRoutes> {
    const toCreateIBudgetsRoutes = new BudgetsRoutes();
    toCreateIBudgetsRoutes.idProjectVinculation = budgetsRoutes.idProjectVinculation;
    toCreateIBudgetsRoutes.managementCenter = budgetsRoutes.managementCenter;
    toCreateIBudgetsRoutes.div = budgetsRoutes.div;
    toCreateIBudgetsRoutes.idBudget = budgetsRoutes.idBudget;
    toCreateIBudgetsRoutes.idPospreSapiencia = budgetsRoutes.idPospreSapiencia;
    toCreateIBudgetsRoutes.idFund = budgetsRoutes.idFund;
    if(budgetsRoutes.userCreate) toCreateIBudgetsRoutes.userCreate = budgetsRoutes.userCreate;

    await toCreateIBudgetsRoutes.save();

    return toCreateIBudgetsRoutes.serialize() as IBudgetsRoutes;
  }

  async updateBudgetsRoutes(budgetsRoutes: IBudgetsRoutes, id: number): Promise<IBudgetsRoutes | null> {
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
    if(budgetsRoutes.userModify) {
      toUpdate.userModify = budgetsRoutes.userModify;
    }
    
    await toUpdate.save();
    return toUpdate.serialize() as IBudgetsRoutes;
  }
}
