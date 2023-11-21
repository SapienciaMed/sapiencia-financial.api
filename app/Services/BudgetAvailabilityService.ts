import { IBudgetAvailabilityRepository } from "App/Repositories/BudgetAvailabilityRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import {
  IBudgetAvailability,
  IBudgetAvailabilityFilters,
  ICreateCdp,
  IUpdateBasicDataCdp,
  IUpdateRoutesCDP,
} from "App/Interfaces/BudgetAvailabilityInterfaces";
import BudgetAvailability from "App/Models/BudgetAvailability";
import { IStrategicDirectionService } from "./External/StrategicDirectionService";

export interface IBudgetAvailabilityService {
  searchBudgetAvailability(
    filters: IBudgetAvailabilityFilters
  ): Promise<ApiResponse<IPagingData<IBudgetAvailability>>>;

  associateAmountsWithCdp(cdpId: number, amounts: any[]): Promise<ApiResponse<any>>;
  createCdps(cdpData: ICreateCdp): Promise<ApiResponse<any>>;
  editBudgetAvailabilityBasicDataCDP(
    id: number,
    dataEdit: any
  ): Promise<ApiResponse<any>>;
  getBudgetAvailabilityById(id: string): Promise<ApiResponse<IBudgetAvailability>>;
  cancelAmountCdp(
    id: number,
    reasonCancellation: string
  ): Promise<ApiResponse<any>>;
  linkMga(): Promise<ApiResponse<any>>
  getRouteCDPId(id: number): Promise<ApiResponse<IUpdateRoutesCDP | null>>;
  updateRoutesCDP(updateRoutesCDP: IUpdateRoutesCDP, id: number): Promise<ApiResponse<IUpdateRoutesCDP>>;
  getRpCDP(id: string): Promise<ApiResponse<IBudgetAvailability>>;
}

