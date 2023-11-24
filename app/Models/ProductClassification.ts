 import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from "luxon";
import Budgets from './Budgets';

export default class ProductClassification extends BaseModel {
  public static table = "CPC_CLASIFICACION_CENTRAL_PRODUCTOS";

  @column({ isPrimary: true, columnName: "CPC_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: 'CPC_NUMERO', serializeAs: "number"})
  public number: string;

  @column({ columnName: 'CPC_DESCRIPCION',  serializeAs: "description" })
  public description: string;

  @column({ columnName: 'CPC_CODPPR_POSPRE', serializeAs: "budgetId" })
  public budgetId: number;

  @column({ columnName: 'CPC_USUARIO_MODIFICO',serializeAs: "userModify"})
  public userModify: string;

  @column({ columnName: 'CPC_FECHA_MODIFICO',serializeAs: "dateModify" })
  public dateModify: Date;

  @column({ columnName: 'CPC_USUARIO_CREO' ,serializeAs: "userCreate"  })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "CPC_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;

  @hasOne(() => Budgets, {
    localKey: "budgetId",
    foreignKey: "id",
    serializeAs: "budget",
  })
  public budget: HasOne<typeof Budgets>;

}
