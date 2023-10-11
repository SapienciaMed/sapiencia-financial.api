import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PacAnnualization extends BaseModel {
  
  public static table = "APA_ANUALIZACION_PAC";
  
  @column({ isPrimary: true, columnName:'APA_CODIGO', serializeAs:'id' })
  public id: number

  @column({ columnName:'APA_CODPAC', serializeAs:'pacId'})
  public pacId: number;
  
  @column({ columnName:'APA_TIPO', serializeAs:'type'})
  public type: string;
  
  @column({ columnName:'APA_M1', serializeAs:'jan'})
  public jan: number;
  
  @column({ columnName:'APA_M2', serializeAs:'feb'})
  public feb: number;
  
  @column({ columnName:'APA_M3', serializeAs:'mar'})
  public mar: number;
  
  @column({ columnName:'APA_M4', serializeAs:'abr'})
  public abr: number;
  
  @column({ columnName:'APA_M5', serializeAs:'may'})
  public may: number;
  
  @column({ columnName:'APA_M6', serializeAs:'jun'})
  public jun: number;
  
  @column({ columnName:'APA_M7', serializeAs:'jul'})
  public jul: number;
  
  @column({ columnName:'APA_M8', serializeAs:'ago'})
  public ago: number;
  
  @column({ columnName:'APA_M9', serializeAs:'sep'})
  public sep: number;
  
  @column({ columnName:'APA_M10', serializeAs:'oct'})
  public oct: number;
  
  @column({ columnName:'APA_M11', serializeAs:'nov'})
  public nov: number;
  
  @column({ columnName:'APA_M12', serializeAs:'dec'})
  public dec: number;
  
  @column({ columnName: "APA_FECHA_MODIFICO", serializeAs: "dateModify" })
  public dateModify: Date;

  @column.dateTime({
    autoCreate: true,
    columnName: "APA_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;
}
