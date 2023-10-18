import { BaseModel, BelongsTo, HasOne, belongsTo, column, hasOne } from '@ioc:Adonis/Lucid/Orm';
import CertificateBudgetAvailability from './CertificateBudgetAvailability';
import BudgetsRoutes from './BudgetsRoutes';

export default class IcdAmountsCdp extends BaseModel {
  public static table = 'ICD_IMPORTES_CDP';

  @column({ isPrimary: true, columnName: 'ICD_CODIGO', serializeAs: 'id' })
  public id: number;

  @column({ columnName: 'ICD_CODCDP', serializeAs: 'cdpCode' })
  public cdpCode: number;

  @column({ columnName: 'ICD_CODRPP_RUTA_PRESUPUESTAL', serializeAs: 'idRppCode' })
  public idRppCode: number;

  @column({ columnName: 'ICD_POSICION', serializeAs: 'cdpPosition' })
  public cdpPosition: number;

  @column({ columnName: 'ICD_VALOR', serializeAs: 'amount' })
  public amount: number;

  @hasOne(() => CertificateBudgetAvailability, {
    localKey: 'id',
    foreignKey: 'ICD_CODCDP',
    serializeAs: "certificateBudgetAvailability",
  })
  public certificateBudgetAvailability: HasOne<typeof CertificateBudgetAvailability>; /* Preguntar si esta relacion esta bien */

  @belongsTo(() => BudgetsRoutes, {
    localKey: 'id',
    foreignKey: 'idRppCode',
    serializeAs: "budgetRoute",
  })
  public budgetRoute: BelongsTo<typeof BudgetsRoutes>; /* Preguntar si esta relacion esta bien */
}
