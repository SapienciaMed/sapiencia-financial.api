import { IBudgets} from "App/Interfaces/BudgetsInterfaces";
import Budgets from "../Models/Budgets";

export interface IBudgetsRepository {
  getBudgetsById(id: number): Promise<IBudgets | null>;
}

export default class BudgetsRepository implements IBudgetsRepository {
  constructor() {}

  async getBudgetsById(id: number): Promise<IBudgets | null> {
    const res = await Budgets.find(id);
    return res ? (res.serialize() as IBudgets) : null;
  }
  
  
}
