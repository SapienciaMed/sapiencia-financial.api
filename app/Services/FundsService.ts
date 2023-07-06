import { IFunds, IFundsFilters } from "App/Interfaces/FundsInterfaces";
import { IFundsRepository } from "App/Repositories/FundsRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";

export interface IFundsService {
  getFundsById(id: number): Promise<ApiResponse<IFunds>>;
  getFundsPaginated(
    filters: IFundsFilters
  ): Promise<ApiResponse<IPagingData<IFunds>>>;
}

export default class FundsService implements IFundsService {
  constructor(private fundsRepository: IFundsRepository) {}

  async getFundsById(id: number): Promise<ApiResponse<IFunds>> {
    const res = await this.fundsRepository.getFundsById(id);

    if (!res) {
      return new ApiResponse(
        {} as IFunds,
        EResponseCodes.FAIL,
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
}
