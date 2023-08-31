import { IAdditions,
         IAdditionsFilters,
         IAdditionsWithMovements } from "App/Interfaces/AdditionsInterfaces";
import Additions from "../Models/Addition";
import { IPagingData } from "App/Utils/ApiResponses";
// import { DateTime } from "luxon";
import AdditionsMovement from '../Models/AdditionsMovement';

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
      const criterial = filters.adminDistrict.toUpperCase();
      query.where("actAdminDistrict", 'LIKE', `%${criterial}%`);
      console.log(filters.adminDistrict);
    }

    if (filters.adminSapiencia) {
      const criterial = filters.adminSapiencia.toUpperCase();
      query.where("actAdminSapiencia", 'LIKE', `%${criterial}%`);
      console.log(filters.adminSapiencia);
    }

    query.orderBy("id", "desc");

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

    const head = await Additions
                                .query()
                                .where("id", id)
                                .select("id",
                                        "actAdminDistrict",
                                        "actAdminSapiencia");

    const details = await AdditionsMovement.query().where("additionId", id)
      .preload("found", (a) => {
        a.select("id",
                 "entityId",
                 "number",
                 "denomination",
                 "description");
        a.preload("entity");
      })
      .preload("posPreSapiencia", (b) => {
        b.select("id",
                 "number",
                 "budgetId",
                 "ejercise",
                 "description",
                 "consecutive");
        b.preload("budget", (bb) => {
          bb.select("id",
                    "number",
                    "ejercise",
                    "denomination",
                    "description");
        });
      })
      .preload("project", (c) => {
        c.select("id",
                 "functionalAreaId",
                 "projectId",
                 "conceptProject",
                 "budgetValue",
                 "assignmentValue",
                 "linked");
        c.preload("areaFuntional", (cc) => {
          cc.select("id",
                    "number",
                    "denomination",
                    "description");
        });
      })


    const result = {
      head,
      details
    }

    return result;

  }

}
