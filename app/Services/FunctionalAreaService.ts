import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IFunctionalArea, IFunctionalAreaFilters } from "App/Interfaces/FunctionalAreaInterfaces";
import { IFunctionalAreaRepository } from "App/Repositories/FunctionalAreaRepository";
import { IProjectsVinculate, IProjectsVinculateFilters, IProjectsVinculation, IProjectsVinculationFull } from "App/Interfaces/ProjectsVinculationInterfaces";
import StrategicDirectionService from './External/StrategicDirectionService';
import { EProjectTypes } from "App/Constants/ProjectsEnums";
import { IProject } from "App/Interfaces/ProjectsInterfaces";

export interface IFunctionalAreaService {
    getFunctionalAreaById(id: number): Promise<ApiResponse<IFunctionalArea>>;
    getFunctionalAreaPaginated(filters: IFunctionalAreaFilters): Promise<ApiResponse<IPagingData<IFunctionalArea>>>;
    createFunctionalArea(functionalArea: IFunctionalArea): Promise<ApiResponse<IFunctionalArea>>;
    updateFunctionalArea(functionalArea: IFunctionalArea, id: number): Promise<ApiResponse<IFunctionalArea | null>>;
    createProjectFunctionalArea(projectsVinculate: IProjectsVinculate): Promise<ApiResponse<IProjectsVinculation[]>>;
    updateProjectFunctionalArea(projectsVinculate: IProjectsVinculate): Promise<ApiResponse<IProjectsVinculation[] | null>>;
    deleteProjectFunctionalArea(projectVinculate: number): Promise<ApiResponse<boolean>>;
    getProjectFunctionalAreaPaginated(filters: IProjectsVinculateFilters): Promise<ApiResponse<IPagingData<IProjectsVinculationFull>>>;
    getAllFunctionalAreas(): Promise<ApiResponse<IFunctionalArea[]>>;
}

export default class FunctionalAreaService implements IFunctionalAreaService {
    constructor(
        private FunctionalAreaRepository: IFunctionalAreaRepository,
        private strategicDirectionService: StrategicDirectionService
      ) {}
    
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

      //No pueden repetirse budget.
      const validNumber = await this.FunctionalAreaRepository.getFunctionalAreaByNumber(functionalArea.number);

      if(validNumber.array.length > 0) {
        return new ApiResponse(
          {} as IFunctionalArea,
          EResponseCodes.FAIL,
          `Ya existe un consecutivo asociado a esta Área Funcional.`
        );
      }

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


    async getProjectFunctionalAreaPaginated(
        filters: IProjectsVinculateFilters
      ): Promise<ApiResponse<IPagingData<IProjectsVinculationFull>>> {
        const res =
          await this.FunctionalAreaRepository.getProjectFunctionalAreaPaginated(
            filters
          );

        const toSend = await this.tranformProjectsVinculation(res.array);
    
        return new ApiResponse(
          {
            array: toSend,
            meta: res.meta,
          },
          EResponseCodes.OK
        );
      }

    async getAllFunctionalAreas(): Promise<ApiResponse<IFunctionalArea[]>> {
        const res = await this.FunctionalAreaRepository.getAllFunctionalAreas();

        return new ApiResponse(res, EResponseCodes.OK);
    }


    private async tranformProjectsVinculation(
        projects: IProjectsVinculation[]
      ): Promise<IProjectsVinculationFull[]> {
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
          }
          else {
            toReturn.push({
              ...project,
              projectId: project.functionalProject?.number || '',
              conceptProject: project.functionalProject?.name || "",
              plannedValue: 0,
              assignmentValue: 0,
            });
          }
        }
    
        return toReturn;
      }
}
