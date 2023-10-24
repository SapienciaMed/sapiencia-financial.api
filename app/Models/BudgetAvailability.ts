import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import AmountBudgetAvailability from "./AmountBudgetAvailability";

export default class BudgetAvailability extends BaseModel {
  public static table = "CDP_CERTIFICADO_DISPONIBILIDAD_PRESUPUESTAL";

  @column({ isPrimary: true, columnName: "CDP_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "CDP_EJERCICIO", serializeAs: "exercise" })
  public exercise: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "CDP_FECHA",
    serializeAs: "date",
  })
  public date: DateTime;

  @column({
    columnName: "CDP_OBJETO_CONTRACTUAL",
    serializeAs: "contractObject",
  })
  public contractObject: string;

  @column({ columnName: "CDP_CONSECUTIVO", serializeAs: "consecutive" })
  public consecutive: number;

  @column({ columnName: "CDP_CONSECUTIVO_SAP", serializeAs: "sapConsecutive" })
  public sapConsecutive: number;

  @column({ columnName: "CDP_RP_ASOCIADOS", serializeAs: "rpAssocs" })
  public rpAssocs: string;

  @hasMany(() => AmountBudgetAvailability, {
    localKey: "id",
    foreignKey: "cdpCode",
    serializeAs: "amounts",
  })
  public amounts: HasMany<typeof AmountBudgetAvailability>;
}
