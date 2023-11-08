import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ICreditorsFilter } from "App/Interfaces/Creditors";
import { ICreditorRepository } from "App/Repositories/CreditorRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

export interface ICreditorService {
    getCreditorsByFilters(creditorsFilter: ICreditorsFilter): Promise<ApiResponse<any>>
}

export default class implements ICreditorService {

    constructor(private repository: ICreditorRepository) { }

    getCreditorsByFilters = async (creditorsFilter: ICreditorsFilter) => {
        try {
            const data = await this.repository.getCreditorsByFilters(creditorsFilter)
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