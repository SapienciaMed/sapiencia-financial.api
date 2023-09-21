import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EResponseCodes } from '../../Constants/ResponseCodesEnum';
import { ApiResponse } from '../../Utils/ApiResponses';

export default class FunctionalProjectsController {

  public async getFunctionalProjectPaginated({ request, response }: HttpContextContract) {

    console.log({request});
    return response.accepted(
      new ApiResponse(null, EResponseCodes.OK, "Hola desde getFunctionalProjectPaginated")
    );

  }

  public async createFunctionalProjec({ request, response }: HttpContextContract) {

    console.log({request});
    return response.accepted(
      new ApiResponse(null, EResponseCodes.OK, "Hola desde createFunctionalProjec")
    );

  }

  public async getFunctionalProjecById({ request, response }: HttpContextContract) {

    console.log({request});
    return response.accepted(
      new ApiResponse(null, EResponseCodes.OK, "Hola desde getFunctionalProjecById")
    );

  }

  public async updateFunctionalProjec({ request, response }: HttpContextContract) {

    console.log({request});
    return response.accepted(
      new ApiResponse(null, EResponseCodes.OK, "Hola desde updateFunctionalProjec")
    );

  }

  public async deleteFunctionalProjec({ request, response }: HttpContextContract) {

    console.log({request});
    return response.accepted(
      new ApiResponse(null, EResponseCodes.OK, "Hola desde deleteFunctionalProjec")
    );

  }

}
