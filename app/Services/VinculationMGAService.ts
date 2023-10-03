import { ApiResponse,
         IPagingData } from "App/Utils/ApiResponses";

import { EResponseCodes } from "../Constants/ResponseCodesEnum";

import { IActivityMGA,
         IVinculationMgaWithMultipleV2 } from "App/Interfaces/VinculationMGAInterfaces";
import { IFiltersVinculationMGA } from "App/Interfaces/VinculationMGAInterfaces";
import { IDesvinculationMgaV2 } from '../Interfaces/VinculationMGAInterfaces';

import { IVinculationMGARepository } from "App/Repositories/VinculationMGARepository";

export interface IVinculationMGAService {

  getVinculationMGAById(id: number): Promise<ApiResponse<IActivityMGA>>;
  getVinculationMGAPaginated(filters: IFiltersVinculationMGA): Promise<ApiResponse<IPagingData<IActivityMGA>>>;
  createVinculationWithPlanningV2(vinculationMGA: IVinculationMgaWithMultipleV2): Promise<ApiResponse<IVinculationMgaWithMultipleV2>>;
  deleteVinculationWithPlanningV2(vinculationMGA: IDesvinculationMgaV2, id: number): Promise<ApiResponse<IDesvinculationMgaV2 | boolean>>;

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

  //?Nuevo
  async createVinculationWithPlanningV2(vinculationMGA: IVinculationMgaWithMultipleV2): Promise<ApiResponse<IVinculationMgaWithMultipleV2>> {


    for( let i of vinculationMGA.elementsDetail ){

      await this.vinculationMGARepository.createVinculationWithPlanningV2(i);

    }

    return new ApiResponse(vinculationMGA, EResponseCodes.OK, "Vinculaciones realizadas.");

  }

  async deleteVinculationWithPlanningV2(vinculationMGA: IDesvinculationMgaV2, id: number): Promise<ApiResponse<IDesvinculationMgaV2 | boolean>>{

    const res = await this.vinculationMGARepository.deleteVinculationWithPlanningV2(vinculationMGA, id);

    return new ApiResponse(res, EResponseCodes.OK);

  }

}
