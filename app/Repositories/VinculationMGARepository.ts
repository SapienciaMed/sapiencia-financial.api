import {
  // IVinculationMGA,
  IFiltersVinculationMGA,
  IActivityMGA,
  ICrudVinculation,
} from "App/Interfaces/VinculationMGAInterfaces";
import ActivitiesMGA from "App/Models/ActivitiesMGA";
import VinculationMGA from "App/Models/VinculationMGA";
import { IPagingData } from "App/Utils/ApiResponses";
import { IVinculationMgaV2 } from '../Interfaces/VinculationMGAInterfaces';

export interface IVinculationMGARepository {

  getInitialResource(): Promise<string>;
  getVinculationMGAById(id: number): Promise<IActivityMGA | null>;
  getVinculationMGAPaginated(filters: IFiltersVinculationMGA): Promise<IPagingData<IActivityMGA>>;
  // createVinculationMGA(vinculationMGA: ICrudVinculation): Promise<IVinculationMGA[]>;
  deleteVinculationMGA(id: ICrudVinculation): Promise<boolean>;

  //TODO: Lo nuevo
  createVinculationWithPlanningV2(vinculationMGA: IVinculationMgaV2): Promise<IVinculationMgaV2>;

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

  // async createVinculationMGA(
  //   vinculationMGA: ICrudVinculation
  // ): Promise<IVinculationMGA[]> {
  //   const vinculations: IVinculationMGA[] = [];
  //   await Promise.all(
  //     vinculationMGA.activities.map(async (activity) => {
  //       const vinculation = await VinculationMGA.query()
  //         .where("budgetId", vinculationMGA.budgetId)
  //         .andWhere("mgaId", activity);
  //       if (vinculation.length != 0) {
  //         return;
  //       }
  //       const toCreateVinculationMGA = new VinculationMGA();
  //       toCreateVinculationMGA.budgetId = vinculationMGA.budgetId;
  //       if (vinculationMGA.userCreate) {
  //         toCreateVinculationMGA.userCreate = vinculationMGA.userCreate;
  //       }
  //       toCreateVinculationMGA.mgaId = activity;
  //       await toCreateVinculationMGA.save();
  //       vinculations.push(toCreateVinculationMGA.serialize() as IVinculationMGA);
  //     })
  //   );
  //   return vinculations;
  // }

  async deleteVinculationMGA(
    vinculationMGA: ICrudVinculation
  ): Promise<boolean> {
    try {
      await Promise.all(
        vinculationMGA.activities.map(async (activity) => {
          await VinculationMGA.query()
            .where("budgetId", vinculationMGA.budgetId)
            .andWhere("mgaId", activity)
            .delete();
        })
      );
      return true;
    } catch {
      return false;
    }
  }

  //?Nuevo
  async createVinculationWithPlanningV2(vinculationMGA: IVinculationMgaV2): Promise<IVinculationMgaV2> {

    const toCreate = new VinculationMGA();

    toCreate.fill({ ...vinculationMGA });
    await toCreate.save();
    return toCreate.serialize() as IVinculationMgaV2;

  }

}
