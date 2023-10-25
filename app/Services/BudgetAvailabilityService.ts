import { IBudgetAvailabilityRepository } from "App/Repositories/BudgetAvailabilityRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import {
  IBudgetAvailability,
  IBudgetAvailabilityFilters,
  ICreateCdp,
  IUpdateBasicDataCdp,
} from "App/Interfaces/BudgetAvailabilityInterfaces";

export interface IBudgetAvailabilityService {
  searchBudgetAvailability(
    filters: IBudgetAvailabilityFilters
  ): Promise<ApiResponse<IPagingData<IBudgetAvailability>>>;
  createCdps(cdpData: ICreateCdp): Promise<ApiResponse<any>>;
  editBudgetAvailabilityBasicDataCDP(
    id: string,
    dataEdit: any
  ): Promise<ApiResponse<any>>;
}

export default class BudgetAvailabilityService
  implements IBudgetAvailabilityService
{
  constructor(
    private budgetAvailabilityRepository: IBudgetAvailabilityRepository
  ) {}

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
      const createdData = await this.budgetAvailabilityRepository.createCdps(
        cdpData
      );
      return new ApiResponse(
        createdData,
        EResponseCodes.OK,
        "CDP e ICD creados exitosamente"
      );
    } catch (error) {
      console.error("Error en CdpsService al crear CDP e ICD:", error);
      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        "Error al crear CDP e ICD" + error
      );
    }
  }

  async editBudgetAvailabilityBasicDataCDP(
    id: string,
    dataEdit: any
  ): Promise<ApiResponse<any>> {
    try {
      const updatedData: IUpdateBasicDataCdp = {
        id,
        ...dataEdit,
      };
      const res = await this.budgetAvailabilityRepository.updateBasicDataCdp(
        updatedData
      );
      return new ApiResponse(res, EResponseCodes.OK);
    } catch (error) {
      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        "Error al editar datos basicos del CDP" + error
      );
    }
  }
}
