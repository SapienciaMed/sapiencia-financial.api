import axios, { AxiosInstance } from "axios";
import { IVinculationMGARepository } from "../../Repositories/VinculationMGARepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import {
  IApiPlanningProject,
  IApiPlanningDetailedActivities,
  IApiPlanningDetailedActivitiesSpecify,
  IInternalPagination,
  IGetTotalCostsByFilter,
} from "../../Interfaces/ApiPlanningInterfaces";
import { IActivityMGA } from "../../Interfaces/VinculationMGAInterfaces";
import { IProject } from "../../Interfaces/ProjectsInterfaces";
import { EResponseCodes } from "../../Constants/ResponseCodesEnum";
import { EProjectTypes } from "App/Constants/ProjectsEnums";

export interface IProjectPaginated {
  nameOrCode?: string;
  excludeIds?: number[];
  page: number;
  perPage: number;
}

export interface IProjectFilters {
  idList?: number[];
  codeList?: string[];
  status?: boolean;
}

export interface IActivitiesFilters {
  idList?: number[];
  codeList?: string[];
  status?: boolean;
}

export interface IStrategicDirectionService {
  getProjectInvestmentPaginated(
    filter: IProjectPaginated
  ): Promise<ApiResponse<IPagingData<IProject>>>;
  getProjectByFilters(
    filter: IProjectFilters
  ): Promise<ApiResponse<IProject[]>>;
  getDetailedActivitiesByIds(
    ids: Array<number>
  ): Promise<ApiResponse<IApiPlanningDetailedActivitiesSpecify[]>>;
  getDetailedActivitiesNoUseOnPosPre(
    ids: Array<number>,
    posPreOrig: number
  ): Promise<ApiResponse<IApiPlanningDetailedActivitiesSpecify[] | any>>;
  getDetailedActivitiesYesUseOnPosPre(
    ids: Array<number>,
    posPreOrig: number
  ): Promise<ApiResponse<IApiPlanningDetailedActivitiesSpecify[] | any>>;
  getVinculationDetailedActivitiesV2ById(
    id: number
  ): Promise<ApiResponse<IApiPlanningDetailedActivitiesSpecify | any>>;
  getTotalCostsByFilter(
    filter: IGetTotalCostsByFilter
  ): Promise<ApiResponse<number>>;
  getActivitiesFilters(
    data: IActivitiesFilters
  ): Promise<ApiResponse<IApiPlanningDetailedActivities[]>>;
}

