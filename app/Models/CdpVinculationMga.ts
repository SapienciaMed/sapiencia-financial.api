import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon';

export default class CdpVinculationMga extends BaseModel {

  public static table = "VCM_VINCULACION_CDP_MGA";

  @column({ isPrimary: true, columnName: "VCM_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "VCM_ACTIVIDAD_MGA", serializeAs: "activitieMga" })
  public activitieMga: number;

  @column({ columnName: "VCM_ACTIVIDAD_DETALLADA_MGA", serializeAs: "activitieDetailMga" })
  public activitieDetailMga: number;

  @column({ columnName: "VCM_PORCENTAJE_AFECTACION", serializeAs: "percentageAfected" })
  public percentageAfected: number;

  @column({ columnName: "VCM_CODCDP", serializeAs: "cdpCode" })
  public cdpCode: number;

  @column({ columnName: "VCM_CODCPC", serializeAs: "cpcCode" })
  public cpcCode: number;

  @column({ columnName: "VCM_USUARIO_CREO", serializeAs: "userCreate" })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "VCM_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;
}
