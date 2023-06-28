import { IFunds } from "App/Interfaces/FundsInterfaces";
import { IFundsRepository } from "App/Repositories/FundsRepository";
import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";

export interface IFundsService {
  getFundsById(id: number): Promise<ApiResponse<IFunds>>;
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
}
