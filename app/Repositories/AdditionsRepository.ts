import { IAdditions,
         IAdditionsFilters,
         IAdditionsWithMovements } from "App/Interfaces/AdditionsInterfaces";
import Additions from "../Models/Addition";
import { IPagingData } from "App/Utils/ApiResponses";
// import { DateTime } from "luxon";

export interface IAdditionsRepository {

  getAdditionsPaginated(filters: IAdditionsFilters): Promise<IPagingData<IAdditions>>;
  createAdditions(addition: IAdditions): Promise<IAdditions>;
  getAllAdditionsList(list: string): Promise<IAdditions[] | any>;
  getAdditionById(id: number): Promise<IAdditionsWithMovements | any>;

}

export default class AdditionsRepository implements IAdditionsRepository{

  //?OBTENER PAGINADO Y FILTRADO LAS ADICIONES CON SUS MOVIMIENTOS
  async getAdditionsPaginated(filters: IAdditionsFilters): Promise<IPagingData<IAdditions>> {

    const query = Additions.query();
    query.select('id', 'actAdminDistrict', 'actAdminSapiencia');

    query.preload('additionMove' , (q) => {
      q.select('id' , 'type' , 'value');
    });


    if (filters.adminDistrict) {
      query.where("actAdminDistrict", filters.adminDistrict);
      console.log(filters.adminDistrict);
    }

    if (filters.adminSapiencia) {
      query.where("actAdminSapiencia", filters.adminSapiencia);
    }

    const res = await query.paginate(filters.page, filters.perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IAdditions[],
      meta,
    };
  }

  //?CREACIÓN DE ADICIÓN CON SUS MOVIMIENTOS EN PARALELO
  async createAdditions(addition: IAdditions): Promise<IAdditions | any>{

    const toCreate = new Additions();

    toCreate.fill({ ...addition });
    await toCreate.save();
    return toCreate.serialize() as IAdditions;

  }

  //?OBTENER LISTADO GENERAL DE ADICIONES - CON PARAMETRO LIST DEFINIMOS QUE LISTADO MOSTRAR
  async getAllAdditionsList(list: string): Promise<IAdditions[] | any> {

    let query: Additions[] = [];
    if(list === "district" ){
      query = await Additions.query().select('id', 'actAdminDistrict');
    }

    if(list === "sapiencia" ){
      query = await Additions.query().select('id', 'actAdminSapiencia');
    }

    return query;

  }

  //?OBTENER UNA ADICIÓN CON SUS MOVIMIENTOS EN PARALELO A TRAVÉS DE UN ID PARAM
  async getAdditionById(id: number): Promise<IAdditionsWithMovements | any>{

    const res = await Additions.find(id);
    await res!.load("additionMove");

    return res ? (res.serialize() as IAdditionsWithMovements) : null;

  }

}
