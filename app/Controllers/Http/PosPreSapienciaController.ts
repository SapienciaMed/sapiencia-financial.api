import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PosPreSapienciaProvider from "@ioc:core.PosPreSapienciaProvider";

import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";

import { IFiltersPosPreSapienciaMix,
         IPosPreSapiencia } from '../../Interfaces/PosPreSapienciaInterfaces';

export default class PosPreSapienciaController {

  public async getPosPreSapienciaById({ request, response }: HttpContextContract) {

    try {

      const { id } = request.params();
      return response.send(await PosPreSapienciaProvider.getPosPreSapienciaById(id));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }
  public async getPosPreByParamsMasive({ request, response }: HttpContextContract) {

    try {

      const { pprNumero, pprEjercicio, ppsPosicion } = request['requestBody'];
      return response.send(await PosPreSapienciaProvider.getPosPreByParamsMasive(pprNumero,pprEjercicio,ppsPosicion));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  public async getAllPosPreSapiencia({ response }: HttpContextContract) {

    try {

      return response.send(await PosPreSapienciaProvider.getAllPosPreSapiencia());

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //? ---------------------------------------------------------------------------
  //? ---------- RE ESTRUCTURACIÓN DE TODO EL TEMA DE POSPRE SAPIENCIA ----------
  //? ---------------------------------------------------------------------------

  public async getListPosPreSapVinculationPaginated({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IFiltersPosPreSapienciaMix;
      return response.send(await PosPreSapienciaProvider.getListPosPreSapVinculationPaginated(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  public async createPosPreSapVinculation({ request, response }: HttpContextContract) {

    try {

      const body = request.body() as IPosPreSapiencia;
      return response.send(await PosPreSapienciaProvider.createPosPreSapVinculation(body));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  public async updatePosPreSapVinculation({ request, response }: HttpContextContract) {

    try {

      const { id } = request.params();
      const data = request.body() as IPosPreSapiencia;
      return response.send(await PosPreSapienciaProvider.updatePosPreSapVinculation(data, id));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }


}
