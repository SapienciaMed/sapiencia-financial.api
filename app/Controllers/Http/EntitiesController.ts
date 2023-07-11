import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import EntitiesProvider from "@ioc:core.EntitiesProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";

export default class EntitiesController {
  public async getEntities({ response }: HttpContextContract) {
    try {
      return response.send(await EntitiesProvider.getEntities());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
