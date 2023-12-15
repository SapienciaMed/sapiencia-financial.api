import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UploadMasiveProvider from "@ioc:core.UploadMasiveProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";

export default class UploadMasiveController {

  public async redirectToUploadMasive({ request , response }: HttpContextContract) {

    const { documentType, fileContent,usuarioCreo,mes,ejercicio, aditionalData } = request.body();

    try {

      return response.send(await UploadMasiveProvider.initialRedirect(documentType, fileContent,usuarioCreo,mes,ejercicio,aditionalData));

    } catch (err) {

      return response.badRequest(new ApiResponse(null, EResponseCodes.FAIL, String(err)));

    }
  }

}
