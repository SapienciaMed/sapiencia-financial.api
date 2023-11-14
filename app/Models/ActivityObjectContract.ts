import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ActivityObjectContract extends BaseModel {
  public static table = "AOC_ACTIVIDAD_OBJETO_CONTRACTUAL";
  
  @column({ isPrimary: true, columnName:'AOC_CODIGO', serializeAs:'id' })
  public id: number
  
  @column({ columnName:'AOC_DESCRIPCION', serializeAs:'description' })
  public description: number
  
  @column({ columnName:'AOC_ESTADO', serializeAs:'isActive' })
  public isActive: boolean

  
}
