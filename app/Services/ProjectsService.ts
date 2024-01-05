import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { IProject, IProjectFilters } from "App/Interfaces/ProjectsInterfaces";
import { IStrategicDirectionService } from "./External/StrategicDirectionService";
import { IFunctionalAreaRepository } from "../Repositories/FunctionalAreaRepository";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IProjectsVinculationFull } from "App/Interfaces/ProjectsVinculationInterfaces";
import { tranformProjectsVinculation } from "App/Utils/sub-services";
import { IFunctionalProjectRepository } from "App/Repositories/FunctionalProjectRepository";

export interface IProjectsService {
  getAllProjects(): Promise<ApiResponse<IProjectsVinculationFull[]>>;
  getUnrelatedProjects(
    filters: IProjectFilters
  ): Promise<ApiResponse<IPagingData<IProject>>>;
}

export default class ProjectsService implements IProjectsService {
  constructor(
    private strategicDirectionService: IStrategicDirectionService,
    private functionalAreaRepository: IFunctionalAreaRepository,
    private functionalProjectRepository: IFunctionalProjectRepository
  ) { }

  async getAllProjects(): Promise<ApiResponse<IProjectsVinculationFull[]>> {
    const allProjects =
      await this.functionalAreaRepository.getAllProjectFunctionalArea();

    // try {
    //   const transformedProjects = await tranformProjectsVinculation(allProjects);
    //   transformedProjects;
    //   // Continuar con el código después de la transformación, si es necesario.
    // } catch (error) {
    //   console.error("Ocurrió un error al transformar los proyectos:", error);
    //   // Puedes agregar más lógica aquí para manejar el error según tus necesidades.
    // }
    const res = await tranformProjectsVinculation(allProjects);

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getUnrelatedProjects(
    filters: IProjectFilters
  ): Promise<ApiResponse<IPagingData<IProject>>> {
    
    const functionProject =  await this.functionalProjectRepository.getFunctionalProjectPaginated({page:1,perPage:100000000})
    
    const actualYear = new Date().getFullYear()
    console.log({actualYear})

    const actualunctionalProject = functionProject.array.find(e=>e.exercise == actualYear)

    console.log({actualunctionalProject})

    //console.log({functionProject:functionProject.array})
    const proyectsIds =
      await this.functionalAreaRepository.getAllInvestmentProjectIds();

    let r = await this.strategicDirectionService.getProjectInvestmentPaginated({
      nameOrCode: filters.id,
      page: filters.page,
      perPage: filters.perPage,
      excludeIds: proyectsIds,
    });

    r.data.meta.total = r.data.meta.total+1; 

    const isLastPage = Object(r).data.meta.current_page === Object(r).data.meta.last_page;


    isLastPage && r.data.array.push({
      assignmentValue: actualunctionalProject?.assignmentValue! ?? 0,
      plannedValue: actualunctionalProject?.budgetValue! ?? 0,
      name: actualunctionalProject?.name!,
      id: actualunctionalProject?.id!,
      projectCode: actualunctionalProject?.number!,
      type: 'Funcionamiento'
    })

    return r;
  }
}
