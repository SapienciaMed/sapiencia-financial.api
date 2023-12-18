import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import VinculationMGAProvider from "@ioc:core.VinculationMGAProvider";
import BudgetsProvider from "@ioc:core.BudgetsProvider";
import PlanningProvider from "@ioc:core.PlanningProvider";
import PosPreSapienciaProvider from "@ioc:core.PosPreSapienciaProvider";
import {
  IFiltersVinculationMGA,
  IUpdateVinculationMultiple,
  IVinculationMgaWithMultipleV2
} from "App/Interfaces/VinculationMGAInterfaces";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import { IBudgets } from '../../Interfaces/BudgetsInterfaces';
import { IDesvinculationMgaV2 } from '../../Interfaces/VinculationMGAInterfaces';
import { IPosPreSapiencia } from '../../Interfaces/PosPreSapienciaInterfaces';
import CdpVinculateMGAValidator from "App/Validators/CdpVinculateMGAValidator";
import validateVinculateMGA from "App/Validators/validateVinculateMGA";
import validateAllCdp from "App/Validators/validateAllCdpValidate";
import { schema } from "@ioc:Adonis/Core/Validator";

export default class VinculationMGAController {

  public async getDetailedActivitiesPaginated({ request, response }: HttpContextContract) {
    try {

      const data = await request.validate({
        schema: schema.create({
          page: schema.number(),
          perPage: schema.number(),
          budgetId: schema.number(),
        }),
      });

      return response.send(await VinculationMGAProvider.getDetailedActivitiesPaginated(data))

    } catch (error) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(error))
      );
    }

  }


  public async getVinculationMGAById({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await VinculationMGAProvider.getVinculationMGAById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getActivityMGAPaginated({ request, response }: HttpContextContract) {
    try {
      const data = request.body() as IFiltersVinculationMGA;
      return response.send(await VinculationMGAProvider.getActivityMGAPaginated(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  //? -------------------------------------------------------------------------
  //? --------- RE ESTRUCTURACIÓN DE TODO EL TEMA DE VINCULACIÓN MGA ----------
  //? -------------------------------------------------------------------------

  //? Obtenga todas las actividades detallas de planeación
  public async getDetailedActivitiesV2({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as Array<number>
      return response.send(await PlanningProvider.getDetailedActivitiesByIds(data))

    } catch (error) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(error))
      );
    }

  }

  //? Obtenga actividades detalladas de Planación << NO >> asociadas al PosPre Origen proporcionado
  public async getDetailedActivitiesNoUseOnPosPre({ request, response }: HttpContextContract) {

    try {

      const { pospreorgid } = request.params();
      const data = request.body() as Array<number>
      return response.send(await PlanningProvider.getDetailedActivitiesNoUseOnPosPre(data, pospreorgid))

    } catch (error) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(error))
      );
    }

  }

  //? Obtenga actividades detalladas de Planación << SI >> asociadas al PosPre Origen proporcionado
  public async getDetailedActivitiesYesUseOnPosPre({ request, response }: HttpContextContract) {

    try {

      const { pospreorgid } = request.params();
      const data = request.body() as Array<number>
      return response.send(await PlanningProvider.getDetailedActivitiesYesUseOnPosPre(data, pospreorgid))

    } catch (error) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(error))
      );
    }

  }

  //? Creación de vinculación MGA
  public async createVinculationWithPlanningV2({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IVinculationMgaWithMultipleV2;
      return response.send(await VinculationMGAProvider.createVinculationWithPlanningV2(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //? Obtener Vinculación MGA por ID
  public async getVinculationDetailedActivitiesV2ById({ request, response }: HttpContextContract) {

    try {

      const { id } = request.params();
      return response.send(await PlanningProvider.getVinculationDetailedActivitiesV2ById(id));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //? Para el actualizar pospre origen, vinculación mga y pospre sapi al tiempo
  //? Esta es la funcionalidad del Editar en Vinculación MGA general de la API.
  public async updateMultipleVinculation({ request, response }: HttpContextContract) {

    try {

      const data = request.body() as IUpdateVinculationMultiple;

      const dataPosPreOrg: IBudgets | any = data.pospreorig;
      const dataPosPreSap: IPosPreSapiencia | any = data.pospresapi;
      const dataVinculMga: IDesvinculationMgaV2 | any = data.vinculationmga;

      let pospreorig: IBudgets | any = null;
      let res_pospresapi: IPosPreSapiencia[] = [];
      let res_vinculationmga: IDesvinculationMgaV2[] = [];

      //* Actualizamos encabezado (PosPre Origen)
      pospreorig = await BudgetsProvider.updateBudgets(dataPosPreOrg, Number(dataPosPreOrg.id));
      const res_pospreorig = pospreorig.data;

      //* Actualizamos estados del PosPre Sapiencia
      if( dataPosPreOrg && dataPosPreOrg != null && dataPosPreOrg != undefined){

        for (const w of dataPosPreSap) {

          await PosPreSapienciaProvider.updatePosPreSapVinculation(w, w.id);
          res_pospresapi.push(w)

        }

      }

      if( dataVinculMga && dataVinculMga != null && dataVinculMga != undefined){

        for (const x of dataVinculMga) {

          await VinculationMGAProvider.deleteVinculationWithPlanningV2(x, x.id);
          res_vinculationmga.push(x);

        }

      }

      const objResult = {
        res_pospreorig,
        res_pospresapi,
        res_vinculationmga
      }

      return response.send(
        new ApiResponse(
          objResult,
          EResponseCodes.OK,
          "Actualización Exitosa"
        )
      )

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  //getActivitiesDetail
  public async getActivitiesDetail({ request, response }: HttpContextContract) {
    
    try {

      const data = request.body();
      return response.send(await VinculationMGAProvider.getActivitiesDetail(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

//createVinculationWithPlanningV2
  public async createVinculationMga({ request, response }: HttpContextContract) {

    try {

      const data = await request.validate(
        CdpVinculateMGAValidator
      );     
   
      return response.send(await VinculationMGAProvider.createVinculationMga(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  public async validateVinculationMga({ request, response }: HttpContextContract) {

    try {

      const data = await request.validate(
        validateVinculateMGA
      );     
     //return data;
      return response.send(await VinculationMGAProvider.validateVinculationMga(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  public async validateAallCdp({ request, response }: HttpContextContract) {

    try {

      const data = await request.validate(
        validateAllCdp
      );

      return response.send(await VinculationMGAProvider.validateAllCdp(data));

    } catch (err) {

      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );

    }

  }

  
}
