import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PlanningProvider from "@ioc:core.PlanningProvider";
import ProjectsProvider from "@ioc:core.ProjectsProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import { IProjectFiltersWithPlanning } from '../../Interfaces/ProjectsInterfaces';

export default class ProjectsController {

    public async getAllProjects({response}: HttpContextContract) {
        try {
            return response.send(await ProjectsProvider.getAllProjects());
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }

    //? --------------------------------------------------------------------------------
    //? --------- RE ESTRUCTURACIÓN DE TODO EL TEMA DE PROYECTOS DE INVERSIÓN ----------
    //? --------------------------------------------------------------------------------

    public async getProjectsUpdateV2({ request, response }: HttpContextContract) {

      try {

        const data = request.body() as Array<number>
        return response.send( await PlanningProvider.getProjectInvestmentByIds(data))

      } catch (error) {
        return response.badRequest(
          new ApiResponse(null, EResponseCodes.FAIL, String(error))
        );
      }

    }

    public async getProjectsNoUseOnFunctionalArea({ request, response }: HttpContextContract){

      try {

        const data = request.body() as IProjectFiltersWithPlanning;
        return response.send( await PlanningProvider.getProjectsNoUseOnFunctionalArea(data))

      } catch (error) {

        return response.badRequest(
          new ApiResponse(null, EResponseCodes.FAIL, String(error))
        );

      }

    }

}
