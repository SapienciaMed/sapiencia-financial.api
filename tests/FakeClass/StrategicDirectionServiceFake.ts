import {
  IApiPlanningDetailedActivitiesSpecify,
  IGetTotalCostsByFilter,
} from "App/Interfaces/ApiPlanningInterfaces";
import { IProject } from "App/Interfaces/ProjectsInterfaces";
import {
  IProjectFilters,
  IProjectPaginated,
  IStrategicDirectionService,
} from "App/Services/External/StrategicDirectionService";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";

export class StrategicDirectionServiceFake
  implements IStrategicDirectionService
{
  getProjectInvestmentPaginated(
    _filter: IProjectPaginated
  ): Promise<ApiResponse<IPagingData<IProject>>> {
    throw new Error("Method not implemented.");
  }
  getProjectByFilters(
    _filter: IProjectFilters
  ): Promise<ApiResponse<IProject[]>> {
    throw new Error("Method not implemented.");
  }
  getDetailedActivitiesByIds(
    _ids: number[]
  ): Promise<ApiResponse<IApiPlanningDetailedActivitiesSpecify[]>> {
    throw new Error("Method not implemented.");
  }
  getDetailedActivitiesNoUseOnPosPre(
    _ids: number[],
    _posPreOrig: number
  ): Promise<ApiResponse<any>> {
    throw new Error("Method not implemented.");
  }
  getDetailedActivitiesYesUseOnPosPre(
    _ids: number[],
    _posPreOrig: number
  ): Promise<ApiResponse<any>> {
    throw new Error("Method not implemented.");
  }
  getVinculationDetailedActivitiesV2ById(
    _id: number
  ): Promise<ApiResponse<any>> {
    throw new Error("Method not implemented.");
  }

  getTotalCostsByFilter(
    _filter: IGetTotalCostsByFilter
  ): Promise<ApiResponse<any>> {
    throw new Error("Method not implemented.");
  }
}
