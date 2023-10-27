import {
  IAmountBudgetAvailability,
  IBudgetAvailability,
  IBudgetAvailabilityFilters,
  ICreateCdp,
  IUpdateBasicDataCdp,
} from "App/Interfaces/BudgetAvailabilityInterfaces";
import BudgetAvailability from "../Models/BudgetAvailability";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";
import AmountBudgetAvailability from "App/Models/AmountBudgetAvailability";
export interface IBudgetAvailabilityRepository {
  searchBudgetAvailability(
    filter: IBudgetAvailabilityFilters
  ): Promise<IPagingData<IBudgetAvailability>>;
  createCdps(cdpDataTotal: ICreateCdp): Promise<any>;
  editBudgetAvailabilityBasicDataCDP(
    updatedData: IUpdateBasicDataCdp
  ): Promise<any>;
  getById(id: string): Promise<BudgetAvailability>;
  cancelAmountCdp(
    id: number,
    reasonCancellation: string
  ): Promise<BudgetAvailability>;
}

export default class BudgetAvailabilityRepository
  implements IBudgetAvailabilityRepository
{
  async searchBudgetAvailability(
    filter: IBudgetAvailabilityFilters
  ): Promise<IPagingData<IBudgetAvailability>> {
    let { page, perPage } = filter;

    // Crear una consulta para disponibilidad presupuestaria con precarga de datos relacionados.
    const query = BudgetAvailability.query()
      .preload("amounts", (subq) => {
        subq.preload("budgetRoute", (subq2) => {
          subq2.preload("budget");
          subq2.preload("pospreSapiencia");
          subq2.preload("funds");
          subq2.preload("projectVinculation");
        });
      })
      .orderBy("date", "desc");

    // Aplicar los filtros de fecha, consecutivo SAP y objeto de contrato si se proporcionan.
    if (filter.dateOfCdp) {
      query.where("exercise", filter.dateOfCdp);
    }

    if (filter.initialDate && filter.endDate) {
      query.where("date", ">=", filter.initialDate.toJSDate());
      query.where("date", "<=", filter.endDate.toJSDate());
    }

    if (filter.consecutiveSap) {
      query.where("sapConsecutive", filter.consecutiveSap);
    }

    if (filter.contractObject) {
      query.whereILike("contractObject", `%${filter.contractObject}%`);
    }

    // Aplicar filtros basados en el ID de Pospre, Fondo o Proyecto si se proporcionan.
    if (filter.pospreId) {
      query.whereHas("amounts", (sub) =>
        sub.whereHas("budgetRoute", (sub2) =>
          sub2.where("idPospreSapiencia", Number(filter.pospreId))
        )
      );
    }

    if (filter.fundId) {
      query.whereHas("amounts", (sub) =>
        sub.whereHas("budgetRoute", (sub2) =>
          sub2.where("idFund", Number(filter.fundId))
        )
      );
    }

    if (filter.projectId) {
      query.whereHas("amounts", (sub) =>
        sub.whereHas("budgetRoute", (sub2) =>
          sub2.where("idProjectVinculation", Number(filter.projectId))
        )
      );
    }

    // Realizar la paginación de resultados.
    const res = await query.paginate(page, perPage);

    // Extraer datos y metadatos de la respuesta.
    const { meta, data } = res.serialize();

    return {
      meta,
      array: data as IBudgetAvailability[],
    };
  }
  async filterCdpsByDateAndContractObject(
    date: string,
    contractObject: string
  ): Promise<any[]> {
    const results = await BudgetAvailability.query()
      .where("CDP_FECHA", new Date(date).toISOString().split("T")[0])
      .where("CDP_OBJETO_CONTRACTUAL", "LIKE", `%${contractObject}%`)
      .preload("amounts");

    const cdps = results.map((result) => result.toJSON());
    return cdps;
  }

  async deleteCdpById(cdpId: number): Promise<void> {
    const cdp = await BudgetAvailability.find(cdpId);
    if (!cdp) {
      throw new Error("El registro no existe");
    }
    await cdp.delete();
  }

  async createCdps(cdpDataTotal: any) {
    const { date, contractObject, consecutive, sapConsecutive, icdArr } =
      cdpDataTotal;

    const existingCdps = await this.filterCdpsByDateAndContractObject(
      date,
      contractObject
    );
    let alert = "";

    if (existingCdps.length > 0) {
      alert = `Ya existe un CDP registrado para el objeto contractual ${contractObject} y la fecha ${date}`;
      throw new Error(alert);
    }

    const cdp = new BudgetAvailability();
    cdp.date = date;
    cdp.contractObject = contractObject;
    cdp.consecutive = consecutive;
    cdp.sapConsecutive = sapConsecutive;
    await cdp.save();
    await cdp.related("amounts").createMany(icdArr);
  }

  getById = async (id: string): Promise<any> => {
    return await BudgetAvailability.query()
      .where("id", Number(id))
      .preload("amounts", (query) => {
        query.preload("budgetRoute", (query) => {
          query.preload("projectVinculation", (query) => {
            query.preload("functionalProject");
          });
          query.preload("funds");
          query.preload("budget");
          query.preload("pospreSapiencia");
        });
      });
  };

  cancelAmountCdp = async (
    id: number,
    reasonCancellation: string
  ): Promise<any> => {
    const toUpdate = await AmountBudgetAvailability.find(id);
    if (!toUpdate) {
      return null;
    }
    toUpdate.reasonCancellation = reasonCancellation;
    toUpdate.isActive = false;
    await toUpdate.save();
    return toUpdate.serialize() as IAmountBudgetAvailability;
  };

  async editBudgetAvailabilityBasicDataCDP(
    updatedData: IUpdateBasicDataCdp
  ): Promise<IBudgetAvailability | null> {
    // Almacenar los datos actualizados en una variable.
    const res = updatedData;

    // Buscar la disponibilidad presupuestaria que se va a actualizar por su ID.
    const toUpdate = await BudgetAvailability.find(res.id);

    // Verificar si la disponibilidad presupuestaria no se encontró en la base de datos.
    if (!toUpdate) {
      return null;
    }
    // Actualizar la fecha de CDP y/o el objeto de contrato y/o Consecutivo SAP si se proporcionan en los datos actualizados.
    if (res.date) {
      const dateOfCdpNew = DateTime.fromISO(res.date.toString());
      const dateOfCdpNew2 = dateOfCdpNew.toJSDate();
      toUpdate.date = dateOfCdpNew2;
      toUpdate.exercise = new Date(res.date).getFullYear().toString();
    }
    if (res.contractObject) {
      toUpdate.contractObject = res.contractObject;
    }

    if (res.sapConsecutive || res.sapConsecutive === null) {
      toUpdate.sapConsecutive = res.sapConsecutive;
    }

    // Guardar los cambios en la base de datos.
    await toUpdate.save();

    // Devolver los datos de disponibilidad presupuestaria actualizados en formato serializado.
    return toUpdate.serialize() as IBudgetAvailability;
  }
}
