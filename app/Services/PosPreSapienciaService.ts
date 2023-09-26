import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IFiltersPosPreSapiencia, IPosPreSapiencia } from "App/Interfaces/PosPreSapienciaInterfaces";
import { IPosPreSapienciaRepository } from "App/Repositories/PosPreSapienciaRepository";
import { IFiltersPosPreSapienciaMix } from '../Interfaces/PosPreSapienciaInterfaces';

export interface IPosPreSapienciaService {
  getPosPreSapienciaById(id: number): Promise<ApiResponse<IPosPreSapiencia>>;
  getPosPreSapienciaPaginated(filters: IFiltersPosPreSapiencia): Promise<ApiResponse<IPagingData<IPosPreSapiencia>>>;
  createPosPreSapiencia(posPreSapiencia: IPosPreSapiencia): Promise<ApiResponse<IPosPreSapiencia>>;
  updatePosPreSapiencia(posPreSapiencia: IPosPreSapiencia, id: number): Promise<ApiResponse<IPosPreSapiencia>>;
  getAllPosPreSapiencia(): Promise<ApiResponse<IPosPreSapiencia[]>>;

  //TODO: Nuevos
  getListPosPreSapVinculationPaginated(filters: IFiltersPosPreSapienciaMix): Promise<ApiResponse<IPagingData<IPosPreSapiencia>>>;
  createPosPreSapVinculation(posPreSapiencia: IPosPreSapiencia): Promise<ApiResponse<IPosPreSapiencia | null>>;
}

export default class PosPreSapienciaService implements IPosPreSapienciaService {
  constructor(private posPreSapienciaRepository: IPosPreSapienciaRepository) { }

  async getPosPreSapienciaById(id: number): Promise<ApiResponse<IPosPreSapiencia>> {
    const res = await this.posPreSapienciaRepository.getPosPreSapienciaById(id);

    if (!res) {
      return new ApiResponse(
        {} as IPosPreSapiencia,
        EResponseCodes.WARN,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getPosPreSapienciaPaginated(
    filters: IFiltersPosPreSapiencia
  ): Promise<ApiResponse<IPagingData<IPosPreSapiencia>>> {
    const res = await this.posPreSapienciaRepository.getPosPreSapienciaPaginated(filters);

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async createPosPreSapiencia(posPreSapiencia: IPosPreSapiencia): Promise<ApiResponse<IPosPreSapiencia>> {

    const res = await this.posPreSapienciaRepository.createPosPreSapiencia(posPreSapiencia);

    if (!res) {
      return new ApiResponse(
        {} as IPosPreSapiencia,
        EResponseCodes.FAIL,
        "Se ha encontrado un error, el código sapiencia ya existe en el sistema"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async updatePosPreSapiencia(posPreSapiencia: IPosPreSapiencia, id: number): Promise<ApiResponse<IPosPreSapiencia>> {
    const res = await this.posPreSapienciaRepository.updatePosPreSapiencia(posPreSapiencia, id);

    if (!res) {
      return new ApiResponse(
        {} as IPosPreSapiencia,
        EResponseCodes.FAIL,
        "Se ha encontrado un error, el código sapiencia ya existe en el sistema"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getAllPosPreSapiencia(): Promise<ApiResponse<IPosPreSapiencia[]>> {
    const res = await this.posPreSapienciaRepository.getAllPosPreSapiencia();

    return new ApiResponse(res, EResponseCodes.OK);
  }

  //? Actualizaciones

  async getListPosPreSapVinculationPaginated(filters: IFiltersPosPreSapienciaMix): Promise<ApiResponse<IPagingData<IPosPreSapiencia>>> {

    const res = await this.posPreSapienciaRepository.getListPosPreSapVinculationPaginated(filters);
    return new ApiResponse(res, EResponseCodes.OK);

  }

  async createPosPreSapVinculation(posPreSapiencia: IPosPreSapiencia): Promise<ApiResponse<IPosPreSapiencia | null>> {

    //?Verifiquemos el PosPre Sapi con la nueva mecánica:
    const posPreSap = posPreSapiencia.number;
    const searchPosPreSapi = await this.posPreSapienciaRepository.searchPosPreSapByNumber(posPreSap);

    console.log({searchPosPreSapi});

    if(!searchPosPreSapi){

      const res = await this.posPreSapienciaRepository.createPosPreSapVinculation(posPreSapiencia);

      return new ApiResponse(
        res,
        EResponseCodes.OK,
        "Pospre Sapiencia registrado correctamente."
      );

    }

    return new ApiResponse(
      null,
      EResponseCodes.FAIL,
      "Se ha encontrado un error, el código sapiencia ya existe en el sistema"
    );

  }

}
