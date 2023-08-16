import { BaseModel, HasOne, column, hasOne,  } from "@ioc:Adonis/Lucid/Orm";
import VinculationMGA from "./VinculationMGA";

export default class ActivitiesMGA  extends BaseModel {
  public static table = "MGA_ACTIVDADES_DETALLADAS_MGA";

  @column({ isPrimary: true, columnName: "MGA_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "MGA_DESCRIPCION", serializeAs: "description" })
  public descriptionMGA: string;

  @column({ columnName: "MGA_UNIDAD_MEDIDA", serializeAs: "unit" })
  public unit: string;
  
  @column({ columnName: "MGA_CANTIDAD", serializeAs: "quantity" })
  public quantity: number;

  @column({ columnName: "MGA_COSTO", serializeAs: "cost" })
  public cost: number;

  @hasOne(() => VinculationMGA, {
    localKey: "id",
    foreignKey: "mgaId",
    serializeAs: "vinculation",
  })
  public vinculation: HasOne<typeof VinculationMGA>;
}
