import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class LinkRpcdp extends BaseModel {
  public static table = "VRP_VINCULACION_RP_CDP";

  @column({ isPrimary: true, columnName: 'VRP_CODIGO', serializeAs: 'id' })
  public id: number

  @column({ columnName: 'VRP_CODIGO_RP', serializeAs: 'rpId' })
  public rpId: number

  @column({ columnName: 'VRP_CONSECUTIVO_AURORA', serializeAs: 'auroraConsecutive' })
  public auroraConsecutive: number

  @column({ columnName: 'VRP_CONSECUTIVO_SAP', serializeAs: 'sapConsecutive' })
  public sapConsecutive: number

  @column({ columnName: 'VRP_CODRPP_RUTA_PRESUPUESTAL', serializeAs: 'buggetRouteId' })
  public buggetRouteId: number

  @column({ columnName: 'VRP_VALOR_INICIAL', serializeAs: 'initialValue' })
  public initialValue: number

  @column({ columnName: 'VRP_ACTIVO', serializeAs: 'isActive' })
  public isActive: boolean

  @column({ columnName: 'VRP_MOTIVO_ANULACION', serializeAs: 'reasonCancellation' })
  public reasonCancellation: string

  @column({ columnName: 'VRP_USUARIO_CREO', serializeAs: 'userCreat' })
  public userCreat: string

  @column({ columnName: 'VRP_USUARIO_MODIFICO', serializeAs: 'dateModify' })
  public dateModify: string

  @column.dateTime({ autoCreate: true, columnName: 'VRP_FECHA_CREO', serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'VRP_FECHA_MODIFICO', serializeAs: 'updatedAt' })
  public updatedAt: DateTime
}
