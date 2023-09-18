import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import TransfersProvider from "@ioc:core.TransfersProvider";
import { ITransfersFilters, ITransfersWithMovements } from '../../Interfaces/TransfersInterfaces';

export default class TransfersController {

  public async getTransfersPaginated({request, response}: HttpContextContract) {

    try {

      const data = request.body() as ITransfersFilters;
      return response.send(await TransfersProvider.getTransfersPaginated(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  public async getAllTransfersByDistrict({request, response}: HttpContextContract) {

    console.log(request);
    return response.badRequest(
      new ApiResponse(null, EResponseCodes.INFO, "Hola desde getAllTransfersByDistrict")
    );

  }

  public async getAllTransfersBySapiencia({request, response}: HttpContextContract) {

    console.log(request);
    return response.badRequest(
      new ApiResponse(null, EResponseCodes.INFO, "Hola desde getAllTransfersBySapiencia")
    );

  }

  //?VALIDACIÓN DE TRASLADO CON SUS MOVIMIENTOS EN PARALELO
  //! IMPORTANTE => Este nos servirá para las validaciones que no se harán en FRONT.
  public async createTransfers({request, response}: HttpContextContract) {

    try {

      const transfer = request.body() as ITransfersWithMovements;
      return response.send(
        await TransfersProvider.createTransfers(transfer)
      );

    } catch (error) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(error))
      );

    }

  }

  //?CREACIÓN DE ADICIÓN CON SUS MOVIMIENTOS EN PARALELO
  //! IMPORTANTE => ESTE REALIZARÁ LA ACCIÓN DE GUARDAR LUEGO VALIDADOS DATOS FRONT
  public async executeCreateTransfers({request, response}: HttpContextContract) {

    try {

      const transfer = request.body() as ITransfersWithMovements;
      return response.send(
        await TransfersProvider.executeCreateTransfers(transfer)
      );

    } catch (error) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(error))
      );

    }

  }

  public async getTransferById({request, response}: HttpContextContract) {

    console.log(request);
    return response.badRequest(
      new ApiResponse(null, EResponseCodes.INFO, "Hola desde getTransferById")
    );

  }

  public async getProjectsList({request, response}: HttpContextContract) {

    console.log(request);
    return response.badRequest(
      new ApiResponse(null, EResponseCodes.INFO, "Hola desde getProjectsList")
    );

  }

  public async getFundsList({request, response}: HttpContextContract) {

    console.log(request);
    return response.badRequest(
      new ApiResponse(null, EResponseCodes.INFO, "Hola desde getFundsList")
    );

  }

  public async getPosPreList({request, response}: HttpContextContract) {

    console.log(request);
    return response.badRequest(
      new ApiResponse(null, EResponseCodes.INFO, "Hola desde getPosPreList")
    );

  }

  public async getPosPreSapienciaList({request, response}: HttpContextContract) {

    console.log(request);
    return response.badRequest(
      new ApiResponse(null, EResponseCodes.INFO, "Hola desde getPosPreSapienciaList")
    );

  }

  public async updateTransferWithMov({request, response}: HttpContextContract) {

    console.log(request);
    return response.badRequest(
      new ApiResponse(null, EResponseCodes.INFO, "Hola desde updateTransferWithMov")
    );

  }

  public async executeUpdateTransferWithMov({request, response}: HttpContextContract) {

    console.log(request);
    return response.badRequest(
      new ApiResponse(null, EResponseCodes.INFO, "Hola desde executeUpdateTransferWithMov")
    );

  }

}