export default class StrategicDirectionService
  implements IStrategicDirectionService
{
  private axiosInstance: AxiosInstance;

  constructor(private vinculationMGARepository: IVinculationMGARepository) {
    this.axiosInstance = axios.create({
      baseURL: process.env.URL_API_STRATEGIC_DIRECTION,
    });
  }

  //? Obtengo todo el listado de proyectos de inversión desde planeación
  public async getProjectInvestmentPaginated(
    filter: IProjectPaginated
  ): Promise<ApiResponse<IPagingData<IProject>>> {
    const urlConsumer = `/api/v1/project/get-paginated`;

    const dataUser = await this.axiosInstance.post<
      ApiResponse<IApiPlanningProject[]>
    >(urlConsumer, filter, {
      headers: {
        Authorization: process.env.CURRENT_AUTHORIZATION,
      },
    });

    const requestResult: IProject[] = [];
    const result: IApiPlanningProject | any = dataUser;
    const dataI: IApiPlanningProject[] = result.data.data.array;
    const dataJ: IInternalPagination = result.data.data.meta;

    dataI.forEach((res) => {
      const objResult: IProject = {
        assignmentValue: 0,
        plannedValue: 0,
        name: res.project,
        id: res.id,
        projectCode: res.bpin,
        type: EProjectTypes.investment,
      };

      requestResult.push(objResult);
    });

    const paginationResult = {
      array: requestResult,
      meta: dataJ,
    };

    return new ApiResponse(
      paginationResult,
      EResponseCodes.OK,
      "Listado de Proyectos de Inversión desde Planeación."
    );
  }

  //? Obtengo todo el listado de proyectos de inversión desde planeación
  public async getProjectByFilters(
    filter: IProjectFilters
  ): Promise<ApiResponse<IProject[]>> {
    const urlConsumer = `/api/v1/project/get-by-filters`;

    const res = await this.axiosInstance.post<
      ApiResponse<IApiPlanningProject[]>
    >(urlConsumer, filter, {
      headers: {
        Authorization: process.env.CURRENT_AUTHORIZATION,
      },
    });

    const requestResult: IProject[] = [];
    const dataI: IApiPlanningProject[] = res.data.data;

    dataI.forEach((res) => {
      const objResult: IProject = {
        assignmentValue: res.goal ? +res.goal : 0,
        plannedValue: 0,
        name: res.project,
        id: res.id,
        projectCode: res.bpin,
        type: EProjectTypes.investment,
      };

      requestResult.push(objResult);
    });

    return new ApiResponse(
      requestResult,
      EResponseCodes.OK,
      "Listado de Proyectos de Inversión desde Planeación."
    );
  }

  //? Obtengo las actividades detalladas desde planeación
  async getDetailedActivitiesByIds(
    ids: Array<number>
  ): Promise<ApiResponse<IApiPlanningDetailedActivitiesSpecify[] | any>> {
    const urlConsumer = `/api/v1/activities/get-paginated`;

    const dataUser = await this.axiosInstance.post<
      ApiResponse<IApiPlanningDetailedActivities[]>
    >(urlConsumer, ids, {
      headers: {
        Authorization: process.env.CURRENT_AUTHORIZATION,
      },
    });

    const requestResult: IApiPlanningDetailedActivitiesSpecify[] = [];
    const result: IApiPlanningDetailedActivities | any = dataUser;
    const dataI: IApiPlanningDetailedActivities[] = result.data.data.array;
    const dataJ: IInternalPagination = result.data.data.meta;

    dataI.forEach((res) => {
      //* Calculo peso con la medida dada de lista core.
      let unity: string = "";
      switch (res.measurement) {
        case 0:
          unity = "Hectáreas";
          break;
        case 1:
          unity = "Horas";
          break;
        case 2:
          unity = "Mes";
          break;
        case 3:
          unity = "Millones";
          break;
        case 4:
          unity = "Minuto";
          break;
        case 5:
          unity = "Número";
          break;
        case 6:
          unity = "Pesos";
          break;
        case 7:
          unity = "Porcentajes";
          break;
        case 8:
          unity = "Puntaje";
          break;
        case 9:
          unity = "Unidad";
          break;
        case 10:
          unity = "Volumen";
          break;
      }

      const objResult: IApiPlanningDetailedActivitiesSpecify = {
        //* Info Actividad General
        idProject: res.activity.idProject,
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
        measurementActivityDetailedName: unity,
        unitCostActivityDetailed: res.unitCost,
        totalCostActivityDetailed: Number(res.unitCost) * Number(res.amount),
      };

      requestResult.push(objResult);
    });

    const paginationResult = {
      array: requestResult,
      meta: dataJ,
    };

    return new ApiResponse(
      paginationResult,
      EResponseCodes.OK,
      "Listado de Actividades Detalladas con su Actividad General desde Planeación."
    );
  }

  //? Obtengo las actividades detalladas de planeación que no estén vinculadas a un pospre específico
  async getDetailedActivitiesNoUseOnPosPre(
    ids: Array<number>,
    posPreOrig: number
  ): Promise<ApiResponse<IApiPlanningDetailedActivitiesSpecify[] | any>> {
    const urlConsumer = `/api/v1/activities/get-paginated`;
    const requestResult: IApiPlanningDetailedActivitiesSpecify[] = [];

    //* Petición a la API
    const dataUser = await this.axiosInstance.post<
      ApiResponse<IApiPlanningDetailedActivities[]>
    >(urlConsumer, ids, {
      headers: {
        Authorization: process.env.CURRENT_AUTHORIZATION,
      },
    });

    //* Para consultar el listado de actividades detalladas
    const result: IApiPlanningDetailedActivities | any = dataUser;
    const dataI: IApiPlanningDetailedActivities[] = result.data.data.array;
    const dataJ: IInternalPagination = result.data.data.meta;
    let datak: IInternalPagination | any = null;

    //* Traemos vinculaciones con ese pospre:
    const myPosPre: number = Number(posPreOrig);
    let arrayActivtyDetailedOnPosPre: number[] = [];
    const vinculationsOfPosPre: IActivityMGA[] =
      await this.vinculationMGARepository.getVinculationMGAByPosPreOrg(
        myPosPre
      );

    //* Guardo los códigos de actividad detallada en un Array<number>
    vinculationsOfPosPre.forEach((resVinculation) =>
      arrayActivtyDetailedOnPosPre.push(
        Number(resVinculation.detailedActivityId)
      )
    );

    dataI.forEach((resDetailtedActitivyList) => {
      if (!arrayActivtyDetailedOnPosPre.includes(resDetailtedActitivyList.id)) {
        //* Calculo peso con la medida dada de lista core.
        let unity: string = "";
        switch (resDetailtedActitivyList.measurement) {
          case 0:
            unity = "Hectáreas";
            break;
          case 1:
            unity = "Horas";
            break;
          case 2:
            unity = "Mes";
            break;
          case 3:
            unity = "Millones";
            break;
          case 4:
            unity = "Minuto";
            break;
          case 5:
            unity = "Número";
            break;
          case 6:
            unity = "Pesos";
            break;
          case 7:
            unity = "Porcentajes";
            break;
          case 8:
            unity = "Puntaje";
            break;
          case 9:
            unity = "Unidad";
            break;
          case 10:
            unity = "Volumen";
            break;
        }

        const objResult: IApiPlanningDetailedActivitiesSpecify = {
          //* Info Actividad General
          idProject: resDetailtedActitivyList.activity.idProject,
          activityId: resDetailtedActitivyList.activity.id,
          codeMga: resDetailtedActitivyList.activity.objetiveActivity,
          codeConsecutiveProductMga:
            resDetailtedActitivyList.activity.productMGA,
          productDescriptionMGA:
            resDetailtedActitivyList.activity.productDescriptionMGA,
          codeConsecutiveActivityMga:
            resDetailtedActitivyList.activity.activityMGA,
          activityDescriptionMGA:
            resDetailtedActitivyList.activity.activityDescriptionMGA,

          //* Info Actividad Detallada
          activityDetailedId: resDetailtedActitivyList.id,
          consecutiveActivityDetailed: resDetailtedActitivyList.consecutive,
          detailActivityDetailed: resDetailtedActitivyList.detailActivity,
          amountActivityDetailed: resDetailtedActitivyList.amount,
          measurementActivityDetailed: resDetailtedActitivyList.measurement,
          measurementActivityDetailedName: unity,
          unitCostActivityDetailed: resDetailtedActitivyList.unitCost,
          totalCostActivityDetailed:
            Number(resDetailtedActitivyList.unitCost) *
            Number(resDetailtedActitivyList.amount),
        };

        requestResult.push(objResult);
      }
    });

    //* Reorganización de datos de paginación
    datak = {
      total: dataJ.total - Number(arrayActivtyDetailedOnPosPre.length),
      per_page: dataJ.per_page,
      current_page: dataJ.current_page,
      last_page: dataJ.last_page,
      first_page: dataJ.first_page,
      first_page_url: dataJ.first_page_url,
      last_page_url: dataJ.last_page_url,
      next_page_url: dataJ.next_page_url,
      previous_page_url: dataJ.previous_page_url,
    };

    const paginationResult = {
      array: requestResult,
      meta: datak,
    };

    return new ApiResponse(
      paginationResult,
      EResponseCodes.OK,
      "Listado de Actividades Detalladas con su Actividad General desde Planeación."
    );
  }

  //? Obtengo las actividades detalladas de planeación que esté vinculadas a un pospre específico
  async getDetailedActivitiesYesUseOnPosPre(
    ids: Array<number>,
    posPreOrig: number
  ): Promise<ApiResponse<IApiPlanningDetailedActivitiesSpecify[] | any>> {
    const urlConsumer = `/api/v1/activities/get-paginated`;
    const requestResult: IApiPlanningDetailedActivitiesSpecify[] = [];

    //* Petición a la API
    const dataUser = await this.axiosInstance.post<
      ApiResponse<IApiPlanningDetailedActivities[]>
    >(urlConsumer, ids, {
      headers: {
        Authorization: process.env.CURRENT_AUTHORIZATION,
      },
    });

    //* Para consultar el listado de actividades detalladas
    const result: IApiPlanningDetailedActivities | any = dataUser;
    const dataI: IApiPlanningDetailedActivities[] = result.data.data.array;
    const dataJ: IInternalPagination = result.data.data.meta;
    let datak: IInternalPagination | any = null;

    //* Traemos vinculaciones con ese pospre:
    const myPosPre: number = Number(posPreOrig);
    let arrayActivtyDetailedOnPosPre: number[] = [];
    let arrayActivityMGAGenerated: number[] = [];
    const vinculationsOfPosPre: IActivityMGA[] =
      await this.vinculationMGARepository.getVinculationMGAByPosPreOrg(
        myPosPre
      );

    //* Guardo los códigos de actividad detallada en un Array<number>
    vinculationsOfPosPre.forEach((resVinculation) => {
      arrayActivityMGAGenerated.push(Number(resVinculation.id));
      arrayActivtyDetailedOnPosPre.push(
        Number(resVinculation.detailedActivityId)
      );
    });

    let regisContMga: number = 0;
    dataI.forEach((resDetailtedActitivyList) => {
      if (arrayActivtyDetailedOnPosPre.includes(resDetailtedActitivyList.id)) {
        const vinculationMga: number = arrayActivityMGAGenerated[regisContMga];

        //* Calculo peso con la medida dada de lista core.
        let unity: string = "";
        switch (resDetailtedActitivyList.measurement) {
          case 0:
            unity = "Hectáreas";
            break;
          case 1:
            unity = "Horas";
            break;
          case 2:
            unity = "Mes";
            break;
          case 3:
            unity = "Millones";
            break;
          case 4:
            unity = "Minuto";
            break;
          case 5:
            unity = "Número";
            break;
          case 6:
            unity = "Pesos";
            break;
          case 7:
            unity = "Porcentajes";
            break;
          case 8:
            unity = "Puntaje";
            break;
          case 9:
            unity = "Unidad";
            break;
          case 10:
            unity = "Volumen";
            break;
        }

        const objResult: IApiPlanningDetailedActivitiesSpecify = {
          //* Info Vinculación MGA
          id: vinculationMga,
          idProject: resDetailtedActitivyList.activity.idProject,
          //* Info Actividad General
          activityId: resDetailtedActitivyList.activity.id,
          codeMga: resDetailtedActitivyList.activity.objetiveActivity,
          codeConsecutiveProductMga:
            resDetailtedActitivyList.activity.productMGA,
          productDescriptionMGA:
            resDetailtedActitivyList.activity.productDescriptionMGA,
          codeConsecutiveActivityMga:
            resDetailtedActitivyList.activity.activityMGA,
          activityDescriptionMGA:
            resDetailtedActitivyList.activity.activityDescriptionMGA,

          //* Info Actividad Detallada
          activityDetailedId: resDetailtedActitivyList.id,
          consecutiveActivityDetailed: resDetailtedActitivyList.consecutive,
          detailActivityDetailed: resDetailtedActitivyList.detailActivity,
          amountActivityDetailed: resDetailtedActitivyList.amount,
          measurementActivityDetailed: resDetailtedActitivyList.measurement,

          measurementActivityDetailedName: unity.toString(),

          unitCostActivityDetailed: resDetailtedActitivyList.unitCost,
          totalCostActivityDetailed:
            Number(resDetailtedActitivyList.unitCost) *
            Number(resDetailtedActitivyList.amount),
        };

        requestResult.push(objResult);
        regisContMga++;
      }
    });

    //* Reorganización de datos de paginación
    datak = {
      total: Number(arrayActivtyDetailedOnPosPre.length),
      per_page: dataJ.per_page,
      current_page: dataJ.current_page,
      last_page: dataJ.last_page,
      first_page: dataJ.first_page,
      first_page_url: dataJ.first_page_url,
      last_page_url: dataJ.last_page_url,
      next_page_url: dataJ.next_page_url,
      previous_page_url: dataJ.previous_page_url,
    };

    const paginationResult = {
      array: requestResult,
      meta: datak,
    };

    return new ApiResponse(
      paginationResult,
      EResponseCodes.OK,
      "Listado de Actividades Detalladas con su Actividad General desde Planeación."
    );
  }

  //? Obtener la actividad detallada específica de una vinculación dentro del listado
  async getVinculationDetailedActivitiesV2ById(
    id: number
  ): Promise<ApiResponse<IApiPlanningDetailedActivitiesSpecify | any>> {
    const urlConsumer = `/api/v1/activities/get-paginated`;
    const requestResult: IApiPlanningDetailedActivitiesSpecify[] = [];
    const ids: number[] = [];

    //* Petición a la API
    const dataUser = await this.axiosInstance.post<
      ApiResponse<IApiPlanningDetailedActivities[]>
    >(urlConsumer, ids, {
      headers: {
        Authorization: process.env.CURRENT_AUTHORIZATION,
      },
    });

    //* Para consultar el listado de actividades detalladas
    const result: IApiPlanningDetailedActivities | any = dataUser;
    const dataI: IApiPlanningDetailedActivities[] = result.data.data.array;
    const dataJ: IInternalPagination = result.data.data.meta;
    let datak: IInternalPagination | any = null;

    dataI.forEach((resDetailtedActitivyList) => {
      if (resDetailtedActitivyList.id === Number(id)) {
        //* Calculo peso con la medida dada de lista core.
        let unity: string = "";
        switch (resDetailtedActitivyList.measurement) {
          case 0:
            unity = "Hectáreas";
            break;
          case 1:
            unity = "Horas";
            break;
          case 2:
            unity = "Mes";
            break;
          case 3:
            unity = "Millones";
            break;
          case 4:
            unity = "Minuto";
            break;
          case 5:
            unity = "Número";
            break;
          case 6:
            unity = "Pesos";
            break;
          case 7:
            unity = "Porcentajes";
            break;
          case 8:
            unity = "Puntaje";
            break;
          case 9:
            unity = "Unidad";
            break;
          case 10:
            unity = "Volumen";
            break;
        }

        const objResult: IApiPlanningDetailedActivitiesSpecify = {
          //* Info Actividad General
          idProject: resDetailtedActitivyList.activity.idProject,
          activityId: resDetailtedActitivyList.activity.id,
          codeMga: resDetailtedActitivyList.activity.objetiveActivity,
          codeConsecutiveProductMga:
            resDetailtedActitivyList.activity.productMGA,
          productDescriptionMGA:
            resDetailtedActitivyList.activity.productDescriptionMGA,
          codeConsecutiveActivityMga:
            resDetailtedActitivyList.activity.activityMGA,
          activityDescriptionMGA:
            resDetailtedActitivyList.activity.activityDescriptionMGA,

          //* Info Actividad Detallada
          activityDetailedId: resDetailtedActitivyList.id,
          consecutiveActivityDetailed: resDetailtedActitivyList.consecutive,
          detailActivityDetailed: resDetailtedActitivyList.detailActivity,
          amountActivityDetailed: resDetailtedActitivyList.amount,
          measurementActivityDetailedName: unity,
          measurementActivityDetailed: resDetailtedActitivyList.measurement,
          unitCostActivityDetailed: resDetailtedActitivyList.unitCost,
          totalCostActivityDetailed:
            Number(resDetailtedActitivyList.unitCost) *
            Number(resDetailtedActitivyList.amount),
        };

        requestResult.push(objResult);
      }
    });

    //* Reorganización de datos de paginación
    datak = {
      total: Number(requestResult.length),
      per_page: dataJ.per_page,
      current_page: dataJ.current_page,
      last_page: dataJ.last_page,
      first_page: dataJ.first_page,
      first_page_url: dataJ.first_page_url,
      last_page_url: dataJ.last_page_url,
      next_page_url: dataJ.next_page_url,
      previous_page_url: dataJ.previous_page_url,
    };

    const paginationResult = {
      array: requestResult,
      meta: datak,
    };

    return new ApiResponse(
      paginationResult,
      EResponseCodes.OK,
      "Actividad Detallada Encontrada."
    );
  }

  async getTotalCostsByFilter(
    filter: IGetTotalCostsByFilter
  ): Promise<ApiResponse<number>> {
    const urlConsumer = `/api/v1/activities/get-total-costs-by-filter`;
    const dataResult = await this.axiosInstance.post<ApiResponse<number>>(
      urlConsumer,
      filter,
      {
        headers: {
          Authorization: process.env.CURRENT_AUTHORIZATION,
        },
      }
    );

    return dataResult.data;
  }

  //? Obtengo todo el listado de actividades de inversión desde planeación
  public async getActivitiesFilters(
    filter: IActivitiesFilters
  ): Promise<ApiResponse<IApiPlanningDetailedActivities[]>> {
    const urlConsumer = `/api/v1/activities/get-by-filters`;

    const res = await this.axiosInstance.post<
      ApiResponse<IApiPlanningDetailedActivities[]>
    >(urlConsumer, filter, {
      headers: {
        Authorization: process.env.CURRENT_AUTHORIZATION,
      },
    });

    return res.data;
  }
}
