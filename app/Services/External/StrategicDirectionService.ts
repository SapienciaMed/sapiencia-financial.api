import { IProjectsRepository } from "App/Repositories/ProjectsRepository";
import { ApiResponse } from "App/Utils/ApiResponses";
import axios, { AxiosInstance } from "axios";
import { IApiPlanningProject, IApiSpecificPlanningProjectData } from '../../Interfaces/ApiPlanningInterfaces';

export interface IPlanningService {
  getProjectInvestmentByIds(ids: Array<number>): Promise<IApiSpecificPlanningProjectData[]>;
}

export default class StrategicDirectionService implements IPlanningService {

  private axiosInstance: AxiosInstance;

  constructor(private projectsRepository: IProjectsRepository) {
    this.axiosInstance = axios.create({
      baseURL: process.env.URL_API_STRATEGIC_DIRECTION,
    });
  }

  public async getProjectInvestmentByIds(ids: Array<number>): Promise<IApiSpecificPlanningProjectData[]> {

    const requestResult: IApiSpecificPlanningProjectData[] = [];
    const urlConsumer = `/api/v1/project/get-by-filters`;
    const dataUser = await this.axiosInstance
                               .post<ApiResponse<IApiPlanningProject[]>>
                               (urlConsumer, ids, {
                                  headers: {
                                    Authorization: process.env.CURRENT_AUTHORIZATION,
                                  }
                               });

   const result: IApiPlanningProject | any = dataUser;
   const data: IApiPlanningProject[]  = result.data.data;
   const aiRepo = this.projectsRepository.getInitialResource();
   console.log({aiRepo});

   data.forEach( res => {

    const objResult: IApiSpecificPlanningProjectData = {
      id: res.id,
      bpin: res.bpin,
      project: res.project,
      dateFrom: res.dateFrom,
      dateTo: res.dateTo,
      user: res.user
    }

    requestResult.push(objResult);

   })

   return requestResult;

  }

}
