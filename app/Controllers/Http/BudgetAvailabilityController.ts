import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BudgetAvailabilityProvider from "@ioc:core.BudgetAvailabilityProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import BudgetAvailabilityBasicDataValidator from "App/Validators/BudgetAvailabilityBasicDataValidator";
import BudgetAvailabilityFiltersValidator from "App/Validators/BudgetAvailabilityFiltersValidator";
import BudgetAvailabilityValidator from "App/Validators/BudgetAvailabilityValidator";

export default class BudgetAvailabilityController {
  /**
   * @swagger
   * /api/v1/cdp/search-cdps:
   * post:
   *     tags:
   *       - CDP
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           description: User payload
   *           schema:
   *             type: object
   *             properties:
   *               dateOfCdp:
   *                 type: string
   *                 example: '2023'
   *                 required: true
   *               page:
   *                 type: number
   *                 example: 1
   *               perPage:
   *                 type: number
   *                 example: 20
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cdp'
   */
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
      return response.send(await BudgetAvailabilityProvider.createCdps(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
  public async editBudgetAvailabilityBasicDataCDP({
    request,
    response,
  }: HttpContextContract) {
    try {
      const { id } = request.params();
      const data = await request.validate(BudgetAvailabilityBasicDataValidator);
      return response.send(
        await BudgetAvailabilityProvider.editBudgetAvailabilityBasicDataCDP(
          id,
          data
        )
      );
    } catch (error) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(error))
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
        await BudgetAvailabilityProvider.cancelAmountCdp(id, reasonCancellation)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
