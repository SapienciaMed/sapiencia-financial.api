import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import IPacRepository from "App/Repositories/PacRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

export default interface IPacService {
    uploadPac(file): Promise<ApiResponse<any>>;
}

export default class PacService implements IPacService {

    constructor(private pacRepository: IPacRepository) { }

    uploadPac = async (file: any): Promise<ApiResponse<any>> => {
       
        // Obtener información y validación de excel
        const res = await this.pacRepository.uploadPac(file);
        
        // validar información (Consistencia data del negocio)

        // almacenar información

        return new ApiResponse(res, EResponseCodes.OK);
    }


}