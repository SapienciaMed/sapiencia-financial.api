import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ICreditor, ICreditorsFilter } from "App/Interfaces/Creditors";
import { ICreditorRepository } from "App/Repositories/CreditorRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

export interface ICreditorService {
    getCreditorsByFilters(creditorsFilter: ICreditorsFilter): Promise<ApiResponse<any>>
    createCreditor(data: ICreditor): Promise<ApiResponse<any>>
    updateCreditor(data: ICreditor): Promise<ApiResponse<any>>
}

export default class implements ICreditorService {

    constructor(private repository: ICreditorRepository) { }

    createCreditor = async (data: ICreditor) => {
        try {
            const response = await this.repository.createCreditor(data)
            return new ApiResponse(
                response,
                EResponseCodes.FAIL,
                "Acrededor creado exitosamente"
            );

        } catch (error) {
            return new ApiResponse(
                null,
                EResponseCodes.FAIL,
                "Error al crear un acreedor" + error
            );
        }
    }
    
    updateCreditor = async (data: ICreditor) => {
        try {
            const response = await this.repository.createCreditor(data)
            return new ApiResponse(
                response,
                EResponseCodes.FAIL,
                "Acrededor creado exitosamente"
            );

        } catch (error) {
            return new ApiResponse(
                null,
                EResponseCodes.FAIL,
                "Error al crear un acreedor" + error
            );
        }
    }
    
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
                "Error al consultar acreedores" + error
            );
        }
    }


}