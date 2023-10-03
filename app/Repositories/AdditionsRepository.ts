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
    query.select('id', 'actAdminDistrict', 'actAdminSapiencia','typeMovement');
    
    query.preload('additionMove' , (q) => {
      q.select('id' , 'type' , 'value', 'budgetRouteId');
    });
    
    
    if (filters.adminDistrict) {
      const criterial = filters.adminDistrict.toUpperCase();
      query.where("actAdminDistrict", 'LIKE', `%${criterial}%`);
    }

    if (filters.adminSapiencia) {
      const criterial = filters.adminSapiencia.toUpperCase();
      query.where("actAdminSapiencia", 'LIKE', `%${criterial}%`);
    }
    
    if (filters.typeMovement) {
      const criterial = filters.typeMovement.toUpperCase();
      query.where("typeMovement", 'LIKE', `%${criterial}%`);
    }
    
    query.orderBy("actAdminSapiencia", "desc");
    query.orderBy("id", "asc");
    
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
                                        "actAdminSapiencia",
                                        "typeMovement");

    const details = await AdditionsMovement.query().where("additionId", id)
      .preload("budgetRoute", (q1) => {
        q1.select("id",
                  "managementCenter",
                  "div",
                  "idProjectVinculation",
                  "idFund",
                  "idBudget",
                  "idPospreSapiencia")
        q1
          //Preload para traer proyecto y área funcional
          .preload("projectVinculation", (a) => {
            a.select("id",
                     "functionalAreaId",
                     "projectId",
                     "conceptProject")
            a.preload("areaFuntional", (aa) => {
              aa.select("id",
                        "number",
                        "denomination",
                        "description")
            })
          })

          //Preload para traer los fondos
          .preload("funds", (b) => {
            b.select("id",
                     "number",
                     "denomination",
                     "description")
          })

          //Preload para traer pospre origen
          .preload("budget", (c) => {
            c.select("id",
                     "number",
                     "ejercise",
                     "denomination",
                     "description")
          })

          //Preload para traer los pospre sapiencia asociados
          .preload("pospreSapiencia", (d) => {
            d.select("id",
                     "number",
                     "ejercise",
                     "consecutive",
                     "description")
          })
      })

    const result = {
      head,
      details
    }

    return result;

  }

}
