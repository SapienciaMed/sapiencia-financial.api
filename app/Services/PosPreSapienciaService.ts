import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IFiltersPosPreSapiencia, IPosPreSapiencia } from "App/Interfaces/PosPreSapienciaInterfaces";
import { IPosPreSapienciaRepository } from "App/Repositories/PosPreSapienciaRepository";

export interface IPosPreSapienciaService {
    getPosPreSapienciaById(id: number): Promise<ApiResponse<IPosPreSapiencia>>;
    getPosPreSapienciaPaginated(filters: IFiltersPosPreSapiencia): Promise<ApiResponse<IPagingData<IPosPreSapiencia>>>;
    createPosPreSapiencia(posPreSapiencia: IPosPreSapiencia): Promise<ApiResponse<IPosPreSapiencia>>;
    updatePosPreSapiencia(posPreSapiencia: IPosPreSapiencia, id: number): Promise<ApiResponse<IPosPreSapiencia>>;
    getAllPosPreSapiencia(): Promise<ApiResponse<IPosPreSapiencia[]>>;
}

export default class PosPreSapienciaService implements IPosPreSapienciaService {
    constructor(private posPreSapienciaRepository: IPosPreSapienciaRepository) { }

    async getPosPreSapienciaById(id: number): Promise<ApiResponse<IPosPreSapiencia>> {
        const res = await this.posPreSapienciaRepository.getPosPreSapienciaById(id);

        if (!res) {
            return new ApiResponse(
                {} as IPosPreSapiencia,
                EResponseCodes.WARN,
                "Registro no encontrado"
            );
        }

        return new ApiResponse(res, EResponseCodes.OK);
    }

    async getPosPreSapienciaPaginated(
        filters: IFiltersPosPreSapiencia
    ): Promise<ApiResponse<IPagingData<IPosPreSapiencia>>> {
        const res = await this.posPreSapienciaRepository.getPosPreSapienciaPaginated(filters);

        return new ApiResponse(res, EResponseCodes.OK);
    }

    async createPosPreSapiencia(posPreSapiencia: IPosPreSapiencia): Promise<ApiResponse<IPosPreSapiencia>> {
        const res = await this.posPreSapienciaRepository.createPosPreSapiencia(posPreSapiencia);

        if (!res) {
            return new ApiResponse(
                {} as IPosPreSapiencia,
                EResponseCodes.FAIL,
                "Se ha encontrado un error en los datos, revisa las rutas presupuestales"
            );
        }

        return new ApiResponse(res, EResponseCodes.OK);
    }

    async updatePosPreSapiencia(posPreSapiencia: IPosPreSapiencia, id: number): Promise<ApiResponse<IPosPreSapiencia>> {
        const res = await this.posPreSapienciaRepository.updatePosPreSapiencia(posPreSapiencia, id);

        if (!res) {
            return new ApiResponse(
                {} as IPosPreSapiencia,
                EResponseCodes.FAIL,
                "Se ha encontrado un error en los datos, revisa las rutas presupuestales"
            );
        }

        return new ApiResponse(res, EResponseCodes.OK);
    }

    async getAllPosPreSapiencia(): Promise<ApiResponse<IPosPreSapiencia[]>> {
        const res = await this.posPreSapienciaRepository.getAllPosPreSapiencia();

        return new ApiResponse(res, EResponseCodes.OK);
      }
}
