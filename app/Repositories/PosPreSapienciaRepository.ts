import { IPosPreSapiencia, IFiltersPosPreSapiencia } from "App/Interfaces/PosPreSapienciaInterfaces";
import PosPreSapiencia from "App/Models/PosPreSapiencia";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

export interface IPosPreSapienciaRepository {
    getPosPreSapienciaById(id:number): Promise<IPosPreSapiencia | null>;
    getPosPreSapienciaPaginated(filters: IFiltersPosPreSapiencia): Promise<IPagingData<IPosPreSapiencia>>;
    createPosPreSapiencia(posPreSapiencia: IPosPreSapiencia): Promise<IPosPreSapiencia>;
    updatePosPreSapiencia(posPreSapiencia: IPosPreSapiencia, id: number): Promise<IPosPreSapiencia | null>;
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

    await query.preload('budget');

    const res = await query.paginate(filters.page, filters.perPage);

    const { data, meta } = res.serialize();

    return {
      array: data as IPosPreSapiencia[],
      meta,
    };
  }

  async createPosPreSapiencia(posPreSapiencia: IPosPreSapiencia): Promise<IPosPreSapiencia> {
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

    
    toUpdate.dateModify = DateTime.local().toJSDate();
    if(posPreSapiencia.userModify) {
      toUpdate.userModify = posPreSapiencia.userModify;
    }
    
    await toUpdate.save();
    return toUpdate.serialize() as IPosPreSapiencia;
  }
}
