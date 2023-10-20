import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BudgetAvailabilityProvider from "@ioc:core.BudgetAvailabilityProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import BudgetAvailabilityFiltersValidator from "App/Validators/BudgetAvailabilityFiltersValidator";
import BudgetAvailabilityValidator from "App/Validators/BudgetAvailabilityValidator";

export default class BudgetAvailabilityController {
  public async searchBudgetAvailability({
    request,
    response,
  }: HttpContextContract) {
    try {
      const data = await request.validate(BudgetAvailabilityFiltersValidator);
      return response.send(
        await BudgetAvailabilityProvider.searchBudgetAvailability(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async createCdpsCertificationBudgetAvailability({ request, response }: HttpContextContract) {
    try {
        let data = await request.validate(BudgetAvailabilityValidator)
        return response.send(await BudgetAvailabilityProvider.createCdps(data));
    } catch (err) {
        return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
        );
    }

}

}
