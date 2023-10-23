import { HasOne } from '@ioc:Adonis/Lucid/Orm';
import { BaseModel, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Addition from './Addition';
import BudgetsRoutes from './BudgetsRoutes';

export default class AdditionsMovement extends BaseModel {

  public static table = "MAD_MOVIMIENTOS_ADICION";

  @column({ isPrimary: true, columnName: "MAD_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "MAD_CODADC_ADICION", serializeAs: "additionId" })
  public additionId: number;

  @column({ columnName: "MAD_TIPO", serializeAs: "type" })
  public type: string;
  

  @column({ columnName: "MAD_CODRPP_RUTA_PRESUPUESTAL", serializeAs: "budgetRouteId" })
  public budgetRouteId: number;

  @column({ columnName: "MAD_VALOR", serializeAs: "value" })
  public value: number;

  @hasOne(() => Addition, {
    localKey: "additionId",
    foreignKey: "id",
    serializeAs: "addition",
  })
  public addition: HasOne<typeof Addition>;

  @hasOne(() => BudgetsRoutes, {
    localKey: "budgetRouteId",
    foreignKey: "id",
    serializeAs: "budgetRoute",
  })
  public budgetRoute: HasOne<typeof BudgetsRoutes>;

}
