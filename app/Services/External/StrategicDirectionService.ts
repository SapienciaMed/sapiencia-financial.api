import { IProjectsRepository } from "App/Repositories/ProjectsRepository";
import { ApiResponse } from "App/Utils/ApiResponses";
import axios, { AxiosInstance } from "axios";
import { IApiPlanningProject,
         IApiSpecificPlanningProjectData,
         IApiPlanningDetailedActivities,
         IApiPlanningDetailedActivitiesSpecify } from '../../Interfaces/ApiPlanningInterfaces';
import { IVinculationMGARepository } from '../../Repositories/VinculationMGARepository';

export interface IPlanningService {
  getProjectInvestmentByIds(ids: Array<number>): Promise<IApiSpecificPlanningProjectData[]>;
  getDetailedActivitiesByIds(ids: Array<number>): Promise<IApiPlanningDetailedActivitiesSpecify[]>;
}

export default class StrategicDirectionService implements IPlanningService {

  private axiosInstance: AxiosInstance;

  constructor(
    private projectsRepository: IProjectsRepository,
    private vinculationMGARepository: IVinculationMGARepository
  ) {

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
    const data: IApiPlanningProject[] = result.data.data;
    const aiRepo = this.projectsRepository.getInitialResource();
    console.log({ aiRepo });

    data.forEach(res => {

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

  async getDetailedActivitiesByIds(ids: Array<number>): Promise<IApiPlanningDetailedActivitiesSpecify[]> {

    const urlConsumer = `/api/v1/activities/get-by-filters`;

    const dataUser = await this.axiosInstance
      .post<ApiResponse<IApiPlanningDetailedActivities[]>>
      (urlConsumer, ids, {
        headers: {
          Authorization: process.env.CURRENT_AUTHORIZATION,
        }
      });

    const requestResult: IApiPlanningDetailedActivitiesSpecify[] = [];
    const result: IApiPlanningDetailedActivities | any = dataUser;
    const data: IApiPlanningDetailedActivities[] = result.data.data;
    const aiRepo = this.vinculationMGARepository.getInitialResource();
    console.log({ aiRepo });

    data.forEach(res => {

      const objResult: IApiPlanningDetailedActivitiesSpecify = {

        //* Info Actividad General
        activityId: res.activity.id,
        codeMga: res.activity.objetiveActivity,
        codeConsecutiveProductMga: res.activity.productMGA,
        productDescriptionMGA: res.activity.productDescriptionMGA,
        codeConsecutiveActivityMga: res.activity.activityMGA,
        activityDescriptionMGA: res.activity.activityDescriptionMGA,

        //* Info Actividad Detallada
        activityDetailedId: res.id,
        consecutiveActivityDetailed: res.consecutive,
        detailActivityDetailed: res.detailActivity,
        amountActivityDetailed: res.amount,
        measurementActivityDetailed: res.measurement,
        unitCostActivityDetailed: res.unitCost,
        totalCostActivityDetailed: (Number(res.unitCost) * Number(res.amount)),

      }

      requestResult.push(objResult);

    })

    return requestResult;

  }

}
