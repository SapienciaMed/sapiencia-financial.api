import { IBudgets, IFilterBudgets } from "App/Interfaces/BudgetsInterfaces";
import { IBudgetsRepository } from "App/Repositories/BudgetsRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";

export interface IBudgetsService {
  
    //updateBudgets(data: { name: string; description: string; aplicationId: number; userCreate: string | undefined; userModify: string | undefined; actions: { id: number; optionId: number; name: string; order: number; indicator: string; url: string | undefined; }[] | undefined; }, id: any): any;
    getBudgetsById(id: number): Promise<ApiResponse<IBudgets>>;
    getBudgetsPaginated(
      filters: IFilterBudgets
    ): Promise<ApiResponse<IPagingData<IBudgets>>>;
    createBudgets(budgets: IBudgets): Promise<ApiResponse<IBudgets>>;
    updateBudgets(fund: IBudgets, id: number): Promise<ApiResponse<IBudgets>>;
}

export default class BudgetsService implements IBudgetsService {
  constructor(private budgetsRepository: IBudgetsRepository) {}

  async getBudgetsById(id: number): Promise<ApiResponse<IBudgets>> {
    const res = await this.budgetsRepository.getBudgetsById(id);

    if (!res) {
      return new ApiResponse(
        {} as IBudgets,
        EResponseCodes.WARN,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getBudgetsPaginated(
    filters: IFilterBudgets
  ): Promise<ApiResponse<IPagingData<IBudgets>>> {
    const res = await this.budgetsRepository.getBudgetsPaginated(filters);
  
    return new ApiResponse(res, EResponseCodes.OK);
  }


  async createBudgets(budgets: IBudgets): Promise<ApiResponse<IBudgets>> {
    const res = await this.budgetsRepository.createBudgets(budgets);
    return new ApiResponse(res, EResponseCodes.OK);
  }

  async updateBudgets(budgets: IBudgets, id: number): Promise<ApiResponse<IBudgets>> {
    const res = await this.budgetsRepository.updateBudgets(budgets, id);

    if (!res) {
      return new ApiResponse(
        {} as IBudgets,
        EResponseCodes.FAIL,
        "El registro indicado no existe"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
