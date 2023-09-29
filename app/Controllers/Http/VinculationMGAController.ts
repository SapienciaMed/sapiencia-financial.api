import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import VinculationMGAProvider from "@ioc:core.VinculationMGAProvider";

import {
  IFiltersVinculationMGA,
  IVinculationMgaWithMultipleV2
} from "App/Interfaces/VinculationMGAInterfaces";

import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
// import VinculationMGAValidator from "App/Validators/VinculationMGAValidator";
import PlanningProvider from "@ioc:core.PlanningProvider";
import { IDesvinculationMgaWithMultipleV2 } from '../../Interfaces/VinculationMGAInterfaces';

export default class VinculationMGAController {

  public async getVinculationMGAById({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await VinculationMGAProvider.getVinculationMGAById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getVinculationMGAPaginated({ request, response }: HttpContextContract) {
    try {
      const data = request.body() as IFiltersVinculationMGA;
      return response.send(await VinculationMGAProvider.getVinculationMGAPaginated(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  //? -------------------------------------------------------------------------
  //? --------- RE ESTRUCTURACIÓN DE TODO EL TEMA DE VINCULACIÓN MGA ----------
  //? -------------------------------------------------------------------------

  //? Obtenga todas las actividades detallas de planeación
  public async getDetailedActivitiesV2({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as Array<number>
      return response.send(await PlanningProvider.getDetailedActivitiesByIds(data))

    } catch (error) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(error))
      );
    }

  }

  //? Obtenga actividades detalladas de Planación << NO >> asociadas al PosPre Origen proporcionado
  public async getDetailedActivitiesNoUseOnPosPre({ request, response }: HttpContextContract) {

    try {

      const { pospreorgid } = request.params();
      const data = request.body() as Array<number>
      return response.send(await PlanningProvider.getDetailedActivitiesNoUseOnPosPre(data, pospreorgid))

    } catch (error) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(error))
      );
    }

  }

  //? Obtenga actividades detalladas de Planación << SI >> asociadas al PosPre Origen proporcionado
  public async getDetailedActivitiesYesUseOnPosPre({ request, response }: HttpContextContract) {

    try {

      const { pospreorgid } = request.params();
      const data = request.body() as Array<number>
      return response.send(await PlanningProvider.getDetailedActivitiesYesUseOnPosPre(data, pospreorgid))

    } catch (error) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(error))
      );
    }

  }

  //? Creación de vinculación MGA
  public async createVinculationWithPlanningV2({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IVinculationMgaWithMultipleV2;
      return response.send(await VinculationMGAProvider.createVinculationWithPlanningV2(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //? Eliminación de vinculación MGA
  public async deleteVinculationWithPlanningV2({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IDesvinculationMgaWithMultipleV2;
      return response.send(await VinculationMGAProvider.deleteVinculationWithPlanningV2(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //? Obtener Vinculación MGA por ID
  public async getVinculationDetailedActivitiesV2ById({ request, response }: HttpContextContract) {

    try {

      const { id } = request.params();
      return response.send(await PlanningProvider.getVinculationDetailedActivitiesV2ById(id));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }



}
