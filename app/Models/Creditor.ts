import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Creditor extends BaseModel {
  public static table = "ACR_ACREEDORES";

  @column({ isPrimary: true, columnName:'ACR_CODIGO', serializeAs:'id' })
  public id: number
  
  @column({ columnName:'ACR_TIPO_DOCUMENTO', serializeAs:'typeDocument' })
  public typeDocument: string

  @column({ columnName:'ACR_NUMERO_DOCUMENTO', serializeAs:'document' })
  public document: string
  
  @column({ columnName:'ACR_IDENTIFICACION_FISCAL', serializeAs:'taxIdentification' })
  public taxIdentification: string
  
  @column({ columnName:'ACR_NOMBRE', serializeAs:'name' })
  public name: string
  
  @column({ columnName:'ACR_CIUDAD', serializeAs:'city' })
  public city: string
  
  @column({ columnName:'ACR_DIRECCION', serializeAs:'address' })
  public address: string
  
  @column({ columnName:'ACR_TELEFONO', serializeAs:'phone' })
  public phone: number
  
  @column({ columnName:'ACR_CORREO_ELECTRONICO', serializeAs:'email' })
  public email: string
  
  @column({ columnName:'ACR_USUARIO_MODIFICO', serializeAs:'userModify' })
  public userModify: string
  
  @column({ columnName:'ACR_USUARIO_CREO', serializeAs:'userCreate' })
  public userCreate: string

  @column.dateTime({
    autoCreate: true,
    columnName: "ACR_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;

  @column({ columnName: 'ACR_FECHA_MODIFICO', serializeAs: "dateModify" })
  public dateModify: string;
}
