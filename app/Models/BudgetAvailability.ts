import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import AmountBudgetAvailability from "./AmountBudgetAvailability";
import { getStringDate } from "App/Utils/functions";

export default class BudgetAvailability extends BaseModel {
  public static table = "CDP_CERTIFICADO_DISPONIBILIDAD_PRESUPUESTAL";

  @column({ isPrimary: true, columnName: "CDP_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "CDP_EJERCICIO", serializeAs: "exercise" })
  public exercise: string;

  @column({
    columnName: "CDP_FECHA",
    serializeAs: "date",
    // prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: Date) => {
      return getStringDate(value)

    },
  })
  public date: Date;

  @column({
    columnName: "CDP_OBJETO_CONTRACTUAL",
    serializeAs: "contractObject",
  })
  public contractObject: string;

  @column({ columnName: "CDP_CONSECUTIVO", serializeAs: "consecutive" })
  public consecutive: number;

  @column({ columnName: "CDP_CONSECUTIVO_SAP", serializeAs: "sapConsecutive" })
  public sapConsecutive: number | null;

  @hasMany(() => AmountBudgetAvailability, {
    localKey: "id",
    foreignKey: "cdpCode",
    serializeAs: "amounts",
  })
  public amounts: HasMany<typeof AmountBudgetAvailability>;
}
