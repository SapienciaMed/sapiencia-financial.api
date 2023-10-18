<<<<<<< HEAD
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import CdpCertificadoDisponibilidadPresupuestal from '../../Models/CertificateBudgetAvailability';
import IcdAmountsCdp from '../../Models/IcdAmountsCdp';
import { ICertificateBudgetAvailability, IIcdAmountsCdp } from '../../Interfaces/CdpsInterfaces'; 

export default class BudgetsController {
  public async createBudgets({ request, response }: HttpContextContract) {
    try {
      const certificateData = request.body() as ICertificateBudgetAvailability;
      const icdData = request.body() as IIcdAmountsCdp;
      
      let objInfoCertificate = {
        CDP_FECHA: certificateData.date,
        CDP_OBJETO_CONTRACTUAL: certificateData.contractObject,
        CDP_CONSECUTIVO: certificateData.consecutive,
      }
      const createdCertificate = await CdpCertificadoDisponibilidadPresupuestal.create({
        CDP_FECHA: certificateData.date,
        CDP_OBJETO_CONTRACTUAL: certificateData.contractObject,
        CDP_CONSECUTIVO: certificateData.consecutive,
      });
      const createdCertificateId = createdCertificate.id;

      let objInfoAmounts = {
        ICD_CODCDP: createdCertificateId,
        ICD_CODRPP_RUTA_PRESUPUESTAL: icdData.idRppCode,
        ICD_POSICION: icdData.cdpPosition,
        ICD_VALOR: icdData.amount,
      }
      const createdIcd = await IcdAmountsCdp.create({
        ICD_CODCDP: createdCertificateId,
        ICD_CODRPP_RUTA_PRESUPUESTAL: icdData.idRppCode,
        ICD_POSICION: icdData.cdpPosition,
        ICD_VALOR: icdData.amount,
      });

      return response.send({ message: 'Data saved successfully', data: { createdCertificate, createdIcd } });
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }
}
=======
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CdpsProvider from "@ioc:core.CdpsProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
export default class CdpsController {

    public async getAllCdpsCertificationBudgetAvailability({ response }: HttpContextContract) {
        try {
            return response.send(await CdpsProvider.getAllCdps());
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }

}
>>>>>>> 195d7cc1daeecf1c4561d4b8f21fe550981db035
