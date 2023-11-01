import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class BudgetRecord extends BaseModel {
  public static table = "RPP_REGISTRO_PRESUPUESTAL";

  @column({ isPrimary: true, columnName: "RPP_CODIGO", serializeAs: "id" })
  public id: number

  @column({ columnName: "RPP_CODIGO_RP", serializeAs: "rpCode" })
  public rpCode: string

  @column({ columnName: "RPP_TIPO_CONTRATISTAS", serializeAs: "contractorType" })
  public contractorType: string
  
  @column({ columnName: "RPP_CODIGO_CONTRATISTA", serializeAs: "contractorId" })
  public contractorId: number

  @column({ columnName: "RPP_FECHA_DOCUMENTO", serializeAs: "documentDate" })
  public documentDate: Date

  @column({ columnName: "RPP_FECHA_VALIDEZ", serializeAs: "dateValidity" })
  public dateValidity: Date

  @column({ columnName: "RPP_CODIGO_DEPENDENCIA", serializeAs: "dependencyId" })
  public dependencyId: number

  @column({ columnName: "RPP_OBJETO_CONTRACTUAL", serializeAs: "contractualObject" })
  public contractualObject: string

  @column({ columnName: "RPP_CODIGO_COMPONENTE", serializeAs: "componentId" })
  public componentId: number

  @column({ columnName: "RPP_USUARIO_MODIFICO", serializeAs: "userCreat" })
  public userCreat: string

  @column({ columnName: "RPP_USUARIO_CREO", serializeAs: "dateModify" })
  public dateModify: string

  @column.dateTime({ autoCreate: true, columnName: 'RPP_FECHA_CREO', serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'RPP_FECHA_MODIFICO' })
  public updatedAt: DateTime
}
