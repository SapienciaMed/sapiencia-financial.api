import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ManagementCenterProvider from "@ioc:core.ManagementCenterProvider";
import { IManagementCenterFilters } from "App/Interfaces/ManagementCenterInterfaces";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";


export default class ManagementCenterController {
    public async getManagementCenterById({ request, response }: HttpContextContract) {
        try {
          const { id } = request.params();
          return response.send(await ManagementCenterProvider.getManagementCenterById(id));
        } catch (err) {
          return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
          );
        }
      }
    
      public async getManagementCenterPaginated({ request, response }: HttpContextContract) {
        try {
          const data = request.body() as IManagementCenterFilters;
          return response.send(await ManagementCenterProvider.getManagementCenterPaginated(data));
        } catch (err) {
          return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
          );
        }
      }

    }