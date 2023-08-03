import { ITypeTransfers } from "App/Interfaces/TypesTranfersInterfaces";
import { ITypeTransfersRepository } from "App/Repositories/TypeTransfersRepository"
import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";

export interface ITypesTransfersService {
    getTypeTransfers(): Promise<ApiResponse<ITypeTransfers[]>>;
}

export default class TypesTransfersService implements ITypesTransfersService {
  constructor(private typesTransfersRepository: ITypeTransfersRepository) {}

  async getTypeTransfers(): Promise<ApiResponse<ITypeTransfers[]>> {
    const res = await this.typesTransfersRepository.getTypeTransfers();

    if (!res) {
      return new ApiResponse(
        [] as ITypeTransfers[],
        EResponseCodes.WARN,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
