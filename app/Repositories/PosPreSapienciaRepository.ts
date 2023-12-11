import PosPreSapiencia from "App/Models/PosPreSapiencia";
import Budgets from '../Models/Budgets';

import { IPagingData } from "App/Utils/ApiResponses";

import {
  IProjectAdditionFilters,
  IPosPreSapienciaAdditionList
} from '../Interfaces/AdditionsInterfaces';
import {
  IFiltersPosPreSapienciaMix,
  IPosPreOrigen
} from '../Interfaces/PosPreSapienciaInterfaces';
import { IPosPreSapiencia } from "App/Interfaces/PosPreSapienciaInterfaces";


export interface IPosPreSapienciaRepository {
  getPosPreSapienciaById(id: number): Promise<IPosPreSapiencia | null>;
  getAllPosPreSapiencia(): Promise<IPosPreSapiencia[]>;
  getListPosPreSapVinculationPaginated(filters: IFiltersPosPreSapienciaMix): Promise<IPagingData<IPosPreSapiencia>>;
  searchPosPreSapByNumber(posPreSap: string): Promise<boolean>;
  createPosPreSapVinculation(posPreSapiencia: IPosPreSapiencia): Promise<IPosPreSapiencia | any>;
  updatePosPreSapVinculation(posPreSapiencia: IPosPreSapiencia, id: number): Promise<IPosPreSapiencia | any>;
  getPosPreSapienciaList(filters: IProjectAdditionFilters): Promise<IPagingData<IPosPreSapienciaAdditionList>>;
  getPosPreSapiSpcifyExercise(exercise: number): Promise<IPosPreSapiencia[] | null>;
  getPosPreByParamsMasive(pprNumero: string, pprEjercicio: number, ppsPosicion: number): Promise<any>;
}

export default class PosPreSapienciaRepository implements IPosPreSapienciaRepository {

  constructor() { }

  async getAllPosPreSapiencia(): Promise<IPosPreSapiencia[]> {
    const res = await PosPreSapiencia.query();
    return res as IPosPreSapiencia[];
  }

  async getPosPreByParamsMasive(pprNumero: string, pprEjercicio: number, ppsPosicion: number): Promise<any> {

    const queryGetInfo = await PosPreSapiencia.query()
    .preload("budget", (subQuery) => {
      subQuery.where("number",pprNumero)
      subQuery.where("ejercise",pprEjercicio)
    }).where("budgetId", ppsPosicion)

    const resDataPospre = queryGetInfo.map((i) => i.serialize());

    return resDataPospre
  
  }
  async getPosPreSapienciaList(filters: IProjectAdditionFilters): Promise<IPagingData<IPosPreSapienciaAdditionList>> {

    let { page, perPage } = filters;
    const query = PosPreSapiencia.query();
    query.select('id',
      'number',
      'budgetId',
      'ejercise',
      'description',
      'consecutive')
    await query.preload('budget', (w) => {
      w.select('id',
        'number',
        'entityId',
        'denomination',
        'description')
    });

    page = 1;
    perPage = (await query).length;

    const res = await query.paginate(page, perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IPosPreSapienciaAdditionList[],
      meta,
    };

  }

  //?Lo nuevo

  async getPosPreSapienciaById(id: number): Promise<IPosPreSapiencia | null> {

    const res = await PosPreSapiencia.find(id);
    await res?.load('budget');
    return res ? (res.serialize() as IPosPreSapiencia) : null;

  }

  async getListPosPreSapVinculationPaginated(filters: IFiltersPosPreSapienciaMix): Promise<IPagingData<IPosPreSapiencia>> {

    //Traer los PosPre Sapi
    const queryPosPreSapi = PosPreSapiencia.query();

    //Traer PosPre Origen
    const queryPosPreOrig = Budgets.query();

    //* Por ID de PosPre Origen
    if (filters.budgetIdOrig) {

      queryPosPreSapi.where("budgetId", filters.budgetIdOrig);

    }

    //* Por Number de PosPre Origen
    if (filters.budgetNumberOrig) {

      queryPosPreOrig.where("number", filters.budgetNumberOrig);
      const resQueryPosPreOrig = await queryPosPreOrig.paginate(1, 10);
      const { data } = resQueryPosPreOrig.serialize();
      const parsingResult = data as IPosPreOrigen[];
      let idPosPreOrig: number = 0;

      parsingResult.forEach(r => {
        idPosPreOrig = r.id!;
      });

      //Ahora si, ejecute consulta:
      queryPosPreSapi.where("budgetId", idPosPreOrig);

    }

    //* Por ID de PosPre Sapi
    if (filters.budgetIdSapi) {

      queryPosPreSapi.where("id", filters.budgetIdSapi);

    }

    //* Por Number de PosPre Sapi
    if (filters.budgetNumberSapi) {

      queryPosPreSapi.where("number", filters.budgetNumberSapi);

    }

    await queryPosPreSapi.preload('budget');
    const res = await queryPosPreSapi.paginate(filters.page, filters.perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IPosPreSapiencia[],
      meta,
    };

  }

  async searchPosPreSapByNumber(posPreSap: string): Promise<boolean> {

    const queryPosPreSapi = PosPreSapiencia.query();
    queryPosPreSapi.where("number", posPreSap);

    const res = await queryPosPreSapi.paginate(1, 10);
    const { data } = res.serialize();
    const element = data as IPosPreSapiencia[];

    if (!element || element.length <= 0) {
      return false;
    }

    return true;

  }

  async createPosPreSapVinculation(posPreSapiencia: IPosPreSapiencia): Promise<IPosPreSapiencia | any> {

    const toCreate = new PosPreSapiencia();
    toCreate.fill({ ...posPreSapiencia });
    await toCreate.save();

    return toCreate.serialize() as IPosPreSapiencia;

  }

  async updatePosPreSapVinculation(posPreSapiencia: IPosPreSapiencia, id: number): Promise<IPosPreSapiencia | any> {

    const toUpdate = await PosPreSapiencia.find(id);

    if (!toUpdate) return null;

    toUpdate.number = posPreSapiencia.number;
    toUpdate.budgetId = posPreSapiencia.budgetId;
    toUpdate.ejercise = posPreSapiencia.ejercise;
    toUpdate.description = posPreSapiencia.description;
    toUpdate.consecutive = posPreSapiencia.consecutive;
    toUpdate.assignedTo = posPreSapiencia.assignedTo;

    if (posPreSapiencia.userModify) {
      toUpdate.userModify = posPreSapiencia.userModify!;
    }

    if (posPreSapiencia.dateModify) {
      toUpdate.dateModify = posPreSapiencia.dateModify!;
    }

    //* Que no se repita.
    const number = posPreSapiencia.number;
    const queryPosPreSapi = await PosPreSapiencia.findBy("number", number);

    if (!queryPosPreSapi) {

      await toUpdate.save();
      return toUpdate.serialize() as IPosPreSapiencia;

    } else {

      if (queryPosPreSapi.id == id) {

        await toUpdate.save();
        return toUpdate.serialize() as IPosPreSapiencia;

      }

      return null;

    }

  }

  async getPosPreSapiSpcifyExercise(exercise: number): Promise<IPosPreSapiencia[] | null> {

    const query = await PosPreSapiencia
    .query()
    .select("id", "number", "ejercise")
    .where("ejercise", exercise);

    return query.map((i) => i.serialize() as IPosPreSapiencia);

  }

}
