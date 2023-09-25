import { IPosPreSapiencia, IFiltersPosPreSapiencia } from "App/Interfaces/PosPreSapienciaInterfaces";
import PosPreSapiencia from "App/Models/PosPreSapiencia";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";
import { IProjectAdditionFilters, IPosPreSapienciaAdditionList } from '../Interfaces/AdditionsInterfaces';
import { IFiltersPosPreSapienciaMix, IPosPreOrigen } from '../Interfaces/PosPreSapienciaInterfaces';
import Budgets from '../Models/Budgets';

export interface IPosPreSapienciaRepository {
    getPosPreSapienciaById(id:number): Promise<IPosPreSapiencia | null>;
    getPosPreSapienciaPaginated(filters: IFiltersPosPreSapiencia): Promise<IPagingData<IPosPreSapiencia>>;
    createPosPreSapiencia(posPreSapiencia: IPosPreSapiencia): Promise<IPosPreSapiencia | null>;
    updatePosPreSapiencia(posPreSapiencia: IPosPreSapiencia, id: number): Promise<IPosPreSapiencia | null>;
    getAllPosPreSapiencia():Promise<IPosPreSapiencia[]>;
    getPosPreSapienciaList(filters: IProjectAdditionFilters): Promise<IPagingData<IPosPreSapienciaAdditionList>>;

    //TODO: Nuevos
    getListPosPreSapVinculationPaginated(filters: IFiltersPosPreSapienciaMix): Promise<IPagingData<IPosPreSapiencia>>;
    searchPosPreSapByNumber(posPreSap: string): Promise<boolean>;
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

  async getPosPreSapienciaList(filters: IProjectAdditionFilters): Promise<IPagingData<IPosPreSapienciaAdditionList>> {

    let { page , perPage } = filters;
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

  async getListPosPreSapVinculationPaginated(filters: IFiltersPosPreSapienciaMix): Promise<IPagingData<IPosPreSapiencia>> {

    //Traer los PosPre Sapi
    const queryPosPreSapi = PosPreSapiencia.query();

    //Traer PosPre Origen
    const queryPosPreOrig = Budgets.query();

    //* Por ID de PosPre Origen
    if(filters.budgetIdOrig){

      queryPosPreSapi.where("budgetId", filters.budgetIdOrig);

    }

    //* Por Number de PosPre Origen
    if(filters.budgetNumberOrig){

      queryPosPreOrig.where("number", filters.budgetNumberOrig);
      const resQueryPosPreOrig = await queryPosPreOrig.paginate(1, 10);
      const { data, meta } = resQueryPosPreOrig.serialize();
      console.log({meta});
      const parsingResult = data as IPosPreOrigen[];
      let idPosPreOrig: number = 0;

      parsingResult.forEach( r => {
        idPosPreOrig = r.id!;
      });

      //Ahora si, ejecute consulta:
      queryPosPreSapi.where("budgetId", idPosPreOrig);

    }

    //* Por ID de PosPre Sapi
    if(filters.budgetIdSapi){

      queryPosPreSapi.where("id", filters.budgetIdSapi);

    }

    //* Por Number de PosPre Sapi
    if(filters.budgetNumberSapi){

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



    return true;

  }

}