export default class BudgetAvailabilityService
  implements IBudgetAvailabilityService {
  constructor(
    private budgetAvailabilityRepository: IBudgetAvailabilityRepository,
    private strategicDirectionService: IStrategicDirectionService
  ) { }

  async searchBudgetAvailability(
    filters: IBudgetAvailabilityFilters
  ): Promise<ApiResponse<IPagingData<IBudgetAvailability>>> {
    const data = await this.budgetAvailabilityRepository.searchBudgetAvailability(filters);
    const projectInvesment = await this.strategicDirectionService.getProjectInvestmentPaginated({ page: 1, perPage: 100000 })

    const dataFixed = data.array.map(budgetA=>{
        return ({
          ...budgetA,
          amounts:Object(budgetA).amounts.map(amount=>{
            return ({
               ...amount,
               projectName: amount.budgetRoute.projectVinculation.type=='Inversion'
                    ? projectInvesment.data.array.find(p => p.id == amount.budgetRoute.projectVinculation.investmentProjectId)?.name
                    : amount.budgetRoute.projectVinculation.functionalProject.name
            })
        })
           
        })
    })

    const respondeFixed = {
      meta:data.meta,
      array:dataFixed
    } 

    return new ApiResponse(respondeFixed, EResponseCodes.OK);
  }

  async createCdps(cdpData: ICreateCdp): Promise<ApiResponse<any>> {
    try {
      const createdData = await this.budgetAvailabilityRepository.createCdps(
        cdpData
      );
      return new ApiResponse(
        createdData,
        EResponseCodes.OK,
        "CDP e ICD creados exitosamente"
      );
    } catch (error) {
      console.error("Error en CdpsService al crear CDP e ICD:", error);
      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        "Error al crear CDP e ICD" + error
      );
    }
  }

  async editBudgetAvailabilityBasicDataCDP(
    id: number,
    dataEdit: any
  ): Promise<ApiResponse<any>> {
    try {
      const updatedData: IUpdateBasicDataCdp = {
        id: +id,
        ...dataEdit,
      };
      const res =
        await this.budgetAvailabilityRepository.editBudgetAvailabilityBasicDataCDP(
          updatedData
        );
      return new ApiResponse(res, EResponseCodes.OK);
    } catch (error) {
      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        "Error al editar datos basicos del CDP" + error
      );
    }
  }

  async getBudgetAvailabilityById(id: string): Promise<ApiResponse<BudgetAvailability | any>> {
    try {
      const data = await this.budgetAvailabilityRepository.getBudgetAvailabilityById(id);
      const projectInvesment = await this.strategicDirectionService.getProjectInvestmentPaginated({ page: 1, perPage: 100000 })
      
      const dataFixed = data[0].$preloaded.amounts.map(e => {
        let projectName = e.$preloaded.budgetRoute.$preloaded.projectVinculation.$attributes.type=='Funcionamiento'
          ? e.$preloaded.budgetRoute.$preloaded.projectVinculation.$preloaded?.functionalProject?.$attributes.name
          : projectInvesment.data.array.find(p => p.id == e.$preloaded.budgetRoute.$preloaded.projectVinculation.$attributes.investmentProjectId)?.name
        
        e.$attributes['projectName'] = projectName
        e.$attributes['fundCode'] = e.$preloaded.budgetRoute.$preloaded.funds.$attributes.number;
        e.$attributes['pospreSapienciaCode'] = e.$preloaded.budgetRoute.$preloaded.pospreSapiencia.$attributes.number;
        e.$attributes['linkRpcdps'] = e.$preloaded.linkRpcdps;
        return e.$attributes;
      }
      )

      let dataResponse = [
        {
          ...data[0].$attributes,
          amounts: dataFixed
        }
      ]

      return new ApiResponse(
        dataResponse,
        EResponseCodes.OK,
        "CDP encontrado exitosamente"
      );
    } catch (error) {
      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        "Error al cargar el CDP" + error
      );
    }
  }
  
  async cancelAmountCdp(
    id: number,
    reasonCancellation: string
  ): Promise<ApiResponse<BudgetAvailability | any>> {
    try {
      const data = await this.budgetAvailabilityRepository.cancelAmountCdp(id, reasonCancellation);
      return new ApiResponse(data, EResponseCodes.OK, 'Monto CDP anulado exitosamente');
    } catch (error) {
      return new ApiResponse(null, EResponseCodes.FAIL, 'Error al anular el monto CDP' + error);
    }
  }

  async linkMga(): Promise<ApiResponse<any>> {
    try {
      const data = await this.budgetAvailabilityRepository.linkMga();
      return new ApiResponse(data, EResponseCodes.OK, 'MGA vinculado al CDP exitosamente');
    } catch (error) {
      return new ApiResponse(null, EResponseCodes.FAIL, 'Error al vincular MGA al CDP' + error);
    }
  }

  async associateAmountsWithCdp(cdpId: number, amounts: any[]): Promise<ApiResponse<any>> {
    try {
      await this.budgetAvailabilityRepository.associateAmountsWithCdp(cdpId, amounts);
      return new ApiResponse(null, EResponseCodes.OK, 'Importes asociados exitosamente');
    } catch (error) {
      console.error('Error en BudgetAvailabilityService al asociar importes al CDP:', error);
      return new ApiResponse(null, EResponseCodes.FAIL, 'Error al asociar importes al CDP: ' + error);
    }
  }

  async updateRoutesCDP(updateRoutesCDP: IUpdateRoutesCDP, id: number): Promise<ApiResponse<IUpdateRoutesCDP>> {
    const res = await this.budgetAvailabilityRepository.updateRoutesCDP(updateRoutesCDP, id);
    if (!res) {
      return new ApiResponse(
        {} as IUpdateRoutesCDP,
        EResponseCodes.FAIL,
        "El registro indicado no existe"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getRouteCDPId(id: number): Promise<ApiResponse<IUpdateRoutesCDP | null>> {
    const res = await this.budgetAvailabilityRepository.getRouteCDPId(id);
    if (!res) {
      return new ApiResponse(res, EResponseCodes.WARN, "Recurso no encontrado");
    } else {
      return new ApiResponse(res, EResponseCodes.OK);
    }
  }
  async getRpCDP(id: string): Promise<ApiResponse<any>> {
    try {
      const data = await this.budgetAvailabilityRepository.getRpCDP(id);
      const projectInvesment = await this.strategicDirectionService.getProjectInvestmentPaginated({ page: 1, perPage: 100000 });
  
      const consecutive = data[0].consecutive;
      const sapConsecutive = data[0].sapConsecutive;

      const dataFixed = data[0].$preloaded.amounts.map(amount => {
        const projectName = amount.$preloaded.budgetRoute.$preloaded.projectVinculation.$attributes.type == 'Funcionamiento'
          ? amount.$preloaded.budgetRoute.$preloaded.projectVinculation.$preloaded?.functionalProject?.$attributes.name
          : projectInvesment.data.array.find(p => p.id == amount.$preloaded.budgetRoute.$preloaded.projectVinculation.$attributes.investmentProjectId)?.name;
  
        // New: Extract the creditor id from the nested relationships
        const creditorId = amount.$preloaded.linkRpcdps[0]?.$preloaded.budgetRecord.$preloaded.creditor.$attributes.id;

  
        // Return the modified amount object with additional properties
        return {
          ...amount.$attributes,
          projectName,
          fundCode: amount.$preloaded.budgetRoute.$preloaded.funds.$attributes.number,
          pospreSapienciaCode: amount.$preloaded.budgetRoute.$preloaded.pospreSapiencia.$attributes.number,
          creditorIds: creditorId, // This will be an array of creditor ids
          consecutive: consecutive,
          sapConsecutive: sapConsecutive
        };
      });
  
      let dataResponse = [
        {
          ...data[0].$attributes,
          amounts: dataFixed
        }
      ];
  
      return new ApiResponse(
        dataResponse, // Make sure to send the modified dataResponse instead of the original data
        EResponseCodes.OK,
        "CDP encontrado exitosamente"
      );
    } catch (error) {
      return new ApiResponse(
        null,
        EResponseCodes.FAIL,
        "Error al cargar el CDP" + error
      );
    }
  }
  
}
