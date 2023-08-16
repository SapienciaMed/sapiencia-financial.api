import { BaseModel,  HasOne,  column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import TypesTransfers from "./TypesTransfers";
import { DateTime } from "luxon";

export default class ManagementCenter extends BaseModel {
  public static table = "TRA_TRASLADOS";

  @column({ isPrimary: true, columnName: "TRA_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "TRA_CODTTR_TIPO_TRASLADO", serializeAs: "number" })
  public number: number;

  @column({ columnName: "TRA_ACTO_ADMINISTRATIVO_DISTRITO", serializeAs: "actDistrict" })
  public actDistrict: string;
  
  @column({ columnName: "TRA_ACTO_ADMINISTRATIVO_SAPIENCIA", serializeAs: "actSapiencia" })
  public actSapiencia: string;

  @column({ columnName: "TRA_VALOR", serializeAs: "value" })
  public value: number;

  @column({ columnName: "TRA_USUARIO_CREO", serializeAs: "userCreate" })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "TRA_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;

  @hasOne(() => TypesTransfers, {
    localKey: "number",
    foreignKey: "id",
    serializeAs: "transfers",
  })
  public transfers: HasOne<typeof TypesTransfers>;

}
