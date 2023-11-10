import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import AmountBudgetAvailability from "./AmountBudgetAvailability";
import BudgetRecord from "./BudgetRecord";
import Pago from "./PagPagos";

export default class LinkRpcdp extends BaseModel {
  public static table = "VRP_VINCULACION_RPR_ICD";

  @column({ isPrimary: true, columnName: "VRP_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    columnName: "VRP_CODRPR_REGISTRO_PRESUPUESTAL",
    serializeAs: "rpId",
  })
  public rpId: number;

  @column({ columnName: "VRP_CODICD_IMPORTES_CDP", serializeAs: "amountCdpId" })
  public amountCdpId: number;

  @column({ columnName: "VRP_VALOR_INICIAL", serializeAs: "initialAmount" })
  public initialAmount: number;

  @column({ columnName: "VRP_VALOR_MOD_CREDITO", serializeAs: "creditAmount" })
  public creditAmount: number;

  @column({
    columnName: "VRP_VALOR_MOD_CONTRACREDITO",
    serializeAs: "againtsAmount",
  })
  public againtsAmount: number;

  @column({
    columnName: "VRP_VALOR_FIJADO_CONCLUIDO",
    serializeAs: "fixedCompleted",
  })
  public fixedCompleted: number;

  @column({ columnName: "VRP_VALOR_FINAL", serializeAs: "finalAmount" })
  public finalAmount: number;

  @column({ columnName: "VRP_ACTIVO", serializeAs: "isActive" })
  public isActive: boolean;

  @column({
    columnName: "VRP_MOTIVO_ANULACION",
    serializeAs: "reasonCancellation",
  })
  public reasonCancellation: string;

  @column({ columnName: "VRP_POSICION", serializeAs: "position" })
  public position: number;

  @column({ columnName: "VRP_OBSERVACION", serializeAs: "observation" })
  public observation: string;

  @belongsTo(() => AmountBudgetAvailability, {
    localKey: "id",
    foreignKey: "amountCdpId",
    serializeAs: "amountBudgetAvailability",
  })
  public amountBudgetAvailability: BelongsTo<typeof AmountBudgetAvailability>;

  @belongsTo(() => BudgetRecord, {
    foreignKey: "rpId", // La clave foránea en LinkRpcdp que apunta al ID de BudgetRecord
    localKey: "id", // La clave primaria en BudgetRecord
    serializeAs: "budgetRecord",
  })
  public budgetRecord: BelongsTo<typeof BudgetRecord>;

  @hasMany(() => Pago, {
    foreignKey: 'vinculacionRpCode', 
    localKey: 'id',
  })
  public pagos: HasMany<typeof Pago>;
}
