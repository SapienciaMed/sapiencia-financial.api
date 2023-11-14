import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IBudgetRecord, IBudgetRecordFilter, ILinkRPCDP } from "App/Interfaces/BudgetRecord";
import IBudgetRecordRepository from "App/Repositories/BudgetRecordRepository";
import { ApiResponse } from "App/Utils/ApiResponses";
import { IStrategicDirectionService } from "./External/StrategicDirectionService";


export interface IBudgetRecordService {
    createCdps(budgetRecord: IBudgetRecord): Promise<ApiResponse<any>>
    updateDataBasicRp(budgetRecordDataBasic:IBudgetRecord): Promise<ApiResponse<any>>
    getComponents(): Promise<ApiResponse<any>>
    getRpByFilters(budgetRecordFilter: IBudgetRecordFilter): Promise<ApiResponse<any>>
    getTotalValuesImports(id: number): Promise<ApiResponse<any>>;   
    updateRp(id:number,budgetRecordDataBasic:ILinkRPCDP): Promise<ApiResponse<any>>
    getCausation(id: number): Promise<ApiResponse<any>>;
    getAllActivityObjectContracts(): Promise<ApiResponse<any>>
}

export default class BudgetRecordService implements IBudgetRecordService {


    constructor(
        private budgerRecordRepository: IBudgetRecordRepository,
        private strategicDirectionService: IStrategicDirectionService
        ) {
        this.budgerRecordRepository = budgerRecordRepository;
       
    } 
    
    createCdps = async (budgetRecord: IBudgetRecord): Promise<ApiResponse<any>> => {
        try {
            const data = await this.budgerRecordRepository.createCdps(budgetRecord)
            return new ApiResponse(
                data,
                EResponseCodes.OK,
                "RP creado exitosamente"
            );

        } catch (error) {
            return new ApiResponse(
                null,
                EResponseCodes.FAIL,
                "Error al crear el RP" + error
            );
        }

    }
    
    updateDataBasicRp = async(budgetRecordDataBasic:IBudgetRecord): Promise<ApiResponse<any>> => {
        try {
            const data = await this.budgerRecordRepository.updateDataBasicRp(budgetRecordDataBasic)
            return new ApiResponse(
                data,
                EResponseCodes.OK,
                "RP editado exitosamente"
            );

        } catch (error) {
            return new ApiResponse(
                null,
                EResponseCodes.FAIL,
                "Error al editar el RP" + error
            );
        }

    }

    updateRp = async(id:number,budgetRecordDataBasic:ILinkRPCDP): Promise<ApiResponse<any>> => {
        try {
            const data = await this.budgerRecordRepository.updateRp(id,budgetRecordDataBasic)
            return new ApiResponse(
                data,
                EResponseCodes.OK,
                "RP editado exitosamente"
            );

        } catch (error) {
            return new ApiResponse(
                null,
                EResponseCodes.FAIL,
                "Error al editar el RP" + error
            );
        }

    }

    getComponents = async (): Promise<ApiResponse<any>> => {
        try {
            const data = await this.budgerRecordRepository.getComponents()
            return new ApiResponse(
                data,
                EResponseCodes.OK,
                "Componentes encontrados exitosamente"
            );

        } catch (error) {
            return new ApiResponse(
                null,
                EResponseCodes.FAIL,
                "Error consultar componentes del RP" + error
            );
        }
    }

    getRpByFilters = async (budgetRecordFilter: IBudgetRecordFilter): Promise<ApiResponse<any>> => {
        try {
            const data = await this.budgerRecordRepository.getRpByFilters(budgetRecordFilter)
            const projectInvesment = await this.strategicDirectionService.getProjectInvestmentPaginated({ page: 1, perPage: 100000 })
            
            let res = {
                ...data[0].$attributes,
                creditor: data[0].$preloaded.creditor.$attributes,
                linksRp:data.map(ev=>{
                    return ev.$preloaded.linksRp.map(e=>{
                        return {
                            ...e.$attributes,
                            projectName:e.$preloaded.amountBudgetAvailability.budgetRoute.projectVinculation.type=='Inversion'
                                ? projectInvesment?.data?.array?.find(proy=>proy.id == e.$preloaded.amountBudgetAvailability.budgetRoute.projectVinculation.investmentProjectId)?.name!
                                : e.$preloaded.amountBudgetAvailability.budgetRoute.projectVinculation.functionalProject.$attributes.name,
                                ...e.$preloaded
                        }
                    })
                }).flat()
            }

            return new ApiResponse(
                [res],
                EResponseCodes.OK,
                "Registros presupuestales encontrados exitosamente"
            );
        } catch (error) {
            return new ApiResponse(
                null,
                EResponseCodes.FAIL,
                "Error consultar registros presupuestales" + error
            );
        }
    }
    async getTotalValuesImports(id: number): Promise<ApiResponse<any>>  {
        const res = await this.budgerRecordRepository.getTotalValuesImports(id);
        if (!res) {
            return new ApiResponse(
                {} as any,
                EResponseCodes.WARN,
                "Registro no encontrado"
            );
        }
        return new ApiResponse(res, EResponseCodes.OK);
    }      
     

    async getCausation(
        id: number
      ): Promise<ApiResponse<any>> {
        const res = await this.budgerRecordRepository.getCausation(id);
        if (!res) {
          return new ApiResponse(
            {} as any,
            EResponseCodes.WARN,
            "Registro no encontrado"
          );
        }
        return new ApiResponse(res, EResponseCodes.OK);
    }   
    async getAllActivityObjectContracts(): Promise<ApiResponse<any>>  {
        const res = await this.budgerRecordRepository.getAllActivityObjectContracts();
        if (!res) {
            return new ApiResponse(
                {} as any,
                EResponseCodes.WARN,
                "Registro no encontrado"
            );
        }
        return new ApiResponse(res, EResponseCodes.OK);
    }   
}