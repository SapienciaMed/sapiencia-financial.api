import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CdpsProvider from "@ioc:core.CdpsProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import CdpsValidator from "App/Validators/CdpsValidator";
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
            let data = await request.validate(CdpsValidator)
            return response.send(await CdpsProvider.createCdps(data));
        } catch (err) {
            console.log("hola este es el error"+err);
            
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }

    }

}
