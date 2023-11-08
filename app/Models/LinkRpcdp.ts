import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import AmountBudgetAvailability from './AmountBudgetAvailability';

export default class LinkRpcdp extends BaseModel {
  public static table = "VRP_VINCULACION_RPR_ICD";

  @column({ isPrimary: true, columnName: 'VRP_CODIGO', serializeAs: 'id' })
  public id: number

  @column({ columnName: 'VRP_CODRPR_REGISTRO_PRESUPUESTAL', serializeAs: 'rpId' })
  public rpId: number

  @column({ columnName: 'VRP_CODICD_IMPORTES_CDP', serializeAs: 'amountCdpId' })
  public amountCdpId: number

  @column({ columnName: 'VRP_VALOR_INICIAL', serializeAs: 'initialAmount' })
  public initialAmount: number

  @column({ columnName: 'VRP_ACTIVO', serializeAs: 'isActive' })
  public isActive: boolean

  @column({ columnName: 'VRP_MOTIVO_ANULACION', serializeAs: 'reasonCancellation' })
  public reasonCancellation: string
  
  @column({ columnName: 'VRP_POSICION', serializeAs: 'position' })
  public position: number

  @belongsTo(() => AmountBudgetAvailability, {
    localKey: "id",
    foreignKey: "amountCdpId",
    serializeAs: "amountBudgetAvailability",
  })
  public amountBudgetAvailability: BelongsTo<typeof AmountBudgetAvailability>;  


}
