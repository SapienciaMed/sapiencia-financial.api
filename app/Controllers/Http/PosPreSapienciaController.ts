import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PosPreSapienciaProvider from "@ioc:core.PosPreSapienciaProvider";
// import { IFiltersPosPreSapiencia } from "App/Interfaces/PosPreSapienciaInterfaces";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import PosPreSapienciaValidator from "App/Validators/PosPreSapienciaValidator";
import { IFiltersPosPreSapienciaMix, IPosPreSapiencia } from '../../Interfaces/PosPreSapienciaInterfaces';

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

  // public async getPosPreSapienciaPaginated({ request, response }: HttpContextContract) {
  //   try {
  //     const data = request.body() as IFiltersPosPreSapiencia;
  //     return response.send(await PosPreSapienciaProvider.getPosPreSapienciaPaginated(data));
  //   } catch (err) {
  //     return response.badRequest(
  //       new ApiResponse(null, EResponseCodes.FAIL, String(err))
  //     );
  //   }
  // }

  // public async createPosPreSapiencia({ request, response }: HttpContextContract) {
  //   try {
  //     const data = await request.validate(PosPreSapienciaValidator);
  //     return response.send(await PosPreSapienciaProvider.createPosPreSapiencia(data));
  //   } catch (err) {
  //     return response.badRequest(
  //       new ApiResponse(null, EResponseCodes.FAIL, String(err))
  //     );
  //   }
  // }

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

      const body = await request.validate(PosPreSapienciaValidator);
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
