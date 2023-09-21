import { IFunctionalProjectRepository } from '../Repositories/FunctionalProjectRepository';
import { ApiResponse } from '../Utils/ApiResponses';
import { IFunctionalProject } from '../Interfaces/FunctionalProjectInterfaces';
import { EResponseCodes } from '../Constants/ResponseCodesEnum';



export interface IFunctionalProjectService {

  getAllFunctionalProjects(): Promise<ApiResponse<IFunctionalProject[]>>;

}

export default class FunctionalProjectService implements IFunctionalProjectService {

  constructor(private functionalProjectRepository: IFunctionalProjectRepository) {}

  async getAllFunctionalProjects(): Promise<ApiResponse<IFunctionalProject[]>> {

    const res = await this.functionalProjectRepository.getAllFunctionalProjects();
    return new ApiResponse(res, EResponseCodes.OK);

  }

}
