import { IFunctionalProjectRepository } from '../Repositories/FunctionalProjectRepository';
import { ApiResponse, IPagingData } from '../Utils/ApiResponses';
import { IFunctionalProject, IFunctionalProjectFilters } from '../Interfaces/FunctionalProjectInterfaces';
import { EResponseCodes } from '../Constants/ResponseCodesEnum';



export interface IFunctionalProjectService {
  getFunctionalProjectById(id: number): Promise<ApiResponse<IFunctionalProject>>;
  getFunctionalProjectPaginated(filters:IFunctionalProjectFilters): Promise<ApiResponse<IPagingData<IFunctionalProject>>>;
  createFunctionalProject(functionalProject:IFunctionalProject):Promise<ApiResponse<IFunctionalProject>>;
  updateFunctionalProject(functionalProject: IFunctionalProject, id: number): Promise<ApiResponse<IFunctionalProject>>;
}

export default class FunctionalProjectService implements IFunctionalProjectService {

  constructor(private functionalProjectRepository: IFunctionalProjectRepository) {}
  
  async getFunctionalProjectPaginated(filters:IFunctionalProjectFilters): Promise<ApiResponse<IPagingData<IFunctionalProject>>> {

    const res = await this.functionalProjectRepository.getFunctionalProjectPaginated(filters);
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

async getFunctionalProjectById(id: number): Promise<ApiResponse<IFunctionalProject>> {
  const res = await this.functionalProjectRepository.getFunctionalProjectById(id);

  if (!res) {
    return new ApiResponse(
      {} as IFunctionalProject,
      EResponseCodes.WARN,
      "Registro no encontrado"
    );
  }

  return new ApiResponse(res, EResponseCodes.OK);
}  

async updateFunctionalProject(fund: IFunctionalProject, id: number): Promise<ApiResponse<IFunctionalProject>> {
  const res = await this.functionalProjectRepository.updateFunctionalProject(fund, id);

  if (!res) {
    return new ApiResponse(
      {} as IFunctionalProject,
      EResponseCodes.FAIL,
      "El registro indicado no existe"
    );
  }

  return new ApiResponse(res, EResponseCodes.OK);
}  


}
