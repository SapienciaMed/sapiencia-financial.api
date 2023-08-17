import { IPosPreSapiencia, IFiltersPosPreSapiencia } from "App/Interfaces/PosPreSapienciaInterfaces";
import PosPreSapiencia from "App/Models/PosPreSapiencia";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

export interface IPosPreSapienciaRepository {
    getPosPreSapienciaById(id:number): Promise<IPosPreSapiencia | null>;
    getPosPreSapienciaPaginated(filters: IFiltersPosPreSapiencia): Promise<IPagingData<IPosPreSapiencia>>;
    createPosPreSapiencia(posPreSapiencia: IPosPreSapiencia): Promise<IPosPreSapiencia | null>;
    updatePosPreSapiencia(posPreSapiencia: IPosPreSapiencia, id: number): Promise<IPosPreSapiencia | null>;
    getAllPosPreSapiencia():Promise<IPosPreSapiencia[]>;
}

export default class PosPreSapienciaRepository implements IPosPreSapienciaRepository {
  constructor() {}

  async getPosPreSapienciaById(id:number): Promise<IPosPreSapiencia | null> {
    const res = await PosPreSapiencia.find(id);
    await res?.load('budget');
    return res ? (res.serialize() as IPosPreSapiencia) : null;
  }

  async getPosPreSapienciaPaginated(filters: IFiltersPosPreSapiencia): Promise<IPagingData<IPosPreSapiencia>> {
    const query = PosPreSapiencia.query();

    if (filters.budgetId) {
      query.where("budgetId", filters.budgetId);
    }

    if(filters.number) {
      query.where("number", filters.number)
    }

    await query.preload('budget');

    const res = await query.paginate(filters.page, filters.perPage);

    const { data, meta } = res.serialize();

    return {
      array: data as IPosPreSapiencia[],
      meta,
    };
  }

  async createPosPreSapiencia(posPreSapiencia: IPosPreSapiencia): Promise<IPosPreSapiencia | null> {
    const consecutive = await PosPreSapiencia.query().where("consecutive", posPreSapiencia.consecutive).andWhere("budgetId", posPreSapiencia.budgetId);

    if(consecutive.length != 0) {
      return null;
    }

    const toCreatePosPreSapiencia = new PosPreSapiencia();
    toCreatePosPreSapiencia.fill({ ...posPreSapiencia });
    await toCreatePosPreSapiencia.save();

    return toCreatePosPreSapiencia.serialize() as IPosPreSapiencia;
  }

  async updatePosPreSapiencia(posPreSapiencia: IPosPreSapiencia, id: number): Promise<IPosPreSapiencia | null> {

    const toUpdate = await PosPreSapiencia.find(id);
    if (!toUpdate) {
      return null;
    }

    const consecutive = await PosPreSapiencia.query().where("consecutive", posPreSapiencia.consecutive).andWhere("id", "<>", toUpdate.id).andWhere("budgetId", posPreSapiencia.budgetId);

    if(consecutive.length != 0) {
      return null;
    }

    toUpdate.dateModify = DateTime.local().toJSDate();
    toUpdate.consecutive = posPreSapiencia.consecutive;
    toUpdate.ejercise = posPreSapiencia.ejercise;
    toUpdate.number = posPreSapiencia.number;
    toUpdate.description = posPreSapiencia.description;

    if(posPreSapiencia.userModify) {
      toUpdate.userModify = posPreSapiencia.userModify;
    }

    await toUpdate.save();
    return toUpdate.serialize() as IPosPreSapiencia;
  }

  async getAllPosPreSapiencia():Promise<IPosPreSapiencia[]> {
    const res = await PosPreSapiencia.query();
    return res as IPosPreSapiencia[];
  }
}
