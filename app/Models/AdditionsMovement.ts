import { HasOne } from '@ioc:Adonis/Lucid/Orm';
import { BaseModel, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Addition from './Addition';
import Funds from './Funds';
import ProjectsVinculation from './ProjectsVinculation';

export default class AdditionsMovement extends BaseModel {

  public static table = "MAD_MOVIMIENTOS_ADICION";

  @column({ isPrimary: true, columnName: "MAD_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "MAD_CODADC_ADICION", serializeAs: "additionId" })
  public additionId: number;

  @column({ columnName: "MAD_TIPO", serializeAs: "type" })
  public type: string;

  @column({ columnName: "MAD_CENTRO_GESTOR", serializeAs: "managerCenter" })
  public managerCenter: string;

  @column({ columnName: "MAD_CODVPY_PROYECTO", serializeAs: "projectId" })
  public projectId: number;

  @column({ columnName: "MAD_CODFND_FONDO", serializeAs: "fundId" })
  public fundId: number;

  @column({ columnName: "MAD_POSICION_PRESUPUESTARIA", serializeAs: "budgetPosition" })
  public budgetPosition: string;

  @column({ columnName: "MAD_VALOR", serializeAs: "value" })
  public value: number;

  @hasOne(() => Addition, {
    localKey: "additionId",
    foreignKey: "id",
    serializeAs: "addition",
  })
  public addition: HasOne<typeof Addition>;

  @hasOne(() => ProjectsVinculation, {
    localKey: "projectId",
    foreignKey: "id",
    serializeAs: "project",
  })
  public project: HasOne<typeof ProjectsVinculation>;

  @hasOne(() => Funds, {
    localKey: "fundId",
    foreignKey: "id",
    serializeAs: "found",
  })
  public found: HasOne<typeof Funds>;

}
