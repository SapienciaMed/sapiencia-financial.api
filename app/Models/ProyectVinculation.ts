import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import FuntionalAreas from "./FunctionalArea";

export default class ProyectVinculation  extends BaseModel {
  public static table = "VPY_VINCULACIONES_PROYECTO";

  @column({ isPrimary: true, columnName: "VPY_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "VPY_CODARF_AREA_FUNCIONAL", serializeAs: "areaFunctionalCodeId" })
  public areaFunctionalCode: number;
  
  @column({ columnName: "VPY_CODIGO_PROYECTO", serializeAs: "codeProyect" })
  public codeProyect: string;

  @column({ columnName: "VPY_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({ columnName: "VPY_VALOR_PLANIFICADO", serializeAs: "plannedValue" })
  public plannedValue: number;

  @column({ columnName: "VPY_VALOR_PRESUPUESTADO", serializeAs: "budgetValue" })
  public budgetValue: number;

  @column({ columnName: "VPY_USUARIO_CREO", serializeAs: "userCreate" })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "VPY_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;

  @hasOne(() => FuntionalAreas, {
    localKey: "areaFunctionalCodeId",
    foreignKey: "id",
    serializeAs: "entity",
  })
  public entity: HasOne<typeof FuntionalAreas>;
  toUpdate: Date;
}
