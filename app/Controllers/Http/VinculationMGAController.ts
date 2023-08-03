import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import VinculationMGAProvider from "@ioc:core.VinculationMGAProvider";
import { IFiltersVinculationMGA } from "App/Interfaces/VinculationMGAInterfaces";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import VinculationMGAValidator from "App/Validators/VinculationMGAValidator";

export default class VinculationMGAController {
    public async getVinculationMGAById({ request, response }: HttpContextContract) {
        try {
          const { id } = request.params();
          return response.send(await VinculationMGAProvider.getVinculationMGAById(id));
        } catch (err) {
          return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
          );
        }
      }
    
      public async getVinculationMGAPaginated({ request, response }: HttpContextContract) {
        try {
          const data = request.body() as IFiltersVinculationMGA;
          return response.send(await VinculationMGAProvider.getVinculationMGAPaginated(data));
        } catch (err) {
          return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
          );
        }
      }
      
      public async createVinculationMGA({ request, response }: HttpContextContract) {
        try {
          const data = await request.validate(VinculationMGAValidator);
          return response.send(await VinculationMGAProvider.createVinculationMGA(data));
        } catch (err) {
          return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
          );
        }
      }

      public async deleteVinculationMGA({ request, response }: HttpContextContract) {
        try {
          const data = await request.validate(VinculationMGAValidator);
          return response.send(await VinculationMGAProvider.deleteVinculationMGA(data));
        } catch (err) {
          return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
          );
        }
      }
}