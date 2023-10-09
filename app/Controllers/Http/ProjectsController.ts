import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ProjectsProvider from "@ioc:core.ProjectsProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import { IProjectFilters } from "App/Interfaces/ProjectsInterfaces";

export default class ProjectsController {

  public async getAllProjects({ response }: HttpContextContract) {

    try {

      return response.send(await ProjectsProvider.getAllProjects());

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  public async getUnrelatedProjects({request,response,}: HttpContextContract) {

    try {

      const data = request.body() as IProjectFilters;
      return response.send(await ProjectsProvider.getUnrelatedProjects(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

}
