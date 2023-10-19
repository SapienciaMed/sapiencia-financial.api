import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CdpsProvider from "@ioc:core.CdpsProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
export default class CdpsController {

    public async getAllCdpsCertificationBudgetAvailability({ response }: HttpContextContract) {
        console.log("hola mund");
        
        try {
            return response.send(await CdpsProvider.getAllCdps());
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }
    public async createCdpsCertificationBudgetAvailability({ request, response }: HttpContextContract) {
      console.log(request);

      return response.send({message: "hola mundo", info: request})
      
    }

}
