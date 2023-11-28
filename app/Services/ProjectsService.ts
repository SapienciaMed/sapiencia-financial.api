import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { IProject, IProjectFilters } from "App/Interfaces/ProjectsInterfaces";
import { IStrategicDirectionService } from "./External/StrategicDirectionService";
import { IFunctionalAreaRepository } from "../Repositories/FunctionalAreaRepository";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IProjectsVinculationFull } from "App/Interfaces/ProjectsVinculationInterfaces";
import { tranformProjectsVinculation } from "App/Utils/sub-services";

export interface IProjectsService {
  getAllProjects(): Promise<ApiResponse<IProjectsVinculationFull[]>>;
  getUnrelatedProjects(
    filters: IProjectFilters
  ): Promise<ApiResponse<IPagingData<IProject>>>;
}

export default class ProjectsService implements IProjectsService {
  constructor(
    private strategicDirectionService: IStrategicDirectionService,
    private functionalAreaRepository: IFunctionalAreaRepository
  ) {}

  async getAllProjects(): Promise<ApiResponse<IProjectsVinculationFull[]>> {
    const allProjects =
    await this.functionalAreaRepository.getAllProjectFunctionalArea();
    
    try {
      const transformedProjects = await tranformProjectsVinculation(allProjects);
      transformedProjects;
      // Continuar con el código después de la transformación, si es necesario.
    } catch (error) {
      console.error("Ocurrió un error al transformar los proyectos:", error);
      // Puedes agregar más lógica aquí para manejar el error según tus necesidades.
    }
    const res = await tranformProjectsVinculation(allProjects);
    // console.log(allProjects);

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getUnrelatedProjects(
    filters: IProjectFilters
  ): Promise<ApiResponse<IPagingData<IProject>>> {
    const proyectsIds =
      await this.functionalAreaRepository.getAllInvestmentProjectIds();

    return await this.strategicDirectionService.getProjectInvestmentPaginated({
      nameOrCode: filters.id,
      page: filters.page,
      perPage: filters.perPage,
      excludeIds: proyectsIds,
    });
  }
}
