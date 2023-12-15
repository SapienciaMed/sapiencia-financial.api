import { IFunctionalAreaUploadService } from './FunctionalAreaUploadMasiveService';
import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IPagoService } from './PagPagosService';
import { IFundsUploadMasiveService } from './FundsUploadMasiveService';

export interface IUploadMasiveService {
  initialRedirect(type: string, file: any, usuarioCreo: string, mes: number, ejercicio: string, aditionalData: [],): Promise<ApiResponse<any>>;
}

export default class UploadMasiveService implements IUploadMasiveService {
  constructor(
    private pagoService: IPagoService,
    private fundsUploadMasiveService: IFundsUploadMasiveService,
    private FunctionalAreaUploadMasiveService: IFunctionalAreaUploadService,
  ) {}

  async initialRedirect(type: string, file: any, usuarioCreo: any, mes: number, ejercicio: string, aditionalData: []): Promise<ApiResponse<any>> {
    let generalRes: any;

    switch(type) {
      case "Pagos":
        const resultPagos = await this.pagoService.uploadMasivePagos(file, usuarioCreo, mes, ejercicio);
        if (resultPagos.operation.code === "FAIL")
          return new ApiResponse(null, EResponseCodes.FAIL, "TODO: Retornamos errores para pintar en el Front (PAGOS)");

        generalRes = resultPagos;
        break;

      case "Funds":
        const resultFondos = await this.fundsUploadMasiveService.uploadMasiveFunds(file, usuarioCreo);
        if (resultFondos.operation.code === "FAIL")
          return new ApiResponse(null, EResponseCodes.FAIL, "TODO: Retornamos errores para pintar en el Front (FONDOS)");

        generalRes = resultFondos;
        break;
    
      case "AreaFuncional":
        try {
          if (!this.FunctionalAreaUploadMasiveService) {
            return new ApiResponse(null, EResponseCodes.FAIL, "FunctionalAreaUploadMasiveService no está definido.");
          }
      
          const resultAreaFuncional = await this.FunctionalAreaUploadMasiveService.uploadMasiveAreaFunctional(file, usuarioCreo,aditionalData);
        
          generalRes = resultAreaFuncional;
        } catch (error) {
          console.error(error);
          return new ApiResponse(null, EResponseCodes.FAIL, "TODO: Handle errors appropriately" + error);
        }
        break;
      
      case "PospreSapiencia":


      break;
    }

    return generalRes;
  }
}
