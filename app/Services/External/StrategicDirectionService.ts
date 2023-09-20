import { ApiResponse } from "App/Utils/ApiResponses";
import axios, { AxiosInstance } from "axios";

interface ICommonProyectData {
  assignmentValue: number;
  budgetValue: number;
  conceptProject: string;
  projectId: string;
  id: number;
}

export default class StrategicDirectionService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.URL_API_STRATEGIC_DIRECTION,
    });
  }

  public async getProjectInvestmentByIds(
    ids: Array<number>
  ): Promise<ICommonProyectData[]> {
    const dataUser = await this.axiosInstance.post<
      ApiResponse<ICommonProyectData[]>
    >(`/ruta/falta-crear`, ids, {
      headers: {
        Authorization: process.env.CURRENT_AUTHORIZATION,
      },
    });
    // return dataUser.data.data;

    return [
      {
        id: 1,
        assignmentValue: 0,
        budgetValue: 0,
        projectId: "312312123",
        conceptProject: "prueba ",
      },
    ];
  }
}
