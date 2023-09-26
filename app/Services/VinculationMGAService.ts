import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IActivityMGA } from "App/Interfaces/VinculationMGAInterfaces";
import { IFiltersVinculationMGA/*, IVinculationMGA*/, ICrudVinculation } from "App/Interfaces/VinculationMGAInterfaces";
import { IVinculationMGARepository } from "App/Repositories/VinculationMGARepository";
import { IVinculationMgaV2 } from '../Interfaces/VinculationMGAInterfaces';

export interface IVinculationMGAService {

  getVinculationMGAById(id: number): Promise<ApiResponse<IActivityMGA>>;
  getVinculationMGAPaginated(filters: IFiltersVinculationMGA): Promise<ApiResponse<IPagingData<IActivityMGA>>>;
  // createVinculationMGA(vinculationMGA: ICrudVinculation): Promise<ApiResponse<IVinculationMGA[]>>;
  deleteVinculationMGA(id: ICrudVinculation): Promise<ApiResponse<boolean>>;

  //? Nuevo
  createVinculationWithPlanningV2(vinculationMGA: IVinculationMgaV2): Promise<ApiResponse<IVinculationMgaV2>>;

}

export default class VinculationMGAService implements IVinculationMGAService {
  constructor(private vinculationMGARepository: IVinculationMGARepository) { }

  async getVinculationMGAById(id: number): Promise<ApiResponse<IActivityMGA>> {
    const res = await this.vinculationMGARepository.getVinculationMGAById(id);

    if (!res) {
      return new ApiResponse(
        {} as IActivityMGA,
        EResponseCodes.WARN,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getVinculationMGAPaginated(
    filters: IFiltersVinculationMGA
  ): Promise<ApiResponse<IPagingData<IActivityMGA>>> {
    const res = await this.vinculationMGARepository.getVinculationMGAPaginated(filters);

    return new ApiResponse(res, EResponseCodes.OK);
  }

  // async createVinculationMGA(vinculationMGA: ICrudVinculation): Promise<ApiResponse<IVinculationMGA[]>> {
  //   const res = await this.vinculationMGARepository.createVinculationMGA(vinculationMGA);
  //   return new ApiResponse(res, EResponseCodes.OK);
  // }

  async deleteVinculationMGA(vinculationMGA: ICrudVinculation): Promise<ApiResponse<boolean>> {
    const res = await this.vinculationMGARepository.deleteVinculationMGA(vinculationMGA);

    if (!res) {
      return new ApiResponse(
        false,
        EResponseCodes.FAIL,
        "El registro indicado no existe"
      );
    }

    return new ApiResponse(true, EResponseCodes.OK);
  }

  //?Nuevo
  async createVinculationWithPlanningV2(vinculationMGA: IVinculationMgaV2): Promise<ApiResponse<IVinculationMgaV2>> {

    const res = await this.vinculationMGARepository.createVinculationWithPlanningV2(vinculationMGA);
    return new ApiResponse(res, EResponseCodes.OK);

  }

}
