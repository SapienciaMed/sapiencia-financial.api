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

  public async createCdpsCertificationBudgetAvailability({
    request,
    response,
  }: HttpContextContract) {
    try {
       
      let data = await request.validate(BudgetAvailabilityValidator);
      return response.send(
        await BudgetAvailabilityProvider.createCdps(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getById({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params() as { id: string };
      return response.send(await BudgetAvailabilityProvider.getById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async cancelAmountCdp({ request, response }: HttpContextContract) {
    try {
      const { id, reasonCancellation } = request.body() as {
        id: number;
        reasonCancellation: string;
      };
      return response.send(
        await BudgetAvailabilityProvider.cancelAmountCdp(
          id,
          reasonCancellation
        )
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async associateAmountsWithCdp({ request, response }: HttpContextContract) {
    try {
      const { cdpId, amounts } = request.body() as {
        cdpId: number;
        amounts: any[];
      };
      await BudgetAvailabilityProvider.associateAmountsWithCdp(cdpId, amounts);
      return response.send(new ApiResponse("Importes asociados con éxito", EResponseCodes.OK, "null"));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
