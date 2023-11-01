import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Component extends BaseModel {
  public static table = "RPC_COMPONENTE";
  
  @column({ isPrimary: true, columnName:'RPC_CODIGO', serializeAs:'id' })
  public id: number
  
  @column({  columnName:'RPC_CODIGO', serializeAs:'RPC_NOMBRE' })
  public name: string
}
