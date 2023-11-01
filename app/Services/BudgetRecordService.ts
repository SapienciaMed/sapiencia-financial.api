import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import IBudgetRecordRepository from "App/Repositories/BudgetRecordRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

export interface IBudgetRecordService {
    createCdps():Promise<ApiResponse<any>>
}

export default class BudgetRecordService implements IBudgetRecordService{

    constructor(private budgerRecordRepository:IBudgetRecordRepository){

    }

    createCdps = async(): Promise<ApiResponse<any>>=> {
        
        try {
            await this.budgerRecordRepository.createCdps()
            return new ApiResponse(
                null,
                EResponseCodes.FAIL,
                "RP creado exitosamente"
              );
        
        } catch (error) {
            return new ApiResponse(
                null,
                EResponseCodes.FAIL,
                "Error al crear el RP" + error
              );
        }

    }

}