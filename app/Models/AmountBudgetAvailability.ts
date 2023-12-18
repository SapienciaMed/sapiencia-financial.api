import {
  BaseModel,
  BelongsTo,
  HasMany,
  HasOne,
  belongsTo,
  column,
  hasMany,
  hasOne,
} from "@ioc:Adonis/Lucid/Orm";
import BudgetAvailability from "./BudgetAvailability";
import BudgetsRoutes from "./BudgetsRoutes";
import LinkRpcdp from "./LinkRpcdp";

export default class AmountBudgetAvailability extends BaseModel {
  public static table = "ICD_IMPORTES_CDP";

  @column({ isPrimary: true, columnName: "ICD_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "ICD_CODCDP", serializeAs: "cdpCode" })
  public cdpCode: number;

  @column({
    columnName: "ICD_CODRPP_RUTA_PRESUPUESTAL",
    serializeAs: "idRppCode",
  })
  public idRppCode: number;

  @column({ columnName: "ICD_POSICION", serializeAs: "cdpPosition" })
  public cdpPosition: number;

  @column({ columnName: "ICD_VALOR", serializeAs: "amount" })
  public amount: number;

  @column({ columnName: "ICD_ACTIVO", serializeAs: "isActive" })
  public isActive: boolean;

  @column({ columnName: "ICD_MOTIVO_ANULACION", serializeAs: "reasonCancellation" })
  public reasonCancellation: string;

  @column({ columnName: "IDC_MODIFICADO_CONTRACREDITO", serializeAs: "modifiedIdcCountercredit" })
  public modifiedIdcCountercredit: number;

  @column({ columnName: "IDC_MOFICICADO_CREDITO", serializeAs: "idcModifiedCredit" })
  public idcModifiedCredit: number;

  @column({ columnName: "IDC_FIJADO_CONCLUIDO", serializeAs: "idcFixedCompleted" })
  public idcFixedCompleted: number;

  @column({ columnName: "IDC_VALOR_FINAL", serializeAs: "idcFinalValue" })
  public idcFinalValue: number;

  @hasOne(() => BudgetAvailability, {
    localKey: "cdpCode",
    foreignKey: "id",
    serializeAs: "budgetAvailability",
  })
  public budgetAvailability: HasOne<typeof BudgetAvailability>;

  @belongsTo(() => BudgetsRoutes, {
    localKey: "id",
    foreignKey: "idRppCode",
    serializeAs: "budgetRoute",
  })
  public budgetRoute: BelongsTo<typeof BudgetsRoutes>;

  @hasMany(() => LinkRpcdp, {
    localKey: 'id',
    foreignKey: 'amountCdpId',
    serializeAs: 'linkRpcdps',
  })
  public linkRpcdps: HasMany<typeof LinkRpcdp>;


}
