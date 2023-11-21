import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BudgetAvailabilityProvider from "@ioc:core.BudgetAvailabilityProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import BudgetAvailabilityBasicDataValidator from "App/Validators/BudgetAvailabilityBasicDataValidator";
import BudgetAvailabilityFiltersValidator from "App/Validators/BudgetAvailabilityFiltersValidator";
import BudgetAvailabilityValidator from "App/Validators/BudgetAvailabilityValidator";
import updateRouteCDPValidator from "App/Validators/updateRiutesCDPValidator";

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
      return response.send(
        await BudgetAvailabilityProvider.createCdps(data)
      );
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

  public async getBudgetAvailabilityById({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params() as { id: string };
      return response.send(await BudgetAvailabilityProvider.getBudgetAvailabilityById(id));
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
  
  public async linkMga({response }: HttpContextContract) {
    try {
      return response.send(await BudgetAvailabilityProvider.linkMga());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async associateAmountsWithCdp({ request, response }: HttpContextContract) {
    try {
      const { cdpId, amounts } = request.body();

      await BudgetAvailabilityProvider.associateAmountsWithCdp(cdpId, amounts);
      return response.send(new ApiResponse("Importes asociados con éxito", EResponseCodes.OK, "null"));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async updateRoutesCDP({request, response}: HttpContextContract){
    try {
      const { id } = request.params();
      const data = await request.validate(updateRouteCDPValidator);     

      return response.send(await BudgetAvailabilityProvider.updateRoutesCDP(data, id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
  
  public async getRouteCDPId({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params() as { id: number };
      return response.send(await BudgetAvailabilityProvider.getRouteCDPId(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  } 

  public async getRpCDP({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params() as { id: string };
      return response.send(await BudgetAvailabilityProvider.getRpCDP(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
