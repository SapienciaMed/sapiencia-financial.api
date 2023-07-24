import VinculationMGAService from "@ioc:core.VinculationMGAProvider";
import {
  IVinculationMGA,
  IFiltersVinculationMGA,
  IActivityMGA,
  ICrudVinculation,
} from "App/Interfaces/VinculationMGAInterfaces";
import ActivitiesMGA from "App/Models/ActivitiesMGA";
import VinculationMGA from "App/Models/VinculationMGA";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IVinculationMGARepository {
  getVinculationMGAById(id: number): Promise<IActivityMGA | null>;
  getVinculationMGAPaginated(
    filters: IFiltersVinculationMGA
  ): Promise<IPagingData<IActivityMGA>>;
  createVinculationMGA(
    vinculationMGA: ICrudVinculation
  ): Promise<IVinculationMGA[]>;
  deleteVinculationMGA(id: ICrudVinculation): Promise<boolean>;
}

export default class VinculationMGARepository
  implements IVinculationMGARepository
{
  constructor() {}

  async getVinculationMGAById(id: number): Promise<IActivityMGA | null> {
    const res = await ActivitiesMGA.find(id);
    return res ? (res.serialize() as IActivityMGA) : null;
  }

  async getVinculationMGAPaginated(
    filters: IFiltersVinculationMGA
  ): Promise<IPagingData<IActivityMGA>> {
    const query = ActivitiesMGA.query();
    if(filters.mgaId){
      await query.where("id",filters.mgaId);
    }
    query.preload("vinculation");

    query.doesntHave("vinculation").orWhereHas("vinculation", (builder) => {
      builder.where("budgetId", filters.budgetId);
    });

    const res = await query.paginate(filters.page, filters.perPage);

    const { data, meta } = res.serialize();

    const nonNullObjects = data.filter((obj) => obj.vinculation !== null);
    const nullObjects = data.filter((obj) => obj.vinculation === null);
    const objectReturn = filters.active ? nonNullObjects :  nonNullObjects.concat(nullObjects);
    return {
      array:  objectReturn as IActivityMGA[],
      meta,
      
    };
  }

  async createVinculationMGA(
    vinculationMGA: ICrudVinculation
  ): Promise<IVinculationMGA[]> {
    const vinculations: IVinculationMGA[] = [];
    vinculationMGA.activities.forEach(async (activity) => {
      const vinculation = await VinculationMGA.query()
        .where("budgetId", vinculationMGA.budgetId)
        .andWhere("mgaId", activity);
      if (vinculation.length != 0) {
        return;
      }
      const toCreateVinculationMGA = new VinculationMGA();
      toCreateVinculationMGA.budgetId = vinculationMGA.budgetId;
      if(vinculationMGA.userCreate){
        toCreateVinculationMGA.userCreate = vinculationMGA.userCreate;
      }
      toCreateVinculationMGA.mgaId = activity;
      await toCreateVinculationMGA.save();
      vinculations.push(toCreateVinculationMGA.serialize() as IVinculationMGA);
    });
    return vinculations;
  }

  async deleteVinculationMGA(
    vinculationMGA: ICrudVinculation
  ): Promise<boolean> {
    try {
      vinculationMGA.activities.forEach(async (activity) => {
         await VinculationMGA.query()
          .where("budgetId", vinculationMGA.budgetId)
          .andWhere("mgaId", activity).delete();
      });
      return true;
    } catch {
      return false;
    }
  }
}
