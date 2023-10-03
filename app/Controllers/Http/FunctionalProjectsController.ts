import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EResponseCodes } from '../../Constants/ResponseCodesEnum';
import { ApiResponse } from '../../Utils/ApiResponses';
import FunctionalProjectValidator from 'App/Validators/FunctionalProjectValidator';
import FunctionalProjectRepository from '@ioc:core.FunctionalProjectProvider'
import { IFunctionalProject, IFunctionalProjectFilters } from 'App/Interfaces/FunctionalProjectInterfaces';

export default class FunctionalProjectsController {

  public async getFunctionalProjectPaginated({ request, response }: HttpContextContract) {
    
    try {
      const data = request.body() as IFunctionalProjectFilters;
      return response.send(await FunctionalProjectRepository.getFunctionalProjectPaginated(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }  


  }

  public async createFunctionalProject({ request, response }: HttpContextContract) {
    const now = new Date();
    const data:IFunctionalProject = await request.validate(FunctionalProjectValidator)
    data.dateCreate = `${now}`
    const resp = await FunctionalProjectRepository.createFunctionalProject(data)

    return response.accepted(
      new ApiResponse(resp, EResponseCodes.OK, "¡Proyecto guardado exitosamente!")
    );

  }

  public async getFunctionalProjectById({ request, response }: HttpContextContract) {

    try {
      const { id } = request.params();
      return response.send(await FunctionalProjectRepository.getFunctionalProjectById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }

  }
  public async updateFunctionalProject({ request, response }: HttpContextContract) {

    try {
      const { id } = request.params();
      const data = await request.validate(FunctionalProjectValidator);
      
      const resp =  await FunctionalProjectRepository.updateFunctionalProject(data, id);
      return response.accepted(
        new ApiResponse(resp, EResponseCodes.OK, "¡Proyecto guardado exitosamente!")
      );
    
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }

  }

  public async deleteFunctionalProjec({ request, response }: HttpContextContract) {

    console.log({request});
    return response.accepted(
      new ApiResponse(null, EResponseCodes.OK, "Hola desde deleteFunctionalProjec")
    );

  }

}
