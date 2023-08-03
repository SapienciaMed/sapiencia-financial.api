import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IManagementCenter,IManagementCenterFilters} from "App/Interfaces/ManagementCenterInterfaces";
import { IManagementCenterRepository} from "App/Repositories/ManagementCenterRepository";

export interface IManagementCenterService {
    getManagementCenterById(id: number): Promise<ApiResponse<IManagementCenter>>;
    getManagementCenterPaginated(filters: IManagementCenterFilters): Promise<ApiResponse<IPagingData<IManagementCenter>>>;
}

export default class ManagementCenterService implements IManagementCenterService {
    constructor(private ManagementCenterRepository: IManagementCenterRepository) { }

    async getManagementCenterById(id: number): Promise<ApiResponse<IManagementCenter>> {
        const res = await this.ManagementCenterRepository.getManagementCenterById(id);
        if (!res) {
            return new ApiResponse(
                {} as IManagementCenter,
                EResponseCodes.WARN,
                "Registro no encontrado"
            );
        }
        return new ApiResponse(res, EResponseCodes.OK);
    }

    async getManagementCenterPaginated(
        filters: IManagementCenterFilters
    ): Promise<ApiResponse<IPagingData<IManagementCenter>>> {
        const res = await this.ManagementCenterRepository.getManagementCenterPaginated(filters);

        return new ApiResponse(res, EResponseCodes.OK);
    }

}  