import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IPagoService } from './PagPagosService';
import { IFundsUploadMasiveService } from './FundsUploadMasiveService';
import { IBudgetsRoutesRepository } from "App/Repositories/BudgetsRoutesRepository";

export interface IUploadMasiveService {
  initialRedirect(type: string, file: any, usuarioCreo:string, mes:number): Promise<ApiResponse<any>>;
}

export default class UploadMasiveService implements IUploadMasiveService {

  constructor(
    private pagoService: IPagoService,
    private fundsUploadMasiveService: IFundsUploadMasiveService,
    private budgetsRouteRepository: IBudgetsRoutesRepository,
  ) {}

  async initialRedirect(type: string, file: any,usuarioCreo:any,mes:number): Promise<ApiResponse<any>> {

    let generalRes: any;

    switch(type){

      case "Pagos":

        const resultPagos = await this.pagoService.uploadMasivePagos(file,usuarioCreo,mes);

        if (resultPagos.operation.code === "FAIL")
          return new ApiResponse(null, EResponseCodes.FAIL, "TODO: Retornamos errores para pintar en el Front (PAGOS)");

        generalRes = resultPagos;

      break;

      case "Fondos":

        const resultFondos = await this.fundsUploadMasiveService.uploadMasiveFunds(file);
        generalRes = resultFondos;

      break;

      case "RutaPptoInicial":
        try {
          const resultBudgetsRoute = await this.budgetsRouteRepository.createManyBudgetRoutes(file)
          return new ApiResponse(resultBudgetsRoute, EResponseCodes.OK, "Rutas presupuestales cargadas existosamente");
        } catch (error) {
          
          return new ApiResponse(null, EResponseCodes.FAIL, "Falla en el almacenamiento de rutas presupuestales "+error );
        }
        
      break;

    }

    return generalRes;

  }

}
