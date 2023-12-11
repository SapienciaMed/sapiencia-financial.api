import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import FundsProvider from "@ioc:core.FundsProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IFundsFilters } from "App/Interfaces/FundsInterfaces";
import { ApiResponse } from "App/Utils/ApiResponses";
import FundsValidator from "App/Validators/FundsValidator";

export default class FundsController {
  public async getFundsById({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await FundsProvider.getFundsById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getFundsPaginated({ request, response }: HttpContextContract) {
    try {
      const data = request.body() as IFundsFilters;
      return response.send(await FundsProvider.getFundsPaginated(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
  
  public async createFund({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(FundsValidator);
      return response.send(await FundsProvider.createFund(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async updateFund({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      const data = await request.validate(FundsValidator);
      return response.send(await FundsProvider.updateFund(data, id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getAllFunds({ response }: HttpContextContract) {
    try {
      return response.send(await FundsProvider.getAllFunds());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
  public async getAllFundsByNumber({ request, response }: HttpContextContract) {
    try {
      return response.send(await FundsProvider.verifyFunds(request['requestBody'].numero));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    } 
  }
}
