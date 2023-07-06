import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Entities extends BaseModel {
  public static table = "ECP_ENTIDADES_CP";

  @column({ isPrimary: true, columnName: "ECP_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "ECP_NOMBRE", serializeAs: "name" })
  public name: string;
}
