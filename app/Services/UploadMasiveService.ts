import { IPospreMgaUploadMasiveService } from './PospreMgaUploadMasiveService';
import { IPospreUploadMasiveService } from './PospreUploadMasiveService';
import { IFunctionalAreaUploadService } from './FunctionalAreaUploadMasiveService';
import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IPagoService } from './PagPagosService';
import { IFundsUploadMasiveService } from './FundsUploadMasiveService';
import { IBudgetsRoutesRepository } from "App/Repositories/BudgetsRoutesRepository";


export interface IUploadMasiveService {
  initialRedirect(type: string, file: any, usuarioCreo: string, mes: number, ejercicio: string, aditionalData: [],): Promise<ApiResponse<any>>;
}

export default class UploadMasiveService implements IUploadMasiveService {
  constructor(
    private pagoService: IPagoService,
    private fundsUploadMasiveService: IFundsUploadMasiveService,
    private budgetsRouteRepository: IBudgetsRoutesRepository,
    private FunctionalAreaUploadMasiveService: IFunctionalAreaUploadService,
    private PospreUploadMasiveService: IPospreUploadMasiveService,
    private PospreMgaUploadMasiveService: IPospreMgaUploadMasiveService,
  ) { }

  async initialRedirect(type: string, file: any, usuarioCreo: any, mes: number, ejercicio: string, aditionalData: []): Promise<ApiResponse<any>> {
    let generalRes: any;

    switch (type) {
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

          const resultAreaFuncional = await this.FunctionalAreaUploadMasiveService.uploadMasiveAreaFunctional(file, usuarioCreo, aditionalData);

          generalRes = resultAreaFuncional;
        } catch (error) {
          console.error(error);
          return new ApiResponse(null, EResponseCodes.FAIL, "TODO: Handle errors appropriately" + error);
        }
        break;

      case "PospreSapiencia":
        try {
          if (!this.PospreUploadMasiveService) {
            return new ApiResponse(null, EResponseCodes.FAIL, "PospreUploadMasiveService no está definido.");
          }

          const resultPospre = await this.PospreUploadMasiveService.uploadMasiveAreaFunctional(file, usuarioCreo, aditionalData);

          generalRes = resultPospre;
        } catch (error) {
          console.error(error);
          return new ApiResponse(null, EResponseCodes.FAIL, "TODO: Handle errors appropriately" + error);
        }

        break;

       case "PospreMGA":
        try {
          if (!this.PospreMgaUploadMasiveService) {
            return new ApiResponse(null, EResponseCodes.FAIL, "PospreUploadMasiveMGA no está definido.");
          }

          const resultPospreMga = await this.PospreMgaUploadMasiveService.uploadMasiveMga(file, usuarioCreo, aditionalData);

          generalRes = resultPospreMga;
        } catch (error) {
          console.error(error);
          return new ApiResponse(null, EResponseCodes.FAIL, "TODO: Handle errors appropriately" + error);
        }
       break;

      case "RutaPptoInicial":
        try {
          const resultBudgetsRoute = await this.budgetsRouteRepository.createManyBudgetRoutes(file)
          return new ApiResponse(resultBudgetsRoute, EResponseCodes.OK, "Rutas presupuestales cargadas existosamente");
        } catch (error) {

          return new ApiResponse(null, EResponseCodes.FAIL, "Falla en el almacenamiento de rutas presupuestales " + error);
        }

        break;

    }

    return generalRes;
  }
}
