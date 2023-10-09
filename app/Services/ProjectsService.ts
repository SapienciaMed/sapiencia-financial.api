import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { IProject, IProjectFilters } from "App/Interfaces/ProjectsInterfaces";
import { IStrategicDirectionService } from "./External/StrategicDirectionService";
import { IFunctionalAreaRepository } from "../Repositories/FunctionalAreaRepository";
import { EProjectTypes } from "App/Constants/ProjectsEnums";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import {
  IProjectsVinculation,
  IProjectsVinculationFull,
} from "App/Interfaces/ProjectsVinculationInterfaces";

export interface IProjectsService {

  getAllProjects(): Promise<ApiResponse<IProjectsVinculationFull[]>>;
  getUnrelatedProjects(filters: IProjectFilters): Promise<ApiResponse<IPagingData<IProject>>>;

}

export default class ProjectsService implements IProjectsService {

  constructor(

    private strategicDirectionService: IStrategicDirectionService,
    private functionalAreaRepository: IFunctionalAreaRepository

  ) {}

  async getAllProjects(): Promise<ApiResponse<IProjectsVinculationFull[]>> {

    const allProjects =
      await this.functionalAreaRepository.getAllProjectFunctionalArea();

    const res = await this.tranformProjectsVinculation(allProjects)

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getUnrelatedProjects(filters: IProjectFilters): Promise<ApiResponse<IPagingData<IProject>>> {

    const proyectsIds =
      await this.functionalAreaRepository.getAllInvestmentProjectIds();

    return await this.strategicDirectionService.getProjectInvestmentPaginated({
      nameOrCode: filters.id,
      page: filters.page,
      perPage: filters.perPage,
      excludeIds: proyectsIds,
    });

  }

  private async tranformProjectsVinculation(projects: IProjectsVinculation[]): Promise<IProjectsVinculationFull[]> {

    const toReturn: IProjectsVinculationFull[] = [];
    let investmentProjects: IProject[] = [];

    if (projects.find((i) => i.type == EProjectTypes.investment)) {
      const res = await this.strategicDirectionService.getProjectByFilters({
        idList: projects.map((i) => i.investmentProjectId),
      });

      if (res.operation.code !== EResponseCodes.OK) {
        throw new Error(
          "Error al comunicarse con la api de direccion estreategica"
        );
      }

      investmentProjects = res.data;
    }

    for (const project of projects) {
      if (project.type == EProjectTypes.investment) {
        const iProject = investmentProjects.find(
          (j) => j.id == project.investmentProjectId
        );

        toReturn.push({
          ...project,
          projectId: iProject?.projectCode || "",
          conceptProject: iProject?.name || "",
          plannedValue: iProject?.plannedValue || 0,
          assignmentValue: iProject?.assignmentValue || 0,
        });
      } else {
        toReturn.push({
          ...project,
          projectId: project.functionalProject?.number || "",
          conceptProject: project.functionalProject?.name || "",
          plannedValue: 0,
          assignmentValue: 0,
        });
      }
    }

    return toReturn;

  }
}
