import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import IcdAmountsCdp from "./IcdAmountsCdp";

export default class CdpCertificadoDisponibilidadPresupuestal extends BaseModel {
  public static table = "CDP_CERTIFICADO_DISPONIBILIDAD_PRESUPUESTAL";

  @column({ isPrimary: true, columnName: "CDP_CODIGO", serializeAs: "id" })
  public id: number;

  @column.dateTime({
    autoCreate: true,
    columnName: "CDP_FECHA",
    serializeAs: "date",
  })
  public date: DateTime;

  @column({ columnName: "CDP_OBJETO_CONTRACTUAL", serializeAs: "contractObject" })
  public contractObject: string;

  @column({ columnName: "CDP_CONSECUTIVO", serializeAs: "consecutive" })
  public consecutive: number;

  @hasMany(() => IcdAmountsCdp, {
    localKey: 'id',
    foreignKey: 'cdpCode',
    serializeAs: "icdAmounts",
  })
  public icdAmounts: HasMany<typeof IcdAmountsCdp>;

}
