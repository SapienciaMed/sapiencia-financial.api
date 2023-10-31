import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EResponseCodes } from 'App/Constants/ResponseCodesEnum';
import { ApiResponse } from 'App/Utils/ApiResponses';

import PacProvider from '@ioc:core.PacProvider';
import PacSubImplementsProvider from '@ioc:core.PacSubImplementsProvider';
import { DataTransferPac } from '../../Interfaces/PacTransferInterface';
import { ICreateAssociation, IEditPac } from '../../Interfaces/PacInterfaces';

import {
  IPacAnnualAdapter,
  IPacFilters
} from 'App/Interfaces/PacInterfaces';

export default class PacsController {

  public async uploadPac({ request, response }: HttpContextContract) {
    let body = request.body() as { exercise: number, typeSource: string, typePac: string, userCreate?: string, userModify?: string };
    if (!request.file('file')) {
      return response.status(400).json({ message: 'No se ha proporcionado ningún archivo' })
    }

    const file = request.file('file', {
      size: '20mb',
      extnames: ['xlsx', 'xls'],
    })

    try {
      const { id } = request.params() as { id: string };
      id;
      return response.send(await PacProvider.uploadPac(file, body));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }

  }

  public async reviewBudgetsRoute({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as any;
      return response.send(await PacProvider.reviewBudgetsRoute(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //* V2
  public async transfersOnPac({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as DataTransferPac;
      // return response.send(await PacProvider.transfersOnPac(data));
      return response.send(await PacSubImplementsProvider.transferPacRefactory(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  public async validityList({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IPacFilters;
      return response.send(await PacProvider.validityList(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  public async resourcesTypeList({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IPacFilters;
      return response.send(await PacProvider.resourcesTypeList(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  public async listDinamicsRoutes({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IPacFilters;
      return response.send(await PacProvider.listDinamicsRoutes(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  public async searchAnnualDataRoutes({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IPacAnnualAdapter;
      return response.send(await PacProvider.searchAnnualDataRoutes(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //* Vamos a devovler los diferentes listados para rellenar consultar PAC
  public async getRoutesByValidity({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IPacFilters;
      return response.send(await PacSubImplementsProvider.getRoutesByValidity(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //* Obtener última versión activa
  public async getUltimateVersion({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IPacFilters;
      return response.send(await PacSubImplementsProvider.getUltimateVersion(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //* Realizar la búsqueda del PAC
  public async searchPacs({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IPacFilters;
      return response.send(await PacSubImplementsProvider.searchPacs(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //* Listado dinámico para asociaciones
  public async listDinamicsAssociations({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IPacFilters;
      return response.send(await PacSubImplementsProvider.listDinamicsAssociations(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //* Crear una asociación
  public async createAssociations({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as ICreateAssociation;
      return response.send(await PacSubImplementsProvider.createAssociations(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //* Obtener el PAC por ID
  public async getPacById({request, response}: HttpContextContract) {

    try {

      const { id } = request.params();
      return response.send(await PacSubImplementsProvider.getPacById(id));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //* Actualizar el PAC
  public async editPac({request, response}: HttpContextContract) {

    try {

      const data = request.body() as IEditPac;
      return response.send(await PacSubImplementsProvider.editPac(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }



}
