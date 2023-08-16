import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IProject, IProjectFilters } from "App/Interfaces/ProjectsInterfaces";
import { IProjectsRepository } from "App/Repositories/ProjectsRepository";

export interface IProjectsService {
    getProjectsPaginated(filters: IProjectFilters): Promise<ApiResponse<IPagingData<IProject>>>;
    getAllProjects(): Promise<ApiResponse<IProject[]>>;
}

export default class ProjectsService implements IProjectsService {
    constructor(private projectsRepository: IProjectsRepository) { }

    async getProjectsPaginated(
        filters: IProjectFilters
    ): Promise<ApiResponse<IPagingData<IProject>>> {
        const res = await this.projectsRepository.getProjectsPaginated(filters);

        return new ApiResponse(res, EResponseCodes.OK);
    }

    async getAllProjects(): Promise<ApiResponse<IProject[]>> {
        const res = await this.projectsRepository.getAllProjects();
        return new ApiResponse(res, EResponseCodes.OK);
    }
}
