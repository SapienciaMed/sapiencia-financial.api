import { IFunds, IFundsFilters } from "App/Interfaces/FundsInterfaces";
import { IFundsRepository } from "App/Repositories/FundsRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";

export interface IFundsService {
  getFundsById(id: number): Promise<ApiResponse<IFunds>>;
  getFundsPaginated(
    filters: IFundsFilters
  ): Promise<ApiResponse<IPagingData<IFunds>>>;
  createFund(fund: IFunds): Promise<ApiResponse<IFunds>>;
  updateFund(fund: IFunds, id: number): Promise<ApiResponse<IFunds>>;
}

export default class FundsService implements IFundsService {
  constructor(private fundsRepository: IFundsRepository) {}

  async getFundsById(id: number): Promise<ApiResponse<IFunds>> {
    const res = await this.fundsRepository.getFundsById(id);

    if (!res) {
      return new ApiResponse(
        {} as IFunds,
        EResponseCodes.WARN,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getFundsPaginated(
    filters: IFundsFilters
  ): Promise<ApiResponse<IPagingData<IFunds>>> {
    const res = await this.fundsRepository.getFundsPaginated(filters);

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async createFund(fund: IFunds): Promise<ApiResponse<IFunds>> {
    const res = await this.fundsRepository.createFund(fund);
    return new ApiResponse(res, EResponseCodes.OK);
  }

  async updateFund(fund: IFunds, id: number): Promise<ApiResponse<IFunds>> {
    const res = await this.fundsRepository.updateFund(fund, id);

    if (!res) {
      return new ApiResponse(
        {} as IFunds,
        EResponseCodes.FAIL,
        "El registro indicado no existe"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
