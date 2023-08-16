import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import AdditionsMovement from './AdditionsMovement';

export default class Addition extends BaseModel {

  public static table = "ADC_ADICIONES";

  @column({ isPrimary: true, columnName: "ADC_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "ADC_ACTO_ADMINISTRATIVO_DISTRITO", serializeAs: "actAdminDistrict" })
  public actAdminDistrict: string;

  @column({ columnName: "ADC_ACTO_ADMINISTRATIVO_SAPIENCIA", serializeAs: "actAdminSapiencia" })
  public actAdminSapiencia: string;

  @column({ columnName: "ADC_USUARIO_MODIFICO", serializeAs: "userModify" })
  public userModify: string;

  @column({ columnName: "ADC_FECHA_MODIFICO", serializeAs: "dateModify" })
  public dateModify: Date;

  @column({ columnName: "ADC_USUARIO_CREO", serializeAs: "userCreate" })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "ADC_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;

  @hasMany(() => AdditionsMovement, {
    localKey: "id",
    foreignKey: "additionId",
  })
  public additionMove: HasMany<typeof AdditionsMovement>;

}
