import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import FundsProvider from "@ioc:core.FundsProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";

export default class FundsController {
  public async getFundsById({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await FundsProvider.getFundsById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
