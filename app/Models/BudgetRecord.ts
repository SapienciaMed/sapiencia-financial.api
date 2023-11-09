import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import LinkRpcdp from './LinkRpcdp';
import Creditor from './Creditor';

export default class BudgetRecord extends BaseModel {
  public static table = "RPR_REGISTRO_PRESUPUESTAL";

  @column({ isPrimary: true, columnName: "RPR_CODIGO", serializeAs: "id" })
  public id: number

  @column({ columnName: "RPR_TIPO_PROVEEDOR", serializeAs: "supplierType" })
  public supplierType: string

  @column({ columnName: 'RPR_CODACR_ACREEDOR', serializeAs: "supplierId" })
  public supplierId: number
  
  @column({ columnName: 'RPR_DOCUMENTO_CONTRATISTA', serializeAs: "contractorDocument" })
  public contractorDocument: string
  
  @column({ columnName: 'RPR_FECHA_DOCUMENTO', serializeAs: "documentDate" })
  public documentDate : Date
  
  @column({ columnName: 'RPR_FECHA_VALIDEZ', serializeAs: "dateValidity" })
  public dateValidity : Date
  
  @column({ columnName: 'RPR_CODIGO_DEPENDENCIA', serializeAs: "dependencyId" })
  public dependencyId: number
  
  @column({ columnName: 'RPR_OBJETO_CONTRACTUAL', serializeAs: "contractualObject" })
  public contractualObject: string
  
  @column({ columnName: 'RPR_CODCRP_COMPONENTE', serializeAs: "componentId" })
  public componentId: number
  
  @column({ columnName: 'RPR_CONSECUTIVO_SAP', serializeAs: "consecutiveSap" })
  public consecutiveSap: number

  @column({ columnName: 'RPR_NUMERO_CONTRATO', serializeAs: "contractNumber" })
  public contractNumber: string
  
  @column({ columnName: 'RPR_DOCUMENTO_RESPONSABLE', serializeAs: "responsibleDocument" })
  public responsibleDocument: number
  
  @column({ columnName: 'RPR_DOCUMENTO_SUPERVISOR', serializeAs: "supervisorDocument" })
  public supervisorDocument: number

  @column({ columnName: "RPR_USUARIO_MODIFICO", serializeAs: "userCreate" })
  public userCreate: string

  @column({ columnName: "RPR_USUARIO_CREO", serializeAs: "userModify" })
  public userModify: string

  @column.dateTime({
    autoCreate: true,
    columnName: "RPR_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;

  @column({ columnName: 'RPR_FECHA_MODIFICO', serializeAs: "dateModify" })
  public dateModify: string;

  @hasMany(() => LinkRpcdp, {
    localKey: "id",
    foreignKey: "rpId",
    serializeAs: "linksRp",
  })
  public linksRp: HasMany<typeof LinkRpcdp>;

  @belongsTo(() => Creditor, {
    localKey: "id",
    foreignKey: "supplierId",
    serializeAs: "creditor",
  })
  public creditor: BelongsTo<typeof Creditor>;  

}
