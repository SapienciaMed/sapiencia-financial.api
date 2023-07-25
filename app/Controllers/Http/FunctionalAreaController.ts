import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import FuncitonalAreaProvider from "@ioc:core.FunctionalAreaProvider";
import { IFunctionalAreaFilters } from "App/Interfaces/FunctionalAreaInterfaces";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";


export default class FunctionalAreaController {
    public async getFunctionalAreaById({ request, response }: HttpContextContract) {
        try {
          const { id } = request.params();
          return response.send(await FuncitonalAreaProvider.getFunctionalAreaById(id));
        } catch (err) {
          return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
          );
        }
      }
    
      public async getFunctionalAreaPaginated({ request, response }: HttpContextContract) {
        try {
          const data = request.body() as IFunctionalAreaFilters;
          return response.send(await FuncitonalAreaProvider.getFunctionalAreaPaginated(data));
        } catch (err) {
          return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
          );
        }
      }

    }