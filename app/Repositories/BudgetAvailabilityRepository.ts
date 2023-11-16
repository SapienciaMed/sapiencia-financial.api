import {
  IAmountBudgetAvailability,
  IBudgetAvailability,
  IBudgetAvailabilityFilters,
  ICreateCdp,
  IUpdateBasicDataCdp,
  IUpdateRoutesCDP,
} from "App/Interfaces/BudgetAvailabilityInterfaces";
import BudgetAvailability from "../Models/BudgetAvailability";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";
import AmountBudgetAvailability from "App/Models/AmountBudgetAvailability";
import { getStringDate } from "App/Utils/functions";
export interface IBudgetAvailabilityRepository {
  searchBudgetAvailability(
    filter: IBudgetAvailabilityFilters
  ): Promise<IPagingData<IBudgetAvailability>>;
  createCdps(cdpDataTotal: ICreateCdp): Promise<any>;
  associateAmountsWithCdp(cdpId: number, amounts: any[]): Promise<void>;
  getAllCdps(): Promise<any[]>;
  editBudgetAvailabilityBasicDataCDP(
    updatedData: IUpdateBasicDataCdp
  ): Promise<any>;
  getBudgetAvailabilityById(id: string): Promise<BudgetAvailability>;
  cancelAmountCdp(
    id: number,
    reasonCancellation: string
  ): Promise<BudgetAvailability>;
  linkMga(): Promise<any>;
  getRouteCDPId(id: number): Promise<IUpdateRoutesCDP | null>;
  updateRoutesCDP(
    updateRoutesCDP: IUpdateRoutesCDP,
    id: number
  ): Promise<IUpdateRoutesCDP | null>;
  getRpCDP(id: string): Promise<BudgetAvailability>;
}

export default class BudgetAvailabilityRepository
  implements IBudgetAvailabilityRepository
{
  getAllCdps(): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
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
          subq2.preload("projectVinculation", (query) => {
            query.preload("functionalProject");
          });
        });
        subq.preload('linkRpcdps',(query)=>{
          query.preload('budgetRecord')
        })
      })
      .orderBy("date", "desc");

    // Aplicar los filtros de fecha, consecutivo SAP y objeto de contrato si se proporcionan.
    if (filter.dateOfCdp) {
      query.where("exercise", filter.dateOfCdp);
    }

    if (filter.initialDate && filter.endDate) {
      query.where("date", ">=", getStringDate(new Date(filter.initialDate)));
      query.where("date", "<=", getStringDate(new Date(filter.endDate)));
    }

    if (filter.consecutiveSap) {
      query.where("sapConsecutive", filter.consecutiveSap);
    }
    if (filter.consecutiveAurora) {
      query.where("consecutive", filter.consecutiveAurora);
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
    const { date, contractObject, sapConsecutive, icdArr } = cdpDataTotal;
    let dateDecode = date.toString();
    dateDecode = dateDecode.split("T")[0];

    const existingCdps = await this.filterCdpsByDateAndContractObject(
      date,
      contractObject
    );
    let alert = "";

    if (existingCdps.length > 0) {
      alert = `Ya existe un CDP registrado para el objeto contractual ${contractObject} y la fecha ${date}`;
      throw new Error(alert);
    }
    const query = await BudgetAvailability.query()
      .select("CDP_CONSECUTIVO")
      .orderBy("CDP_CONSECUTIVO", "desc")
      .first();

    const ultimoRegistro = query ? query.toJSON() : null;

    const cdp = new BudgetAvailability();
    cdp.date = dateDecode;
    cdp.contractObject = contractObject;
    cdp.consecutive = ultimoRegistro ? ultimoRegistro?.consecutive + 1 : 1;
    cdp.sapConsecutive = sapConsecutive;
    await cdp.save();
    await cdp.related("amounts").createMany(icdArr);

    return { consecutive: ultimoRegistro?.consecutive + 1 };
  }

  async associateAmountsWithCdp(cdpId: number, amounts: any[]) {
    try {
      const cdp = await BudgetAvailability.findOrFail(cdpId);
      const existingAmounts = await cdp
        .related("amounts")
        .query()
        .select("idRppCode")
        .exec();
      const existingIdRppCodes = existingAmounts.map(
        (amount) => amount.idRppCode
      );

      const newAmounts = amounts.filter((amount) => {
        return (
          amount.cdpId === cdpId &&
          !existingIdRppCodes.includes(amount.idRppCode)
        );
      });

      await cdp.related("amounts").createMany(newAmounts);
    } catch (error) {
      throw new Error("Error al asociar importes al CDP: " + error.message);
    }
  }
  getBudgetAvailabilityById = async (id: string): Promise<any> => {
    return await BudgetAvailability.query()
      .where("id", Number(id))
      .preload("amounts", (query) => {
        query.preload('linkRpcdps',(query)=>{
          query.where('isActive',1)
        })
        query.where("isActive", "=", true);
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

  linkMga = async (): Promise<any> => {
    /* const toUpdate = await AmountBudgetAvailability.find(id);
      if (!toUpdate) {
        return null;
      }
  
      await toUpdate.save();
      return toUpdate.serialize() as IAmountBudgetAvailability; */
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

  async updateRoutesCDP(
    updateRoutesCDP: IUpdateRoutesCDP,
    id: number
  ): Promise<IUpdateRoutesCDP | null> {
    const toUpdate = await AmountBudgetAvailability.find(id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.idRppCode = updateRoutesCDP.idRppCode;
    toUpdate.cdpPosition = updateRoutesCDP.cdpPosition;
    toUpdate.amount = updateRoutesCDP.amount;
    toUpdate.modifiedIdcCountercredit =
      updateRoutesCDP?.modifiedIdcCountercredit ?? 0;
    toUpdate.idcModifiedCredit = updateRoutesCDP?.idcModifiedCredit ?? 0;
    toUpdate.idcFixedCompleted = updateRoutesCDP?.idcFixedCompleted ?? 0;
    toUpdate.idcFinalValue = updateRoutesCDP?.idcFinalValue ?? 0;

    await toUpdate.save();
    return toUpdate.serialize() as IUpdateRoutesCDP;
  }

  async getRouteCDPId(id: number): Promise<IUpdateRoutesCDP | null> {
    const res = await AmountBudgetAvailability.query()
      .where("id", id)
      .preload("budgetAvailability")
      .preload("budgetRoute", (query) => {
        query.preload("projectVinculation", (query) => {
          query.preload("functionalProject");
        });
        query.preload("funds");
        query.preload("budget");
        query.preload("pospreSapiencia");
      });

    return res.length > 0 ? (res[0].serialize() as IUpdateRoutesCDP) : null;
  }
  getRpCDP = async (id: string): Promise<any> => {
    return await BudgetAvailability.query()
      .where("id", Number(id))
      .preload("amounts", (query) => {
        query.preload("linkRpcdps", (q) => {
          q.preload("budgetRecord", (c) => {
            c.preload("creditor");
          });
        });
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
}
