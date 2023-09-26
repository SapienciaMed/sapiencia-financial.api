import { IFunctionalProjectRepository } from '../Repositories/FunctionalProjectRepository';
import { ApiResponse } from '../Utils/ApiResponses';
import { IFunctionalProject } from '../Interfaces/FunctionalProjectInterfaces';
import { EResponseCodes } from '../Constants/ResponseCodesEnum';



export interface IFunctionalProjectService {

  getFunctionalProjectPaginated(): Promise<ApiResponse<IFunctionalProject[]>>;
  createFunctionalProject(functionalProject:IFunctionalProject):Promise<ApiResponse<IFunctionalProject>>;

}

export default class FunctionalProjectService implements IFunctionalProjectService {

  constructor(private functionalProjectRepository: IFunctionalProjectRepository) {}
  
  async getFunctionalProjectPaginated(): Promise<ApiResponse<IFunctionalProject[]>> {

    const res = await this.functionalProjectRepository.getFunctionalProjectPaginated();
    return new ApiResponse(res, EResponseCodes.OK);

  }
  
  async createFunctionalProject(functionalProject: IFunctionalProject): Promise<ApiResponse<IFunctionalProject>> {
  
    const res = await this.functionalProjectRepository.createFunctionalProject(functionalProject);
    if (!res) {
      return new ApiResponse(
          {} as IFunctionalProject,
          EResponseCodes.WARN,
          "Registro no encontrado"
      );
  }
    if (Object(res).data?.errno==1062) {
      return new ApiResponse(
          {} as IFunctionalProject,
          EResponseCodes.WARN,
          "Projecto duplicado"
      );
  }
    
    return new ApiResponse(res, EResponseCodes.OK);

}

}
