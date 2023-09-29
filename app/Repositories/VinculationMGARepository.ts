import {
  IFiltersVinculationMGA,
  IActivityMGA
} from "App/Interfaces/VinculationMGAInterfaces";

import ActivitiesMGA from "App/Models/ActivitiesMGA";
import VinculationMGA from "App/Models/VinculationMGA";

import { IPagingData } from "App/Utils/ApiResponses";
import { IVinculationMgaV2,
         IDesvinculationMgaV2 } from '../Interfaces/VinculationMGAInterfaces';

export interface IVinculationMGARepository {

  getInitialResource(): Promise<string>;
  getVinculationMGAById(id: number): Promise<IActivityMGA | null>;
  getVinculationMGAPaginated(filters: IFiltersVinculationMGA): Promise<IPagingData<IActivityMGA>>;

  //TODO: Lo nuevo
  createVinculationWithPlanningV2(vinculationMGA: IVinculationMgaV2): Promise<IVinculationMgaV2>;
  deleteVinculationWithPlanningV2(vinculationMGA: IDesvinculationMgaV2): Promise<IDesvinculationMgaV2 | boolean>;
  getVinculationMGAByPosPreOrg(id: number): Promise<IActivityMGA[] | any>;

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

  async deleteVinculationWithPlanningV2(vinculationMGA: IDesvinculationMgaV2): Promise<IDesvinculationMgaV2 | boolean> {

    const id: number = Number(vinculationMGA.id);
    const vinculation = VinculationMGA.query().where("id" , id).delete();
    await vinculation;

    return true;

  }

  async getVinculationMGAByPosPreOrg(id: number): Promise<IActivityMGA[] | any> {

    const query = await VinculationMGA.query().where("budgetId", id);
    return query;

  }



}
