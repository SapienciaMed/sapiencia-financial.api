import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import FuncitonalAreaProvider from "@ioc:core.FunctionalAreaProvider";
import { IFunctionalAreaFilters } from "App/Interfaces/FunctionalAreaInterfaces";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import FunctionalAreaValidator from "App/Validators/FunctionalAreaValidator";
import ProjectsVinculationValidator, { ProjectsVinculationEditValidator } from "App/Validators/ProjectsVinculationValidator";
import { IProjectsVinculateFilters } from "App/Interfaces/ProjectsVinculationInterfaces";


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

  public async createFunctionalArea({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(FunctionalAreaValidator);
      return response.send(await FuncitonalAreaProvider.createFunctionalArea(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async updateFunctionalArea({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      const data = await request.validate(FunctionalAreaValidator);
      return response.send(await FuncitonalAreaProvider.updateFunctionalArea(data, id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async createProjectFunctionalArea({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(ProjectsVinculationValidator);
      return response.send(await FuncitonalAreaProvider.createProjectFunctionalArea(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async updateProjectFunctionalArea({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(ProjectsVinculationEditValidator);
      return response.send(await FuncitonalAreaProvider.updateProjectFunctionalArea(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async deleteProjectFunctionalArea({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await FuncitonalAreaProvider.deleteProjectFunctionalArea(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }


  public async getProjectFunctionalAreaPaginated({ request, response }: HttpContextContract) {
    try {
      const data = request.body() as IProjectsVinculateFilters;
      return response.send(await FuncitonalAreaProvider.getProjectFunctionalAreaPaginated(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getAllFunctionalAreas({ response }: HttpContextContract) {
    try {
      return response.send(await FuncitonalAreaProvider.getAllFunctionalAreas());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}