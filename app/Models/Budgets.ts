import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Funds extends BaseModel {
  public static table = "PPR_POSICION_PRESUPUESTARIA";

  @column({ isPrimary: true, columnName: "PPR_CODIGO", serializeAs: "id" })
  public id: number;
}
