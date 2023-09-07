import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm';
import Transfer from './Transfer';
import BudgetsRoutes from './BudgetsRoutes';

export default class TransfersMovement extends BaseModel {

  public static table = "MTR_MOVIMIENTOS_TRASLADOS";

  @column({ isPrimary: true, columnName: "MTR_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "MTR_CODTRA_TRASLADO", serializeAs: "transferId" })
  public transferId: number;

  @column({ columnName: "MTR_TIPO", serializeAs: "type" })
  public type: string;

  @column({ columnName: "MTR_CODRPP_RUTA_PRESUPUESTAL", serializeAs: "budgetRouteId" })
  public budgetRouteId: number;

  @column({ columnName: "MTR_VALOR", serializeAs: "value" })
  public value: number;

  @hasOne(() => Transfer, {
    localKey: "transferId",
    foreignKey: "id",
    serializeAs: "transfer",
  })
  public transfer: HasOne<typeof Transfer>;

  @hasOne(() => BudgetsRoutes, {
    localKey: "budgetRouteId",
    foreignKey: "id",
    serializeAs: "budgetRoute",
  })
  public budgetRoute: HasOne<typeof BudgetsRoutes>;

}
