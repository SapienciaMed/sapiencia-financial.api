import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IContractorsFilter } from "App/Interfaces/payrollInterfaceExt";
import { ApiResponse } from "App/Utils/ApiResponses";
import axios, { AxiosInstance } from "axios";


export interface IPayrollService {
    getAllDependencies(): Promise<ApiResponse<IDependencies[]>>
    getContractorsByDocuments(contractorsFilter:IContractorsFilter): Promise<ApiResponse<any>>
}

interface IDependencies {

}

export default class PayrollService implements IPayrollService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.URL_API_PAYROLL,
        });
    }

    getAllDependencies = async (): Promise<ApiResponse<any>> => {
        const urlConsumer = `/api/v1/dependence/get-all`;

        const res = await this.axiosInstance.get<
            ApiResponse<IDependencies[]>
        >(urlConsumer, {
            headers: {
                Authorization: process.env.CURRENT_AUTHORIZATION,
            },
        });

        return new ApiResponse(
            res.data,
            EResponseCodes.OK,
            "Listado de Proyectos de Inversión desde Planeación."
          );
        

    }
    
    getContractorsByDocuments = async (contractorsFilter:IContractorsFilter): Promise<ApiResponse<any>> => {
        const urlConsumer = `/api/v1/vinculation/worker/get-by-filters`;

        const res = await this.axiosInstance.post<
            ApiResponse<any>
        >(urlConsumer, contractorsFilter,{
            headers: {
                Authorization: process.env.CURRENT_AUTHORIZATION,
            },
        });

        return new ApiResponse(
            res.data,
            EResponseCodes.OK,
            "Listado de Proyectos de Inversión desde Planeación."
          );
        

    }

}