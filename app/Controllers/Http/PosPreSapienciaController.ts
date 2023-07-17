import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PosPreSapienciaProvider from "@ioc:core.PosPreSapienciaProvider";
import { IFiltersPosPreSapiencia } from "App/Interfaces/PosPreSapienciaInterfaces";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import PosPreSapienciaValidator from "App/Validators/PosPreSapienciaValidator";

export default class PosPreSapienciaController {
    public async getPosPreSapienciaById({ request, response }: HttpContextContract) {
        try {
          const { id } = request.params();
          return response.send(await PosPreSapienciaProvider.getPosPreSapienciaById(id));
        } catch (err) {
          return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
          );
        }
      }
    
      public async getPosPreSapienciaPaginated({ request, response }: HttpContextContract) {
        try {
          const data = request.body() as IFiltersPosPreSapiencia;
          return response.send(await PosPreSapienciaProvider.getPosPreSapienciaPaginated(data));
        } catch (err) {
          return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
          );
        }
      }
      
      public async createPosPreSapiencia({ request, response }: HttpContextContract) {
        try {
          const data = await request.validate(PosPreSapienciaValidator);
          return response.send(await PosPreSapienciaProvider.createPosPreSapiencia(data));
        } catch (err) {
          return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
          );
        }
      }
    
      public async updatePosPreSapiencia({ request, response }: HttpContextContract) {
        try {
          const { id } = request.params();
          const data = await request.validate(PosPreSapienciaValidator);
          return response.send(await PosPreSapienciaProvider.updatePosPreSapiencia(data, id));
        } catch (err) {
          return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
          );
        }
      }
}