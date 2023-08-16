import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Entities extends BaseModel {
  public static table = "TTR_TIPOS_TRASLADOS";

  @column({ isPrimary: true, columnName: "TTR_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "TTR_NOMBRE", serializeAs: "name" })
  public name: string;
}
