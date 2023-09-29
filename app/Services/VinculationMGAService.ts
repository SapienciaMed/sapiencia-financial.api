import { ApiResponse,
         IPagingData } from "App/Utils/ApiResponses";

import { EResponseCodes } from "../Constants/ResponseCodesEnum";

import { IActivityMGA,
         IVinculationMgaWithMultipleV2 } from "App/Interfaces/VinculationMGAInterfaces";

import { IFiltersVinculationMGA } from "App/Interfaces/VinculationMGAInterfaces";

import { IVinculationMGARepository } from "App/Repositories/VinculationMGARepository";
import { IDesvinculationMgaWithMultipleV2 } from '../Interfaces/VinculationMGAInterfaces';

export interface IVinculationMGAService {

  getVinculationMGAById(id: number): Promise<ApiResponse<IActivityMGA>>;
  getVinculationMGAPaginated(filters: IFiltersVinculationMGA): Promise<ApiResponse<IPagingData<IActivityMGA>>>;

  //? Nuevo
  createVinculationWithPlanningV2(vinculationMGA: IVinculationMgaWithMultipleV2): Promise<ApiResponse<IVinculationMgaWithMultipleV2>>;
  deleteVinculationWithPlanningV2(vinculationMGA: IDesvinculationMgaWithMultipleV2): Promise<ApiResponse<IDesvinculationMgaWithMultipleV2>>;

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

  async deleteVinculationWithPlanningV2(vinculationMGA: IDesvinculationMgaWithMultipleV2): Promise<ApiResponse<IDesvinculationMgaWithMultipleV2>> {

    for( let i of vinculationMGA.elementsDetail ){

      await this.vinculationMGARepository.deleteVinculationWithPlanningV2(i);

    }

    return new ApiResponse(vinculationMGA, EResponseCodes.OK, "Desvinculaciones realizadas.");

  }

}
