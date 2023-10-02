import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { IProject, IProjectFilters } from "App/Interfaces/ProjectsInterfaces";
import { IPlanningService } from "./External/StrategicDirectionService";
import { IFunctionalAreaRepository } from "../Repositories/FunctionalAreaRepository";
import { IProjectAdditionList } from "App/Interfaces/AdditionsInterfaces";
import { EProjectTypes } from "App/Constants/ProjectsEnums";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";

export interface IProjectsService {
  getAllProjects(): Promise<ApiResponse<IProjectAdditionList[]>>;
  getUnrelatedProjects(
    filters: IProjectFilters
  ): Promise<ApiResponse<IPagingData<IProject>>>;
}

export default class ProjectsService implements IProjectsService {
  constructor(
    private planningService: IPlanningService,
    private functionalAreaRepository: IFunctionalAreaRepository
  ) {}

  async getAllProjects(): Promise<ApiResponse<IProjectAdditionList[]>> {
    const toReturn: IProjectAdditionList[] = [];

    const allProjects =
      await this.functionalAreaRepository.getAllProjectFunctionalArea();

    if (allProjects.find((i) => i.type == EProjectTypes.investment)) {
      const list = allProjects
        .filter((i) => i.type == EProjectTypes.investment)
        .map((i) => i.investmentProjectId);

      const res = await this.planningService.getProjectByFilters({
        idList: list,
      });

      allProjects.forEach((vProject) => {
        const iProject = res.data.find(
          (i) => i.id == vProject.investmentProjectId
        );

        if (vProject.type == EProjectTypes.investment && iProject)
          toReturn.push({
            id: Number(vProject.id),
            functionalAreaId: vProject.functionalAreaId,
            projectId: iProject.projectCode,
            budgetValue: iProject.plannedValue,
            linked: vProject.linked,
            areaFuntional: vProject.areaFuntional,
            conceptProject: iProject.name,
            assignmentValue: iProject.assignmentValue,
            type: vProject.type,
          });
      });
    }

    return new ApiResponse(toReturn, EResponseCodes.OK);
  }

  async getUnrelatedProjects(
    filters: IProjectFilters
  ): Promise<ApiResponse<IPagingData<IProject>>> {
    const proyectsIds =
      await this.functionalAreaRepository.getAllInvestmentProjectIds();

    return await this.planningService.getProjectInvestmentPaginated({
      nameOrCode: filters.id,
      page: filters.page,
      perPage: filters.perPage,
      excludeIds: proyectsIds,
    });
  }
}
