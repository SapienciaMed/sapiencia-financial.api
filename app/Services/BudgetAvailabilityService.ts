import { IBudgetAvailabilityRepository } from "App/Repositories/BudgetAvailabilityRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import {
  IBudgetAvailability,
  IBudgetAvailabilityFilters,
  ICreateCdp,
  IUpdateBasicDataCdp,
} from "App/Interfaces/BudgetAvailabilityInterfaces";
import BudgetAvailability from "App/Models/BudgetAvailability";

export interface IBudgetAvailabilityService {
  searchBudgetAvailability(
    filters: IBudgetAvailabilityFilters
  ): Promise<ApiResponse<IPagingData<IBudgetAvailability>>>;

  associateAmountsWithCdp(cdpId: number, amounts: any[]): Promise<ApiResponse<any>>;
  createCdps(cdpData: ICreateCdp): Promise<ApiResponse<any>>;
  editBudgetAvailabilityBasicDataCDP(
    id: number,
    dataEdit: any
  ): Promise<ApiResponse<any>>;
  getById(id: string): Promise<ApiResponse<IBudgetAvailability>>;
  cancelAmountCdp(
    id: number,
    reasonCancellation: string
  ): Promise<ApiResponse<any>>;
  linkMga(): Promise<ApiResponse<any>>

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
    id: number,
    dataEdit: any
  ): Promise<ApiResponse<any>> {
    try {
      const updatedData: IUpdateBasicDataCdp = {
        id: +id,
        ...dataEdit,
      };
      const res =
        await this.budgetAvailabilityRepository.editBudgetAvailabilityBasicDataCDP(
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

  async getById(id: string): Promise<ApiResponse<BudgetAvailability | any>> {
    try {
      const data = await this.budgetAvailabilityRepository.getById(id);
      return new ApiResponse(
        data,
        EResponseCodes.OK,
        "CDP encontrado exitosamente"
      );
    } catch (error) {
      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        "Error al cargar el CDP" + error
      );
    }
  }

  async cancelAmountCdp(
    id: number,
    reasonCancellation: string
  ): Promise<ApiResponse<BudgetAvailability | any>> {
    try {
      const data = await this.budgetAvailabilityRepository.cancelAmountCdp(id, reasonCancellation);
      return new ApiResponse(data, EResponseCodes.OK, 'Monto CDP anulado exitosamente');
    } catch (error) {
      return new ApiResponse(null, EResponseCodes.FAIL, 'Error al anular el monto CDP' + error);
    }
  }

  async linkMga(): Promise<ApiResponse<any>> {
    try {
      const data = await this.budgetAvailabilityRepository.linkMga();
      return new ApiResponse(data, EResponseCodes.OK, 'MGA vinculado al CDP exitosamente');
    } catch (error) {
      return new ApiResponse(null, EResponseCodes.FAIL, 'Error al vincular MGA al CDP' + error);
    }
  }

  async associateAmountsWithCdp(cdpId: number, amounts: any[]): Promise<ApiResponse<any>> {
    try {
      await this.budgetAvailabilityRepository.associateAmountsWithCdp(cdpId, amounts);
      return new ApiResponse(null, EResponseCodes.OK, 'Importes asociados exitosamente');
    } catch (error) {
      console.error('Error en BudgetAvailabilityService al asociar importes al CDP:', error);
      return new ApiResponse(null, EResponseCodes.FAIL, 'Error al asociar importes al CDP: ' + error);
    }
  }
}
