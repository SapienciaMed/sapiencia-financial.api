import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CdpsProvider from "@ioc:core.CdpsProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ICdps } from "App/Interfaces/CdpsInterfaces";
import { ApiResponse } from "App/Utils/ApiResponses";
export default class CdpsController {

    public async searchCdpsCertificationBudgetAvailability({ request, response }: HttpContextContract) {
        try {
            const data = request.body() as ICdps
            return response.send(await CdpsProvider.searchCdps(data));
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }

}