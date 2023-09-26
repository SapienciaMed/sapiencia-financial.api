import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EResponseCodes } from '../../Constants/ResponseCodesEnum';
import { ApiResponse } from '../../Utils/ApiResponses';
import FunctionalProjectValidator from 'App/Validators/FunctionalProjectValidator';
import FunctionalProjectRepository from '@ioc:core.FunctionalProjectProvider'
import { IFunctionalProject } from 'App/Interfaces/FunctionalProjectInterfaces';

export default class FunctionalProjectsController {

  public async getFunctionalProjectPaginated({ response }: HttpContextContract) {

    const resp = await FunctionalProjectRepository.getFunctionalProjectPaginated()
    return response.accepted(
      new ApiResponse(resp, EResponseCodes.OK, "Proyectos encontrados")
    );

  }

  public async createFunctionalProject({ request, response }: HttpContextContract) {

    const data:IFunctionalProject = await request.validate(FunctionalProjectValidator)
    const resp = await FunctionalProjectRepository.createFunctionalProject(data)


    return response.accepted(
      new ApiResponse(resp, EResponseCodes.OK, "¡Proyecto guardado exitosamente!")
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
