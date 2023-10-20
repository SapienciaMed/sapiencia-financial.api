import { ICdpsRepository } from "App/Repositories/CdpsRepository";
import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { ICdps, IGetAllCdps } from "App/Interfaces/CdpsInterfaces";

export interface ICdpsService {
    searchCdps(cdps: ICdps): Promise<ApiResponse<IGetAllCdps[]>>;
}

export default class CdpsService implements ICdpsService {
    constructor(private cdpsRepository: ICdpsRepository) { }

    async searchCdps(cdps: ICdps): Promise<ApiResponse<IGetAllCdps[]>> {
        const res = await this.cdpsRepository.searchCdps(cdps);

        return new ApiResponse(res, EResponseCodes.OK);
    }
}
