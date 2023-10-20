import ICdpsRepository from "App/Repositories/CdpsRepository";
import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { ICreateCdp } from "App/Interfaces/CdpsInterfaces";
export default interface ICdpsService {
    getAllCdps(): Promise<ApiResponse<any[]>>;
    createCdps(cdpData: ICreateCdp): Promise<ApiResponse<any>>
}

export default class CdpsService implements ICdpsService {
    constructor(private cdpsRepository: ICdpsRepository) { }

    async getAllCdps(): Promise<ApiResponse<any[]>> {
        const res = await this.cdpsRepository.getAllCdps();

        return new ApiResponse(res, EResponseCodes.OK);
    }

    async createCdps(cdpData: ICreateCdp): Promise<ApiResponse<any>> {
        try {
            const createdData = await this.cdpsRepository.createCdps(cdpData);
            return new ApiResponse(createdData, EResponseCodes.OK, 'CDP e ICD creados exitosamente');
        } catch (error) {
            console.error('Error en CdpsService al crear CDP e ICD:', error);
            return new ApiResponse(null, EResponseCodes.FAIL, 'Error al crear CDP e ICD'+error);
        }
    }
}
