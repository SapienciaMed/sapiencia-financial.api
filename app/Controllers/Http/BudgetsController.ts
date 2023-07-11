import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BudgetsProvider from "@ioc:core.BudgetsProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";

export default class BudgetsController {
  public async getBudgetsById({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await BudgetsProvider.getBudgetsById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }


//    public async deleteBudgets({ request, response }: HttpContextContract) {
//     try {
//       const { id } = request.params();
//       return response.send(await BudgetsProvider.deleteBudgets(id));
//     } catch (err) {
//       return response.badRequest(
//         new ApiResponse(null, EResponseCodes.FAIL, String(err))
//       );
//     }
//   }

//   public async updateBudgets({ request, response }: HttpContextContract) {
//     try {
//       const { id } = request.params();
//       const data = await request.validate(BudgetsValidator);
//       return response.send(await BudgetsProvider.updateBudgets(data, id));
//     } catch (err) {
//       return response.badRequest(
//         new ApiResponse(null, EResponseCodes.FAIL, String(err))
//       );
//     }
//   }

//   public async createBudgets({ request, response }: HttpContextContract) {
//     try {
//       const data = await request.validate(BudgetsValidator);
//       return response.send(await BudgetsProvider.createBudgets(data));
//     } catch (err) {
//       return response.badRequest(
//         new ApiResponse(null, EResponseCodes.FAIL, String(err))
//       );
//     }
//   }
}
