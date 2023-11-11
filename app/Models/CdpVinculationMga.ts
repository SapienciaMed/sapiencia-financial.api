import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CdpVinculationMga extends BaseModel {

  public static table = "CDP_VINCULACION_MGA";

  @column({ isPrimary: true, columnName: "CDP_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "CDP_ACTIVIDAD_MGA", serializeAs: "activitieMga" })
  public activitieMga: number;

  @column({ columnName: "CDP_ACTIVIDAD_DETALLADA_MGA", serializeAs: "activitieDetailMga" })
  public activitieDetailMga: number;

  @column({ columnName: "CDP_PORCENTAJE_AFECTACION", serializeAs: "percentageAfected" })
  public percentageAfected: number;


  @column({ columnName: "CDP_CODCDP", serializeAs: "cdpCode" })
  public cdpCode: number;
}

