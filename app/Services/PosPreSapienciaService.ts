import { ApiResponse,
         IPagingData } from "App/Utils/ApiResponses";

import { EResponseCodes } from "../Constants/ResponseCodesEnum";

import { IPosPreSapiencia } from "App/Interfaces/PosPreSapienciaInterfaces";
import { IFiltersPosPreSapienciaMix } from '../Interfaces/PosPreSapienciaInterfaces';

import { IPosPreSapienciaRepository } from "App/Repositories/PosPreSapienciaRepository";

export interface IPosPreSapienciaService {

  getPosPreSapienciaById(id: number): Promise<ApiResponse<IPosPreSapiencia>>;
  getListPosPreSapVinculationPaginated(filters: IFiltersPosPreSapienciaMix): Promise<ApiResponse<IPagingData<IPosPreSapiencia>>>;
  createPosPreSapVinculation(posPreSapiencia: IPosPreSapiencia): Promise<ApiResponse<IPosPreSapiencia | any>>;
  updatePosPreSapVinculation(posPreSapiencia: IPosPreSapiencia , id: number): Promise<ApiResponse<IPosPreSapiencia | null>>;
  getAllPosPreSapiencia(): Promise<ApiResponse<IPosPreSapiencia[]>>;
  getPosPreByParamsMasive(pprNumero: string, pprEjercicio: number, ppsPosicion: number): Promise<ApiResponse<any | null>>;

}

export default class PosPreSapienciaService implements IPosPreSapienciaService {
  constructor(private posPreSapienciaRepository: IPosPreSapienciaRepository) {}

  async getPosPreSapienciaById(
    id: number
  ): Promise<ApiResponse<IPosPreSapiencia>> {
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
 
  async getPosPreByParamsMasive(
    pprNumero: string, pprEjercicio: number, ppsPosicion: number
  ): Promise<ApiResponse<IPosPreSapiencia>> {
    const res = await this.posPreSapienciaRepository.getPosPreByParamsMasive(pprNumero,pprEjercicio,ppsPosicion);

    if (!res) {
      return new ApiResponse(
        {} as IPosPreSapiencia,
        EResponseCodes.WARN,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getAllPosPreSapiencia(): Promise<ApiResponse<IPosPreSapiencia[]>> {
    const res = await this.posPreSapienciaRepository.getAllPosPreSapiencia();

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getListPosPreSapVinculationPaginated(filters: IFiltersPosPreSapienciaMix): Promise<ApiResponse<IPagingData<IPosPreSapiencia>>> {

    const res = await this.posPreSapienciaRepository.getListPosPreSapVinculationPaginated(filters);
    return new ApiResponse(res, EResponseCodes.OK);
  }

  async createPosPreSapVinculation(posPreSapiencia: IPosPreSapiencia): Promise<ApiResponse<IPosPreSapiencia | any>> {

    //?Verifiquemos el PosPre Sapi con la nueva mecánica:
    const posPreSap = posPreSapiencia.number;
    const searchPosPreSapi =
      await this.posPreSapienciaRepository.searchPosPreSapByNumber(posPreSap);

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

  async updatePosPreSapVinculation(
    posPreSapiencia: IPosPreSapiencia,
    id: number
  ): Promise<ApiResponse<IPosPreSapiencia | null>> {
    const res = await this.posPreSapienciaRepository.updatePosPreSapVinculation(
      posPreSapiencia,
      id
    );

    if (!res) {
      return new ApiResponse(
        {} as IPosPreSapiencia,
        EResponseCodes.FAIL,
        "El registro indicado no existe o el número asignado ya se encuentra registrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
