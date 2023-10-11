import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EResponseCodes } from 'App/Constants/ResponseCodesEnum';
import { ApiResponse } from 'App/Utils/ApiResponses';
import PacProvider from '@ioc:core.PacProvider'
import { IPacFilters } from 'App/Interfaces/PacInterfaces';
// import { IReviewBudgetRoute } from '../../Interfaces/PacInterfaces';

export default class PacsController {

    public async uploadPac({request, response}:HttpContextContract){
        let body = request.body() as { exercise: number, typeSource:string,typePac:string };
        if (!request.file('file')) {
            return response.status(400).json({ message: 'No se ha proporcionado ningún archivo' })
        }

        const file = request.file('file', {
            size: '20mb',
            extnames: ['xlsx', 'xls'],
         })

        try {
            const { id } = request.params() as {id:string};
            id;
            return response.send(await PacProvider.uploadPac(file,body));
          } catch (err) {
            return response.badRequest(
              new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
          }


    }

    public async reviewBudgetsRoute({request, response}:HttpContextContract){

      try {

        const data = request.body() as any;
        return response.send(await PacProvider.reviewBudgetsRoute(data));

      } catch (err) {

        return response.badRequest(
          new ApiResponse(null, EResponseCodes.FAIL, String(err))
        );

      }

    }

    public async transfersOnPac({request,response}: HttpContextContract) {

      try {

        const data = request.body() as any; //TODO - Pendiente ajustar este any
        return response.send(await PacProvider.transfersOnPac(data));

      } catch (err) {

        return response.badRequest(
          new ApiResponse(null, EResponseCodes.FAIL, String(err))
        );

      }

    }

    public async validityList({request,response}: HttpContextContract) {

      try {

        const data = request.body() as IPacFilters;
        return response.send(await PacProvider.validityList(data));

      } catch (err) {

        return response.badRequest(
          new ApiResponse(null, EResponseCodes.FAIL, String(err))
        );

      }

    }

    public async resourcesTypeList({request,response}: HttpContextContract) {

      try {

        const data = request.body() as IPacFilters;
        return response.send(await PacProvider.resourcesTypeList(data));

      } catch (err) {

        return response.badRequest(
          new ApiResponse(null, EResponseCodes.FAIL, String(err))
        );

      }

    }

    public async listDinamicsRoutes({request,response}: HttpContextContract) {

      try {

        const data = request.body() as IPacFilters;
        return response.send(await PacProvider.listDinamicsRoutes(data));

      } catch (err) {

        return response.badRequest(
          new ApiResponse(null, EResponseCodes.FAIL, String(err))
        );

      }

    }


}
