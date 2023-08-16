import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IFunctionalArea, IFunctionalAreaFilters } from "App/Interfaces/FunctionalAreaInterfaces";
import { IFunctionalAreaRepository } from "App/Repositories/FunctionalAreaRepository";
import { IProjectsVinculate, IProjectsVinculateFilters, IProjectsVinculation } from "App/Interfaces/ProjectsVinculationInterfaces";

export interface IFunctionalAreaService {
    getFunctionalAreaById(id: number): Promise<ApiResponse<IFunctionalArea>>;
    getFunctionalAreaPaginated(filters: IFunctionalAreaFilters): Promise<ApiResponse<IPagingData<IFunctionalArea>>>;
    createFunctionalArea(functionalArea: IFunctionalArea): Promise<ApiResponse<IFunctionalArea>>;
    updateFunctionalArea(functionalArea: IFunctionalArea, id: number): Promise<ApiResponse<IFunctionalArea | null>>;
    createProjectFunctionalArea(projectsVinculate: IProjectsVinculate): Promise<ApiResponse<IProjectsVinculation[]>>;
    updateProjectFunctionalArea(projectsVinculate: IProjectsVinculate): Promise<ApiResponse<IProjectsVinculation[] | null>>;
    deleteProjectFunctionalArea(projectVinculate: number): Promise<ApiResponse<boolean>>;
    getAllProjectFunctionalArea(): Promise<ApiResponse<IProjectsVinculation[]>>;
    getProjectFunctionalAreaPaginated(filters: IProjectsVinculateFilters): Promise<ApiResponse<IPagingData<IProjectsVinculation>>>;
    getAllFunctionalAreas(): Promise<ApiResponse<IFunctionalArea[]>>;
}

export default class FunctionalAreaService implements IFunctionalAreaService {
    constructor(private FunctionalAreaRepository: IFunctionalAreaRepository) { }

    async getFunctionalAreaById(id: number): Promise<ApiResponse<IFunctionalArea>> {
        const res = await this.FunctionalAreaRepository.getFunctionalAreaById(id);
        if (!res) {
            return new ApiResponse(
                {} as IFunctionalArea,
                EResponseCodes.WARN,
                "Registro no encontrado"
            );
        }
        return new ApiResponse(res, EResponseCodes.OK);
    }

    async getFunctionalAreaPaginated(
        filters: IFunctionalAreaFilters
    ): Promise<ApiResponse<IPagingData<IFunctionalArea>>> {
        const res = await this.FunctionalAreaRepository.getFunctionalAreaPaginated(filters);

        return new ApiResponse(res, EResponseCodes.OK);
    }

    async createFunctionalArea(functionalArea: IFunctionalArea): Promise<ApiResponse<IFunctionalArea>> {
        const res = await this.FunctionalAreaRepository.createFunctionalArea(functionalArea);
        return new ApiResponse(res, EResponseCodes.OK);
    }

    async updateFunctionalArea(functionalArea: IFunctionalArea, id: number): Promise<ApiResponse<IFunctionalArea | null>> {
        const res = await this.FunctionalAreaRepository.updateFunctionalArea(functionalArea, id);
        if (!res) {
            return new ApiResponse(
                {} as IFunctionalArea,
                EResponseCodes.FAIL,
                "Registro no encontrado"
            );
        }
        return new ApiResponse(res, EResponseCodes.OK);
    }

    async createProjectFunctionalArea(projectsVinculate: IProjectsVinculate): Promise<ApiResponse<IProjectsVinculation[]>> {
        const res = await this.FunctionalAreaRepository.createProjectFunctionalArea(projectsVinculate);
        return new ApiResponse(res, EResponseCodes.OK);
    }

    async updateProjectFunctionalArea(projectsVinculate: IProjectsVinculate): Promise<ApiResponse<IProjectsVinculation[] | null>> {
        const res = await this.FunctionalAreaRepository.updateProjectFunctionalArea(projectsVinculate);
        if (!res) {
            return new ApiResponse(
                [] as IProjectsVinculation[],
                EResponseCodes.FAIL,
                "Registro no encontrado"
            );
        }
        return new ApiResponse(res, EResponseCodes.OK);
    }

    async deleteProjectFunctionalArea(projectVinculate: number): Promise<ApiResponse<boolean>> {
        const res = await this.FunctionalAreaRepository.deleteProjectFunctionalArea(projectVinculate);
        return new ApiResponse(res, EResponseCodes.OK);
    }

    async getAllProjectFunctionalArea(): Promise<ApiResponse<IProjectsVinculation[]>> {
        const res = await this.FunctionalAreaRepository.getAllProjectFunctionalArea();
        return new ApiResponse(res, EResponseCodes.OK);
    }

    async getProjectFunctionalAreaPaginated(
        filters: IProjectsVinculateFilters
    ): Promise<ApiResponse<IPagingData<IProjectsVinculation>>> {
        const res = await this.FunctionalAreaRepository.getProjectFunctionalAreaPaginated(filters);

        return new ApiResponse(res, EResponseCodes.OK);
    }

    async getAllFunctionalAreas(): Promise<ApiResponse<IFunctionalArea[]>> {
        const res = await this.FunctionalAreaRepository.getAllFunctionalAreas();

        return new ApiResponse(res, EResponseCodes.OK);
    }
}