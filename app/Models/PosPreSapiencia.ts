import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Budgets from "./Budgets";

export default class PosPreSapiencia extends BaseModel {
  public static table = "PPS_POSICIONES_PRESUPUESTARIAS_SAPIENCIA";

  @column({ isPrimary: true, columnName: "PPS_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "PPS_CODIGO_REFERENCIA", serializeAs: "number" })
  public number: string;

  @column({ columnName: "PPS_CODPPR_POSICION_PRESUPUESTAL", serializeAs: "budgetId" })
  public budgetId: number;
  
  @column({ columnName: "PPS_EJERCICIO", serializeAs: "ejercise" })
  public ejercise: number;

  @column({ columnName: "PPS_DESCRIPCION", serializeAs: "description" })
  public description: string;

  @column({ columnName: "PPS_CONSECUTIVO", serializeAs: "consecutive" })
  public consecutive: number;

  @column({ columnName: "PPS_ASIGNADO_A", serializeAs: "assignedTo" })
  public assignedTo: string;

  @column({ columnName: "PPS_USUARIO_MODIFICO", serializeAs: "userModify" })
  public userModify: string;

  @column({ columnName: "PPS_FECHA_MODIFICO", serializeAs: "dateModify" })
  public dateModify: Date;

  @column({ columnName: "PPS_USUARIO_CREO", serializeAs: "userCreate" })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "PPS_FECHA_CREO",
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
