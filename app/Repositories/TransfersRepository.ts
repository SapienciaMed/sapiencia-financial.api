import { IPagingData } from "App/Utils/ApiResponses";
// import { DateTime } from "luxon";
import Transfer from '../Models/Transfer';
import { ITransfers, ITransfersFilters, ITransfersWithMovements } from '../Interfaces/TransfersInterfaces';
import TransfersMovement from '../Models/TransfersMovement';

export interface ITransfersRepository {

  getTransfersPaginated(filters: ITransfersFilters): Promise<IPagingData<ITransfers>>;
  createTransfers(transfer: ITransfers): Promise<ITransfers>;
  // getAllAdditionsList(list: string): Promise<IAdditions[] | any>;
  getTransferById(id: number): Promise<ITransfersWithMovements | any>;

}

export default class TransfersRepository implements ITransfersRepository {

  //?OBTENER PAGINADO Y FILTRADO LOS TRASLADOS CON SUS MOVIMIENTOS
  async getTransfersPaginated(filters: ITransfersFilters): Promise<IPagingData<ITransfers>> {

    const query = Transfer.query();
    query.select('id', 'actAdminDistrict', 'actAdminSapiencia', 'observations', 'value');

    query.preload('transferMove', (q) => {
      q.select('id', 'type', 'value', 'budgetRouteId');
    });


    if (filters.adminDistrict) {
      const criterial = filters.adminDistrict.toUpperCase();
      query.where("actAdminDistrict", 'LIKE', `%${criterial}%`);
    }

    if (filters.adminSapiencia) {
      const criterial = filters.adminSapiencia.toUpperCase();
      query.where("actAdminSapiencia", 'LIKE', `%${criterial}%`);
    }

    if (filters.observations) {
      const criterial = filters.observations;
      query.where("observations", 'LIKE', `%${criterial}%`);
    }

    query.orderBy("id", "desc");

    const res = await query.paginate(filters.page, filters.perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as ITransfers[],
      meta,
    };
  }

  //?CREACIÓN DE TRASLADO - CABECERA
  async createTransfers(transfer: ITransfers): Promise<ITransfers> {

    const toCreate = new Transfer();

    toCreate.fill({ ...transfer });
    await toCreate.save();
    return toCreate.serialize() as ITransfers;

  }

  //?OBTENER LISTADO GENERAL DE ADICIONES - CON PARAMETRO LIST DEFINIMOS QUE LISTADO MOSTRAR
  // async getAllAdditionsList(list: string): Promise<IAdditions[] | any> {

  //   let query: Additions[] = [];
  //   if (list === "district") {
  //     query = await Additions.query().select('id', 'actAdminDistrict');
  //   }

  //   if (list === "sapiencia") {
  //     query = await Additions.query().select('id', 'actAdminSapiencia');
  //   }

  //   return query;

  // }

  //?OBTENER UNA ADICIÓN CON SUS MOVIMIENTOS EN PARALELO A TRAVÉS DE UN ID PARAM
  async getTransferById(id: number): Promise<ITransfersWithMovements | any> {

    const head = await Transfer
      .query()
      .where("id", id)
      .select("id",
        "actAdminDistrict",
        "actAdminSapiencia",
        "observations",
        "value");

    const details = await TransfersMovement.query().where("transferId", id)
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
          q1.preload("projectVinculation", (subq) =>
          subq.preload("areaFuntional").preload("functionalProject")
        )
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
