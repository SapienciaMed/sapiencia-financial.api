import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Entities from "./Entities";

export default class Funds extends BaseModel {
  public static table = "FND_FONDOS";

  @column({ isPrimary: true, columnName: "FND_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "FND_CODECP_ENTIDAD", serializeAs: "entityId" })
  public entityId: number;

  @column({ columnName: "FND_NUMERO", serializeAs: "number" })
  public number: number;

  @column({ columnName: "FND_DENOMINACION", serializeAs: "denomination" })
  public denomination: string;

  @column({ columnName: "FND_DESCRIPCION", serializeAs: "description" })
  public description: string;

  @column({ columnName: "FND_VIGENTE_DESDE", serializeAs: "dateFrom" })
  public dateFrom: DateTime;
  
  @column({ columnName: "FND_VIGENTE_HASTA", serializeAs: "dateTo" })
  public dateTo: DateTime;

  @column({ columnName: "FND_USUARIO_MODIFICO", serializeAs: "userModify" })
  public userModify: string;

  @column({ columnName: "FND_FECHA_MODIFICO", serializeAs: "dateModify" })
  public dateModify: Date;

  @column({ columnName: "FND_USUARIO_CREO", serializeAs: "userCreate" })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "FND_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;

  @hasOne(() => Entities, {
    localKey: "entityId",
    foreignKey: "id",
    serializeAs: "entity",
  })
  public entity: HasOne<typeof Entities>;
  toUpdate: Date;
}
