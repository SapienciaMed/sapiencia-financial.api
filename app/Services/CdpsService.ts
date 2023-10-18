import { ICdpsRepository } from "App/Repositories/CdpsRepository";
import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";

export interface ICdpsService {
    getAllCdps(): Promise<ApiResponse<any[]>>;
}

export default class CdpsService implements ICdpsService {
    constructor(private cdpsRepository: ICdpsRepository) { }

    async getAllCdps(): Promise<ApiResponse<any[]>> {
        const res = await this.cdpsRepository.getAllCdps();

        return new ApiResponse(res, EResponseCodes.OK);
    }
}
