import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IBudgetRecord, IBudgetRecordFilter } from "App/Interfaces/BudgetRecord";
import IBudgetRecordRepository from "App/Repositories/BudgetRecordRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

export interface IBudgetRecordService {
    createCdps(budgetRecord: IBudgetRecord): Promise<ApiResponse<any>>
    getComponents(): Promise<ApiResponse<any>>
    getRpByFilters(budgetRecordFilter: IBudgetRecordFilter): Promise<ApiResponse<any>>
    getTotalValuesImports(id: number): Promise<ApiResponse<any>>;
}

export default class BudgetRecordService implements IBudgetRecordService {


    constructor(private budgerRecordRepository: IBudgetRecordRepository) {
        this.budgerRecordRepository = budgerRecordRepository;
    }

    createCdps = async (budgetRecord: IBudgetRecord): Promise<ApiResponse<any>> => {
        try {
            const data = await this.budgerRecordRepository.createCdps(budgetRecord)
            return new ApiResponse(
                data,
                EResponseCodes.OK,
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

    getComponents = async (): Promise<ApiResponse<any>> => {
        try {
            const data = await this.budgerRecordRepository.getComponents()
            return new ApiResponse(
                data,
                EResponseCodes.OK,
                "Componentes encontrados exitosamente"
            );

        } catch (error) {
            return new ApiResponse(
                null,
                EResponseCodes.FAIL,
                "Error consultar componentes del RP" + error
            );
        }
    }

    getRpByFilters = async (budgetRecordFilter: IBudgetRecordFilter): Promise<ApiResponse<any>> => {
        try {
            const data = await this.budgerRecordRepository.getRpByFilters(budgetRecordFilter)
            return new ApiResponse(
                data,
                EResponseCodes.OK,
                "Registros presupuestales encontrados exitosamente"
            );
        } catch (error) {
            return new ApiResponse(
                null,
                EResponseCodes.FAIL,
                "Error consultar registros presupuestales" + error
            );
        }
    }
    async getTotalValuesImports(id: number): Promise<ApiResponse<any>>  {
        const res = await this.budgerRecordRepository.getTotalValuesImports(id);
        if (!res) {
            return new ApiResponse(
                {} as any,
                EResponseCodes.WARN,
                "Registro no encontrado"
            );
        }
        return new ApiResponse(res, EResponseCodes.OK);
    }

}