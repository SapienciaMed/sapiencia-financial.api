import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IAdditionsFilters , IAdditionsWithMovements } from "App/Interfaces/AdditionsInterfaces";
import { ApiResponse } from "App/Utils/ApiResponses";
import AdditionsProvider from "@ioc:core.AdditionsProvider";
// import AdditionsValidator from "App/Validators/AdditionsValidator";
import { IProjectAdditionFilters } from '../../Interfaces/AdditionsInterfaces';

export default class AdditionsController {

  //?OBTENER PAGINADO Y FILTRADO LAS ADICIONES CON SUS MOVIMIENTOS
  public async getAdditionsPaginated({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IAdditionsFilters;
      return response.send(await AdditionsProvider.getAdditionsPaginated(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //?OBTENER LISTADO GENERAL DE ADICIONES POR ACTO ADMIN DISTRITO
  public async getAllAdditionsByDistrict({ response }: HttpContextContract) {

    try {

      const list: string = "district";
      return response.send(await AdditionsProvider.getAllAdditionsList(list));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //?OBTENER LISTADO GENERAL DE ADICIONES POR ACTO ADMIN SAPIENCIA
  public async getAllAdditionsBySapiencia({ response }: HttpContextContract) {

    try {

      const list: string = "sapiencia";
      return response.send(await AdditionsProvider.getAllAdditionsList(list));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //?CREACIÓN DE ADICIÓN CON SUS MOVIMIENTOS EN PARALELO
  //! IMPORTANTE => Este nos servirá para las validaciones que no se harán en FRONT.
  public async createAdditions({ request, response }: HttpContextContract) {

      try {

        const addition = request.body() as IAdditionsWithMovements;
        return response.send(
          await AdditionsProvider.createAdditions(addition)
        );

      } catch (error) {

        return response.badRequest(
          new ApiResponse(null, EResponseCodes.FAIL, String(error))
        );

      }

  }

  //?CREACIÓN DE ADICIÓN CON SUS MOVIMIENTOS EN PARALELO
  //! IMPORTANTE => ESTE REALIZARÁ LA ACCIÓN DE GUARDAR LUEGO VALIDADOS DATOS FRONT
  public async executeCreateAdditions({ request, response }: HttpContextContract) {

    try {

      const addition = request.body() as IAdditionsWithMovements;
      return response.send(
        await AdditionsProvider.executeCreateAdditions(addition)
      );

    } catch (error) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(error))
      );

    }

}

  //?OBTENER UNA ADICIÓN CON SUS MOVIMIENTOS EN PARALELO A TRAVÉS DE UN ID PARAM
  public async getAdditionById({ response, request }: HttpContextContract) {

    try {

      const { id } = request.params();
      return response.send(await AdditionsProvider.getAdditionById(id));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }



  //?OBTENER LISTADO DE FONDOS
  public async getFundsList({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IProjectAdditionFilters;

      return response.send(await AdditionsProvider.getFundsList(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //?OBTENER POS PRE - COMBINAMOS RESULTADO DE POS PRE SAPIENCIA CON BUDGETS
  public async getPosPreList({ response }: HttpContextContract) {

    try {

      return response.send(await AdditionsProvider.getPosPreList());

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //?OBTENER LISTADO DE POS PRE SAPIENCIA ANIDADOS CON POSPRE ORIGEN
  public async getPosPreSapienciaList({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IAdditionsFilters;
      return response.send(await AdditionsProvider.getPosPreSapienciaList(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //?ACTUALIZAR UNA ADICIÓN CON SUS MOVIMIENTOS INCLUIDOS
  public async updateAdditionWithMov({ request, response }: HttpContextContract) {

    try {

      const { id } = request.params();
      const additions = request.body() as IAdditionsWithMovements;

      return response.send(await AdditionsProvider.updateAdditionWithMov(id, additions));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  public async executeUpdateAdditionWithMov({ request, response }: HttpContextContract) {

    try {

      const { id } = request.params();
      const addition = request.body() as IAdditionsWithMovements;
      return response.send(await AdditionsProvider.executeUpdateAdditionWithMov(id, addition));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }


}
