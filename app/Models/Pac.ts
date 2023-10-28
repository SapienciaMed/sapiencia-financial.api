import { BaseModel, column, hasMany, HasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm';
import BudgetsRoutes from './BudgetsRoutes';
import PacAnnualization from './PacAnnualization';

export default class Pac extends BaseModel {
  public static table = "PAC_PROGRAMACION_ANUAL_CAJA";

  @column({ isPrimary: true, columnName:'PAC_CODIGO', serializeAs:'id' })
  public id: number

  @column({ columnName:'PAC_TIPO_RECURSO', serializeAs:'sourceType' })
  public sourceType: string

  @column({ columnName:'PAC_CODRPP_RUTA_PRESUPUESTAL', serializeAs:'budgetRouteId' })
  public budgetRouteId: number

  @column({ columnName:'PAC_VERSION', serializeAs:'version' })
  public version: number

  @column({ columnName:'PAC_VIGENCIA', serializeAs:'exercise' })
  public exercise: number

  @column({ columnName:'PAC_ACTIVO', serializeAs:'isActive' })
  public isActive: boolean
  
  @column({ columnName:'PAC_USUARIO_MODIFICO', serializeAs:'userModify' })
  public userModify: string
  
  @column({ columnName:'PAC_USUARIO_CREO', serializeAs:'userCreate' })
  public userCreate: string

  @column({ columnName:'PAC_FECHA_CREO', serializeAs: "dateCreate" })
  public dateCreate: Date

  @column({ columnName:'PAC_FECHA_MODIFICO', serializeAs: "dateModify" })
  public dateModify: Date

  @hasMany(() => PacAnnualization, {
    localKey: "id",
    foreignKey: "pacId",
    serializeAs: "pacAnnualizations",
  })
  public pacAnnualizations: HasMany<typeof PacAnnualization>;

  @hasOne(() => BudgetsRoutes, {
    localKey: "id",
    foreignKey: "id",
    serializeAs: "budgetRoute",
  })
  public budgetRoute: HasOne<typeof BudgetsRoutes>;

}
