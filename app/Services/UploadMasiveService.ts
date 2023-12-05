import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IPagoService } from './PagPagosService';
import { IFundsUploadMasiveService } from './FundsUploadMasiveService';

export interface IUploadMasiveService {
  initialRedirect(type: string, file: any, usuarioCreo:string, mes:number,ejercicio:string): Promise<ApiResponse<any>>;
}

export default class UploadMasiveService implements IUploadMasiveService {

  constructor(
    private pagoService: IPagoService,
    private fundsUploadMasiveService: IFundsUploadMasiveService,
  ) {}

  async initialRedirect(type: string, file: any,usuarioCreo:any,mes:number,ejercicio:string): Promise<ApiResponse<any>> {

    let generalRes: any;

    switch(type){

      case "Pagos":

        const resultPagos = await this.pagoService.uploadMasivePagos(file,usuarioCreo,mes,ejercicio);

        if (resultPagos.operation.code === "FAIL")
          return new ApiResponse(null, EResponseCodes.FAIL, "TODO: Retornamos errores para pintar en el Front (PAGOS)");

        generalRes = resultPagos;

      break;

      case "Fondos":

        const resultFondos = await this.fundsUploadMasiveService.uploadMasiveFunds(file);
        generalRes = resultFondos;

      break;

    }

    return generalRes;

  }

}
