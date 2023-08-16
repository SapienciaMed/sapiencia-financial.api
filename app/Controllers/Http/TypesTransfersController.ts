import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import TypesTransfersProvider from "@ioc:core.TypesTransfersProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";

export default class TypesTransfersController {
  public async getTypeTransfers({ response }: HttpContextContract) {
    try {
      return response.send(await TypesTransfersProvider.getTypeTransfers());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
