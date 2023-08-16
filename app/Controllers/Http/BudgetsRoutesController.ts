import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BudgetsRoutesProvider from "@ioc:core.BudgetsRoutesProvider";
import { IBudgetsRoutesFilters } from "App/Interfaces/BudgetsRoutesInterfaces";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import BudgetsRoutesValidator from "App/Validators/BudgetsRoutesValidator";


export default class BudgetsRoutesController {
  public async getBudgetsRoutesById({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await BudgetsRoutesProvider.getBudgetsRoutesById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getBudgetsRoutesPaginated({ request, response }: HttpContextContract) {
    try {
      const data = request.body() as IBudgetsRoutesFilters;
      return response.send(await BudgetsRoutesProvider.getBudgetsRoutesPaginated(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async createBudgetsRoutes({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(BudgetsRoutesValidator);
      return response.send(await BudgetsRoutesProvider.createBudgetsRoutes(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async updateBudgetsRoutes({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      const data = await request.validate(BudgetsRoutesValidator);
      return response.send(await BudgetsRoutesProvider.updateBudgetsRoutes(data, id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}