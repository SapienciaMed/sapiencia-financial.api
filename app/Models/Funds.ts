import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Funds extends BaseModel {
  public static table = "FND_FONDOS";

  @column({ isPrimary: true, columnName: "FND_CODIGO", serializeAs: "id" })
  public id: number;
}
