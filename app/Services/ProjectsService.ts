import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IProject } from "App/Interfaces/ProjectsInterfaces";
import { IProjectsRepository } from "App/Repositories/ProjectsRepository";

export interface IProjectsService {

    getAllProjects(): Promise<ApiResponse<IProject[]>>;

}

export default class ProjectsService implements IProjectsService {

  constructor(private projectsRepository: IProjectsRepository) { }

    async getAllProjects(): Promise<ApiResponse<IProject[]>> {
        const res = await this.projectsRepository.getAllProjects();
        return new ApiResponse(res, EResponseCodes.OK);
    }
}
