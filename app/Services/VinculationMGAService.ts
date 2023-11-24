import {
  ApiResponse,
  IPagingData
} from "App/Utils/ApiResponses";

import { EResponseCodes } from "../Constants/ResponseCodesEnum";

import {
  IActivityMGA,
  IVinculationMgaWithMultipleV2
} from "App/Interfaces/VinculationMGAInterfaces";
import { IFiltersVinculationMGA } from "App/Interfaces/VinculationMGAInterfaces";
import { IDesvinculationMgaV2 } from '../Interfaces/VinculationMGAInterfaces';

import { IVinculationMGARepository } from "App/Repositories/VinculationMGARepository";
import { IStrategicDirectionService } from "./External/StrategicDirectionService";
import { ICDPVinculateMGA } from "App/Interfaces/ICDPVinculateMGAInterface.ts";

export interface IVinculationMGAService {

  getVinculationMGAById(id: number): Promise<ApiResponse<IActivityMGA>>;
  getVinculationMGAPaginated(filters: IFiltersVinculationMGA): Promise<ApiResponse<IPagingData<IActivityMGA>>>;
  createVinculationWithPlanningV2(vinculationMGA: IVinculationMgaWithMultipleV2): Promise<ApiResponse<IVinculationMgaWithMultipleV2>>;
  deleteVinculationWithPlanningV2(vinculationMGA: IDesvinculationMgaV2, id: number): Promise<ApiResponse<IDesvinculationMgaV2 | boolean>>;
  getActivitiesDetail(data: any): Promise<ApiResponse<any>>;
  createVinculationMga(data: ICDPVinculateMGA): Promise<ApiResponse<ICDPVinculateMGA[]>>;
  validateVinculationMga(data: any): Promise<ApiResponse<any>>;
  validateAllCdp(data: any): Promise<ApiResponse<any>>;

}

export default class VinculationMGAService implements IVinculationMGAService {
  constructor(private vinculationMGARepository: IVinculationMGARepository,
    private strategicDirectionService: IStrategicDirectionService) { }

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


    for (let i of vinculationMGA.elementsDetail) {

      await this.vinculationMGARepository.createVinculationWithPlanningV2(i);

    }

    return new ApiResponse(vinculationMGA, EResponseCodes.OK, "Vinculaciones realizadas.");

  }

  async deleteVinculationWithPlanningV2(vinculationMGA: IDesvinculationMgaV2, id: number): Promise<ApiResponse<IDesvinculationMgaV2 | boolean>> {

    const res = await this.vinculationMGARepository.deleteVinculationWithPlanningV2(vinculationMGA, id);

    return new ApiResponse(res, EResponseCodes.OK);

  }
  async getActivitiesDetail(data: any): Promise<ApiResponse<any>> {
    try {
      const datos = await this.strategicDirectionService.getActivitiesFilters(data);
      // Asume que el primer elemento es el que necesitas      


      return new ApiResponse(
        datos.data,
        EResponseCodes.OK,
        "Actividad encontrada exitosamente"
      );
    } catch (error) {
      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        "Error al cargar el CDP" + error
      );
    }
  }

  //
  async createVinculationMga(data: ICDPVinculateMGA): Promise<ApiResponse<ICDPVinculateMGA[]>> {
    try {
      // Asumiendo que `createVinculationMga` en el repositorio devuelve un arreglo de `ICDPVinculateMGA`
      const res = await this.vinculationMGARepository.createVinculationMga(data);

      // Verifica si `res` está vacío o no
      if (res.length === 0) {
        return new ApiResponse(
          [],
          EResponseCodes.FAIL,
          "No se crearon vínculos"
        );
      }

      return new ApiResponse(
        res,
        EResponseCodes.OK,
        "Vínculos creados exitosamente"
      );
    } catch (error) {
      // Manejo de errores
      return new ApiResponse(
        [],
        EResponseCodes.FAIL,
        "Error al crear vínculos: " + error.message
      );
    }
  }

  async validateVinculationMga(data: any): Promise<ApiResponse<any>> {
    try {
      // Asumiendo que `validateVinculationMga` en el repositorio devuelve un arreglo de `ICDPVinculateMGA`
      const res = await this.vinculationMGARepository.validateVinculationMga(data);

      if (res <= 0) {
        return new ApiResponse(
          [],
          EResponseCodes.FAIL,
          "No se encuentran valores del cdp"
        );
      }

      if (res > data.costMGA) {
        return new ApiResponse(
          [],
          EResponseCodes.FAIL,
          "Ya tiene esta actividad asociadas a diferentes CDPs que con esta nueva asociación da un valor mayor que el costo que tiene esa actividad."
        );
      }

      // Verifica si `res` está vacío o no
      if (res.length === 0) {
        return new ApiResponse(
          [],
          EResponseCodes.FAIL,
          "No se encontraron CDPS"
        );
      }

     
      return new ApiResponse(
        [],
        EResponseCodes.OK,
        "Se puede agregar"
      );
    
    } catch (error) {
      // Manejo de errores
      return new ApiResponse(
        [],
        EResponseCodes.FAIL,
        "Error: " + error.message
      );
    }
  }

  async validateAllCdp(data: any): Promise<ApiResponse<any>> {
    try {
      // Asumiendo que `validateVinculationMga` en el repositorio devuelve un arreglo de `ICDPVinculateMGA`
      const res = await this.vinculationMGARepository.validateAllCdp(data);

     /*  if (res <= 0) {
        return new ApiResponse(
          [],
          EResponseCodes.FAIL,
          "No se encuentran valores del cdp"
        );
      } */

      if ((res+data.valueFinal) > data.activitieCost) {
        return new ApiResponse(
          [],
          EResponseCodes.FAIL,
          "Ya tiene esta actividad asociadas a diferentes CDPs que con esta nueva asociación da un valor mayor que el costo que tiene esa actividad."
        );
      }

      if (res.length === 0) {
        return new ApiResponse(
          [],
          EResponseCodes.FAIL,
          "No se encontraron CDPS"
        );
      }
      
      return new ApiResponse(
        [],
        EResponseCodes.OK,
        "Se puede agregar"
      );

    } catch (error) {
      // Manejo de errores
      return new ApiResponse(
        [],
        EResponseCodes.FAIL,
        "Error: " + error.message
      );
    }
  }

}
