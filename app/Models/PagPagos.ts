import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import LinkRpcdp from './LinkRpcdp';

export default class Pago extends BaseModel {
  public static table = 'PAG_PAGOS';

  @column({ isPrimary: true, columnName: 'PAG_CODIGO', serializeAs: 'id' })
  public id: number;

  @column({ columnName: 'PAG_CODVRP_VINCULACION_RP', serializeAs: 'vinculacionRpCode' })
  public vinculacionRpCode: number;

  @column({ columnName: 'PAG_VALOR_CAUSADO', serializeAs: 'valorCausado' })
  public valorCausado: number;

  @column({ columnName: 'PAG_VALOR_PAGADO', serializeAs: 'valorPagado' })
  public valorPagado: number;

  @column({ columnName: 'PAG_USUARIO_CREO', serializeAs: 'usuarioCreo' })
  public usuarioCreo: string;

  @column({ columnName: 'PAG_FECHA_CREO', serializeAs: 'fechaCreo' })
  public fechaCreo: string;

  @column({ columnName: 'PAG_MES', serializeAs: 'mes' }) 
  public mes: number;

  @column({ columnName: 'PAG_EJERCICIO', serializeAs: 'ejercicio' }) 
  public ejercicio: string;

  @belongsTo(() => LinkRpcdp, {
    localKey: 'vinculacionRpCode',
    foreignKey: 'VRP_CODIGO',
    serializeAs: 'vinculacionRprIcd',
  })
  public LinkRpcdp: BelongsTo<typeof LinkRpcdp>;
}
