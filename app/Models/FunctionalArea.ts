import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import ProjectsVinculation from "./ProjectsVinculation";

export default class FunctionalArea  extends BaseModel {
  public static table = "ARF_AREAS_FUNCIONALES";

  @column({ isPrimary: true, columnName: "ARF_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "ARF_CODIGO_REFERENCIA", serializeAs: "number" })
  public number: string;
  
  @column({ columnName: "ARF_DENOMINACION", serializeAs: "denomination" })
  public denomination: string;

  @column({ columnName: "ARF_DESCRIPCION", serializeAs: "description" })
  public description: string;

  @column({ columnName: "ARF_USUARIO_CREO", serializeAs: "userCreate" })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "ARF_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;


  @hasMany(() => ProjectsVinculation, {
    localKey: "id",
    foreignKey: "functionalAreaId",
  })
  public projectsVinculation: HasMany<typeof ProjectsVinculation>;
}
