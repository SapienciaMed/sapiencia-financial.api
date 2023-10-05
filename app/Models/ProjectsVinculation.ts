import { BaseModel, BelongsTo, HasOne, belongsTo, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import FuntionalAreas from "./FunctionalArea";
import FunctionalProject from "./FunctionalProject";

export default class ProjectsVinculation extends BaseModel {
  public static table = "VPY_VINCULACIONES_PROYECTO";

  @column({ isPrimary: true, columnName: "VPY_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    columnName: "VPY_CODARF_AREA_FUNCIONAL",
    serializeAs: "functionalAreaId",
  })
  public functionalAreaId: number;

  // @column({ columnName: "VPY_CODIGO_PROYECTO", serializeAs: "projectId" })
  // public projectId: string;

  // @column({
  //   columnName: "VPY_CONCEPTO_PROYECTO",
  //   serializeAs: "conceptProject",
  // })
  // public conceptProject: string;

  // @column({ columnName: "VPY_VALOR_PRESUPUESTADO", serializeAs: "budgetValue" })
  // public budgetValue: number;

  // @column({ columnName: "VPY_VALOR_ASIGNADO", serializeAs: "assignmentValue" })
  // public assignmentValue: number;

  @column({
    columnName: "VPY_VINCULADO",
    serializeAs: "linked",
    prepare: (val) => (String(val) === "true" ? 1 : 0),
    serialize: (val) => Boolean(val),
  })
  public linked: boolean;

  @column({ columnName: "VPY_TIPO", serializeAs: "type" })
  public type: string;

  @column({
    columnName: "VPY_CODPFU_PROYECTO_FUNCIONAMIENTO",
    serializeAs: "operationProjectId",
  })
  public operationProjectId: number;

  @column({
    columnName: "VPY_CODINV_PROYECTO_INVERSION",
    serializeAs: "investmentProjectId",
  })
  public investmentProjectId: number;

  @column({ columnName: "VPY_USUARIO_CREO", serializeAs: "userCreate" })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "VPY_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;

  @hasOne(() => FuntionalAreas, {
    localKey: "functionalAreaId",
    foreignKey: "id",
    serializeAs: "areaFuntional",
  })
  public areaFuntional: HasOne<typeof FuntionalAreas>;



  @belongsTo(() => FunctionalProject, {
    localKey: "id",
    foreignKey: "operationProjectId",
  })
  public functionalProject: BelongsTo<typeof FunctionalProject>;
}
