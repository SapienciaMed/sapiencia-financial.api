import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IBudgetsRoutes, IBudgetsRoutesFilters } from "App/Interfaces/BudgetsRoutesInterfaces";
import { IBudgetsRoutesRepository } from "App/Repositories/BudgetsRoutesRepository";

export interface IBudgetsRoutesService {
    getBudgetsRoutesById(id: number): Promise<ApiResponse<IBudgetsRoutes>>;
    getBudgetsRoutesPaginated(filters: IBudgetsRoutesFilters): Promise<ApiResponse<IPagingData<IBudgetsRoutes>>>;
    getBudgetsRoutesWithoutPagination(): Promise<ApiResponse<IBudgetsRoutes[]>>;
    createBudgetsRoutes(BudgetsRoutes: IBudgetsRoutes): Promise<ApiResponse<IBudgetsRoutes>>;
    updateBudgetsRoutes(BudgetsRoutes: IBudgetsRoutes, id: number): Promise<ApiResponse<IBudgetsRoutes | null>>;
    getAllRoutesByExcercise(excercise:number): Promise<ApiResponse<IBudgetsRoutes[] | null>>;
}


export default class BudgetsRoutesService implements IBudgetsRoutesService {
    constructor(private BudgetsRoutesRepository: IBudgetsRoutesRepository) { }

    async getBudgetsRoutesById(id: number): Promise<ApiResponse<IBudgetsRoutes>> {
        const res = await this.BudgetsRoutesRepository.getBudgetsRoutesById(id);
        if (!res) {
            return new ApiResponse(
                {} as IBudgetsRoutes,
                EResponseCodes.WARN,
                "Registro no encontrado"
            );
        }
        return new ApiResponse(res, EResponseCodes.OK);
    }

    async getBudgetsRoutesPaginated(
        filters: IBudgetsRoutesFilters
    ): Promise<ApiResponse<IPagingData<IBudgetsRoutes>>> {
        const res = await this.BudgetsRoutesRepository.getBudgetsRoutesPaginated(filters);

        return new ApiResponse(res, EResponseCodes.OK);
    }

    async getBudgetsRoutesWithoutPagination(): Promise<ApiResponse<IBudgetsRoutes[]>> {
        const res = await this.BudgetsRoutesRepository.getBudgetsRoutesWithoutPagination();
        return new ApiResponse(res, EResponseCodes.OK);
    }

    async createBudgetsRoutes(budgetsRoutes: IBudgetsRoutes): Promise<ApiResponse<IBudgetsRoutes>> {
        const res = await this.BudgetsRoutesRepository.createBudgetsRoutes(budgetsRoutes);
        return new ApiResponse(res, EResponseCodes.OK);
    }

    async updateBudgetsRoutes(budgetsRoutes: IBudgetsRoutes, id: number): Promise<ApiResponse<IBudgetsRoutes | null>> {
        const res = await this.BudgetsRoutesRepository.updateBudgetsRoutes(budgetsRoutes, id);
        if (!res) {
            return new ApiResponse(
                {} as IBudgetsRoutes,
                EResponseCodes.FAIL,
                "Registro no encontrado"
            );
        }
        return new ApiResponse(res, EResponseCodes.OK);
    }
    async getAllRoutesByExcercise(excercise:number): Promise<ApiResponse<IBudgetsRoutes[] | null>> {
        const res = await this.BudgetsRoutesRepository.getAllRoutesByExcercise(excercise);
        if (!res) {
            return new ApiResponse(
                [] as IBudgetsRoutes[],
                EResponseCodes.FAIL,
                "Registro no encontrado"
            );
        }
        return new ApiResponse(res, EResponseCodes.OK);
    }
}