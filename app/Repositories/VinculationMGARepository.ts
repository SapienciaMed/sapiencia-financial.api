import {
  IFiltersVinculationMGA,
  IActivityMGA
} from "App/Interfaces/VinculationMGAInterfaces";

import ActivitiesMGA from "App/Models/ActivitiesMGA";
import VinculationMGA from "App/Models/VinculationMGA";

import { IPagingData } from "App/Utils/ApiResponses";
import { IVinculationMgaV2,
         IDesvinculationMgaV2 } from '../Interfaces/VinculationMGAInterfaces';
import { ICDPVinculateMGA } from "App/Interfaces/ICDPVinculateMGAInterface.ts";
import CdpVinculationMga from "App/Models/CdpVinculationMga";
import AmountBudgetAvailability from "App/Models/AmountBudgetAvailability";

export interface IVinculationMGARepository {

  getInitialResource(): Promise<string>;
  getVinculationMGAById(id: number): Promise<IActivityMGA | null>;
  getVinculationMGAPaginated(filters: IFiltersVinculationMGA): Promise<IPagingData<IActivityMGA>>;
  createVinculationWithPlanningV2(vinculationMGA: IVinculationMgaV2): Promise<IVinculationMgaV2>;
  deleteVinculationWithPlanningV2(vinculationMGA: IDesvinculationMgaV2, id: number): Promise<IDesvinculationMgaV2 | boolean>;
  getVinculationMGAByPosPreOrg(id: number): Promise<IActivityMGA[] | any>;
  createVinculationMga(data: ICDPVinculateMGA): Promise<ICDPVinculateMGA[]>;
  validateVinculationMga(data: any): Promise<any>;
  validateAllCdp(data: any): Promise<any>;

}

export default class VinculationMGARepository implements IVinculationMGARepository {

  constructor() { }

  async getInitialResource(): Promise<string> {

    return "Iniciando el Repo ...";

  }

  async getVinculationMGAById(id: number): Promise<IActivityMGA | null> {
    const res = await ActivitiesMGA.find(id);
    return res ? (res.serialize() as IActivityMGA) : null;
  }

  async getVinculationMGAPaginated(
    filters: IFiltersVinculationMGA
  ): Promise<IPagingData<IActivityMGA>> {
    const query = ActivitiesMGA.query();
    if (filters.mgaId) {
      await query.where("id", filters.mgaId);
    }
    query.preload("vinculation");


    if (filters.active) {
      query.whereHas("vinculation", (builder) => {
        builder.where("budgetId", filters.budgetId);
      });
    } else {
      query.doesntHave("vinculation").orWhereHas("vinculation", (builder) => {
        builder.where("budgetId", filters.budgetId);
      });
    }

    const res = await query.paginate(filters.page, filters.perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IActivityMGA[],
      meta,
    };
  }

  //?Nuevo
  async createVinculationWithPlanningV2(vinculationMGA: IVinculationMgaV2): Promise<IVinculationMgaV2> {

    const toCreate = new VinculationMGA();

    toCreate.fill({ ...vinculationMGA });
    await toCreate.save();
    return toCreate.serialize() as IVinculationMgaV2;

  }

  async deleteVinculationWithPlanningV2(vinculationMGA: IDesvinculationMgaV2, id: number): Promise<IDesvinculationMgaV2 | boolean> {

    const vinculation: IDesvinculationMgaV2 = vinculationMGA;

    const deleteVinculation = VinculationMGA.query().where("id" , id).delete();
    await deleteVinculation;

    return vinculation;

  }

  async getVinculationMGAByPosPreOrg(id: number): Promise<IActivityMGA[] | any> {

    const query = await VinculationMGA.query().where("budgetId", id);
    return query;

  }

  async createVinculationMga(data:  ICDPVinculateMGA): Promise<ICDPVinculateMGA[]> {
    const createdRecords: ICDPVinculateMGA[] = [];

    for (const item of data.datos) {
        const toCreate = new CdpVinculationMga(); 
        toCreate.fill(item);
        await toCreate.save();
        createdRecords.push(toCreate.serialize() as ICDPVinculateMGA);
    }

    return createdRecords;
  }

  async validateVinculationMga(data: any): Promise<number> {
    // Realizas la consulta.
    const query = await AmountBudgetAvailability.query().where("cdpCode", data.cdpId);

    // Inicializas una variable para sumar los valores.
    let totalSum:number = 0;

    // Iteras sobre cada registro y sumas el valor de 'idcFinalValue'.
    query.forEach(record => {
        totalSum += Number(record.idcFinalValue);
    });

    

    // Devuelves la suma total.
    return totalSum; 
}
  async validateAllCdp(data: any): Promise<any> {

    const query = await CdpVinculationMga.query().where("activitieDetailMga", data.activitieId);

    // Crear un conjunto para almacenar códigos CDP únicos.
    const uniqueCdpCodes = new Set<string>();

    // Recorrer cada elemento en la consulta y añadir su cdpCode al conjunto.
    query.forEach(datos => {
      uniqueCdpCodes.add(String(datos.cdpCode));
    });

    // Convertir el conjunto en un array para devolverlo.
    const uniqueCdpCodesArray = Array.from(uniqueCdpCodes);  

    const queryCdp = await AmountBudgetAvailability.query().whereIn("cdpCode", uniqueCdpCodesArray).where('isActive',1);


    let totalSum:number = 0;

    // Iteras sobre cada registro y sumas el valor de 'idcFinalValue'.
    queryCdp.forEach(record => {
        totalSum += Number(record.idcFinalValue);
    });
    
    // Devuelves la suma total.
    return totalSum; 
   
  }


}
