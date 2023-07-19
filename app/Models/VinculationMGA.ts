import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

export default class VinculationMGA extends BaseModel {
  public static table = "VMG_VINCULACIONES_MGA";

  @column({ isPrimary: true, columnName: "VMG_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "VMG_CODPPR_POSICION_PRESUPUESTAL", serializeAs: "budgetId" })
  public budgetId: number;
  
  @column({ columnName: "VMG_CODMGA_METODOLOGIA_GENERAL", serializeAs: "mgaId" })
  public mgaId: number;

  @column({ columnName: "VMG_USUARIO_CREO", serializeAs: "userCreate" })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "VMG_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;
}
