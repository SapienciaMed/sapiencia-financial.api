import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import {
  IBudgetsRoutes,
  IBudgetsRoutesFilters,
} from "App/Interfaces/BudgetsRoutesInterfaces";
import { IBudgetsRoutesRepository } from "App/Repositories/BudgetsRoutesRepository";
import { IFunds } from "App/Interfaces/FundsInterfaces";
import { IPosPreSapiencia } from "App/Interfaces/PosPreSapienciaInterfaces";

export interface IBudgetsRoutesService {
  getBudgetsRoutesById(id: number): Promise<ApiResponse<IBudgetsRoutes>>;
  getBudgetsRoutesPaginated(
    filters: IBudgetsRoutesFilters
  ): Promise<ApiResponse<IPagingData<IBudgetsRoutes>>>;
  getBudgetsRoutesWithoutPagination(): Promise<ApiResponse<IBudgetsRoutes[]>>;
  createBudgetsRoutes(
    BudgetsRoutes: IBudgetsRoutes
  ): Promise<ApiResponse<IBudgetsRoutes>>;
  updateBudgetsRoutes(
    BudgetsRoutes: IBudgetsRoutes,
    id: number
  ): Promise<ApiResponse<IBudgetsRoutes | null>>;
  getFundsByProject(id: number): Promise<ApiResponse<IFunds[] | null>>;
  getPospreByProjectAndFund(
    projectId: number,
    fundId: number
  ): Promise<ApiResponse<IPosPreSapiencia[] | null>>;
  getBudgetsRoutesPaginatedV2(
    filters: IBudgetsRoutesFilters
  ): Promise<ApiResponse<IPagingData<IBudgetsRoutes>>>;
}

export default class BudgetsRoutesService implements IBudgetsRoutesService {
  constructor(private BudgetsRoutesRepository: IBudgetsRoutesRepository) {}

  async getBudgetsRoutesById(id: number): Promise<ApiResponse<IBudgetsRoutes>> {
    const res = await this.BudgetsRoutesRepository.getBudgetsRoutesById(id);
    if (!res) {
      return new ApiResponse(
        {} as IBudgetsRoutes,
        EResponseCodes.WARN,
        "Registro no encontrado"
      );
    }
    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getBudgetsRoutesPaginated(
    filters: IBudgetsRoutesFilters
  ): Promise<ApiResponse<IPagingData<IBudgetsRoutes>>> {
    const res = await this.BudgetsRoutesRepository.getBudgetsRoutesPaginated(
      filters
    );

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getBudgetsRoutesPaginatedV2(
    filters: IBudgetsRoutesFilters
  ): Promise<ApiResponse<IPagingData<IBudgetsRoutes>>> {
    const res = await this.BudgetsRoutesRepository.getBudgetsRoutesPaginatedV2(
      filters
    );

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getBudgetsRoutesWithoutPagination(): Promise<
    ApiResponse<IBudgetsRoutes[]>
  > {
    const res =
      await this.BudgetsRoutesRepository.getBudgetsRoutesWithoutPagination();
    return new ApiResponse(res, EResponseCodes.OK);
  }

  async createBudgetsRoutes(
    budgetsRoutes: IBudgetsRoutes
  ): Promise<ApiResponse<IBudgetsRoutes>> {
    const res = await this.BudgetsRoutesRepository.createBudgetsRoutes(
      budgetsRoutes
    );
    return new ApiResponse(res, EResponseCodes.OK);
  }

  async updateBudgetsRoutes(
    budgetsRoutes: IBudgetsRoutes,
    id: number
  ): Promise<ApiResponse<IBudgetsRoutes | null>> {
    const res = await this.BudgetsRoutesRepository.updateBudgetsRoutes(
      budgetsRoutes,
      id
    );
    if (!res) {
      return new ApiResponse(
        {} as IBudgetsRoutes,
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }
    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getFundsByProject(id: number): Promise<ApiResponse<IFunds[] | null>> {
    const res = await this.BudgetsRoutesRepository.getFundsByProject(id);

    let fundsList: IFunds[] = [];

    res?.forEach((fund: any) => {
      let fundExtract = fund.$preloaded?.funds?.$attributes;
      let fundsMatch = fundsList.find((e) => e.id == fundExtract.id);
      if (!fundsMatch) {
        fundsList.push(fundExtract);
      }
    });

    if (!res) {
      return new ApiResponse(
        {} as IFunds[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }
    return new ApiResponse(fundsList, EResponseCodes.OK);
  }

  async getPospreByProjectAndFund(
    projectId: number,
    fundId: number
  ): Promise<ApiResponse<IPosPreSapiencia[] | null>> {
    const res = await this.BudgetsRoutesRepository.getPospreByProjectAndFund(
      projectId,
      fundId
    );

    let posrpreList: IPosPreSapiencia[] = [];

    res?.forEach((pospreSapiencia: any) => {
      let pospreExtract =
        pospreSapiencia.$preloaded?.pospreSapiencia?.$attributes;
      let pospreMatch = posrpreList.find((e) => e.id == pospreExtract.id);
      if (!pospreMatch) {
        posrpreList.push(pospreExtract);
      }
    });

    if (!res) {
      return new ApiResponse(
        {} as IPosPreSapiencia[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }
    return new ApiResponse(posrpreList, EResponseCodes.OK);
  }
}
