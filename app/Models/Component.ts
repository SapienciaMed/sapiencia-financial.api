import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Component extends BaseModel {
  public static table = "CRP_COMPONENTES_REGISTRO_PRESUPUESTAL";
  
  @column({ isPrimary: true, columnName:'CRP_CODIGO', serializeAs:'id' })
  public id: number
  
  @column({  columnName:'CRP_CODIGO', serializeAs:'RPC_NOMBRE' })
  public name: string
}
