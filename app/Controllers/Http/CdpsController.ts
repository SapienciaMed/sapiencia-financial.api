import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CdpsProvider from "@ioc:core.CdpsProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
export default class CdpsController {

    public async getAllCdpsCertificationBudgetAvailability({ response }: HttpContextContract) {
        
        
        try {
            return response.send(await CdpsProvider.getAllCdps());
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }
    public async createCdpsCertificationBudgetAvailability({ request, response }: HttpContextContract) {
        try {
            let data = await request.validate(// le pasas el validaddor)
            return response.send(await CdpsProvider.createCdps(data));
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }

    }

}
