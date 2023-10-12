import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import PacAnnualization from './PacAnnualization';

export default class Pac extends BaseModel {
  public static table = "PAC_PROGRAMACION_ANUAL_CAJA";

  @column({ isPrimary: true, columnName:'PAC_CODIGO', serializeAs:'id' })
  public id: number

  @column({ columnName:'PAC_TIPO_RECURSO', serializeAs:'sourceType' })
  public sourceType: number

  @column({ columnName:'PAC_CODRPP_RUTA_PRESUPUESTAL', serializeAs:'budgetRouteId' })
  public budgetRouteId: number

  @column({ columnName:'PAC_VERSION', serializeAs:'version' })
  public version: number

  @column({ columnName:'PAC_VIGENCIA', serializeAs:'exercise' })
  public exercise: number

  @column({ columnName:'PAC_ACTIVO', serializeAs:'isActive' })
  public isActive: boolean

  @column({ columnName: "PAC_FECHA_MODIFICO", serializeAs: "dateModify" })
  public dateModify: Date;

  @column.dateTime({
    autoCreate: true,
    columnName: "PAC_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;

  @hasMany(() => PacAnnualization, {
    foreignKey: "pacId",
    serializeAs: "annualizations",
  })
  public annualizations: HasMany<typeof PacAnnualization>;

}
