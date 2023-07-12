import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Entities from "./Entities";

export default class Budgets extends BaseModel {
  public static table = "PPR_POSICION_PRESUPUESTARIA";

  @column({ isPrimary: true, columnName: "PPR_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: 'PPR_NUMERO' ,  serializeAs: "number"})
  public number: number;

  @column({ columnName: 'PPR_EJERCICIO',  serializeAs: "ejercise" })
  public ejercise: number;

  @column({ columnName: 'PPR_CODECP_ENTIDAD', serializeAs: "entityId" })
  public entityId: number;

  @column({ columnName: 'PPR_DENOMINACION',serializeAs: "denomination" })
  public denomination: string;

  @column({ columnName: 'PPR_DESCRIPCION',serializeAs: "description" })
  public description: string;

  @column({ columnName: 'PPR_USUARIO_MODIFICO',serializeAs: "userModify"})
  public userModify: string;

  @column({ columnName: 'PPR_FECHA_MODIFICO',serializeAs: "dateModify" })
  public dateModify: Date;

  @column({ columnName: 'PPR_USUARIO_CREO' ,serializeAs: "userCreate"  })
  public userCreate: string;

 

  @column.dateTime({
    autoCreate: true,
    columnName: "PPR_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;
  
  @hasOne(() => Entities, {
    localKey: "entityId",
    foreignKey: "id",
    serializeAs: "entity",
  })
  public entity: HasOne<typeof Entities>;
}
