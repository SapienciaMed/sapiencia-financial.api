import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ICreditorRepository } from "App/Repositories/CreditorRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

export interface ICreditorService {
    getCreditorsByFilters():Promise<ApiResponse<any>>

}

export default class implements ICreditorService{

    constructor(private repository:ICreditorRepository){}

    getCreditorsByFilters = async()=>{
        try {
            
            const data= await this.repository.getCreditorsByFilters()
            return new ApiResponse(
                data,
                EResponseCodes.FAIL,
                "Acrededores encontrados exitosamente"
            );

        } catch (error) {
            return new ApiResponse(
                null,
                EResponseCodes.FAIL,
                "Error al consultar acrededores" + error
            );
        }
    }


}