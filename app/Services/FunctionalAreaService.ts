import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IActivityMGA } from "App/Interfaces/VinculationMGAInterfaces";
import { IFunctionalArea,IFunctionalAreaFilters} from "App/Interfaces/FunctionalAreaInterfaces";
import { IFunctionalAreaRepository} from "App/Repositories/FunctionalAreaRepository";
import { DateTime } from "luxon";

export interface IFunctionalAreaService {
    getFunctionalAreaById(id: number): Promise<ApiResponse<IFunctionalArea>>;
    getFunctionalAreaPaginated(filters: IFunctionalAreaFilters): Promise<ApiResponse<IPagingData<IFunctionalArea>>>;
    
}

export default class FunctionalAreaService implements IFunctionalArea {
    constructor(private FunctionalAreaRepository: IFunctionalAreaRepository) { }
    id?: number | undefined;
    areaFunctionalCode: number;
    denomination: string;
    description: string;
    userCreate?: string | undefined;
    dateCreate?: DateTime | undefined;

    async getFunctionalAreaById(id: number): Promise<ApiResponse<IFunctionalArea>> {
        const res = await this.FunctionalAreaRepository.getFunctionalAreaById(id);

        if (!res) {
            return new ApiResponse(
                {} as IFunctionalArea,
                EResponseCodes.WARN,
                "Registro no encontrado"
            );
        }

        return new ApiResponse(res, EResponseCodes.OK);
    }

    async getFunctionalAreaPaginated(
        filters: IFunctionalAreaFilters
    ): Promise<ApiResponse<IPagingData<IFunctionalArea>>> {
        const res = await this.FunctionalAreaRepository.getFunctionalAreaPaginated(filters);

        return new ApiResponse(res, EResponseCodes.OK);
    }
    

}  