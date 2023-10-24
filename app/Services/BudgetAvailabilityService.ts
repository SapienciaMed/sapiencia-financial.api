import { IBudgetAvailabilityRepository } from "App/Repositories/BudgetAvailabilityRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import {
  IBudgetAvailability,
  IBudgetAvailabilityFilters,
} from "App/Interfaces/BudgetAvailabilityInterfaces";
import { ICreateCdp } from "App/Interfaces/BudgetAvailabilityInterfaces";
import BudgetAvailability from "App/Models/BudgetAvailability";

export interface IBudgetAvailabilityService {
  searchBudgetAvailability(
    filters: IBudgetAvailabilityFilters
  ): Promise<ApiResponse<IPagingData<IBudgetAvailability>>>;
  createCdps(cdpData: ICreateCdp): Promise<ApiResponse<any>>
  getById(id: string): Promise<ApiResponse<IBudgetAvailability>>
  cancelAmountCdp(id:number, reasonCancellation:string): Promise<ApiResponse<any>>
}

export default class BudgetAvailabilityService
  implements IBudgetAvailabilityService {
  constructor(
    private budgetAvailabilityRepository: IBudgetAvailabilityRepository
  ) { }

  async searchBudgetAvailability(
    filters: IBudgetAvailabilityFilters
  ): Promise<ApiResponse<IPagingData<IBudgetAvailability>>> {
    const res =
      await this.budgetAvailabilityRepository.searchBudgetAvailability(filters);

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getAllCdps(): Promise<ApiResponse<any[]>> {
    const res = await this.budgetAvailabilityRepository.getAllCdps();

    return new ApiResponse(res, EResponseCodes.OK);
  }
  async createCdps(cdpData: ICreateCdp): Promise<ApiResponse<any>> {
    try {
      const createdData = await this.budgetAvailabilityRepository.createCdps(cdpData);
      return new ApiResponse(createdData, EResponseCodes.OK, 'CDP e ICD creados exitosamente');
    } catch (error) {
      console.error('Error en CdpsService al crear CDP e ICD:', error);
      return new ApiResponse(null, EResponseCodes.FAIL, 'Error al crear CDP e ICD' + error);
    }
  }
  
  async getById(id:string): Promise<ApiResponse<BudgetAvailability | any>> {
    try {
      const data = await this.budgetAvailabilityRepository.getById(id);
      return new ApiResponse(data, EResponseCodes.OK, 'CDP encontrado exitosamente');
    } catch (error) {
      return new ApiResponse(null, EResponseCodes.FAIL, 'Error al cargar el CDP' + error);
    }
  }
  
  async cancelAmountCdp(id:number, reasonCancellation:string): Promise<ApiResponse<BudgetAvailability | any>> {
    try {
      const data = await this.budgetAvailabilityRepository.cancelAmountCdp(id, reasonCancellation);
      return new ApiResponse(data, EResponseCodes.OK, 'CDP encontrado exitosamente');
    } catch (error) {
      return new ApiResponse(null, EResponseCodes.FAIL, 'Error al cargar el CDP' + error);
    }
  }
}
