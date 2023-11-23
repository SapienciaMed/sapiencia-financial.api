import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import TransfersMovement from './TransfersMovement';

export default class Transfer extends BaseModel {

  public static table = "TRA_TRASLADOS";

  @column({ isPrimary: true, columnName: "TRA_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "TRA_ACTO_ADMINISTRATIVO_DISTRITO", serializeAs: "actAdminDistrict" })
  public actAdminDistrict: string;

  @column({ columnName: "TRA_ACTO_ADMINISTRATIVO_SAPIENCIA", serializeAs: "actAdminSapiencia" })
  public actAdminSapiencia: string;

  @column({ columnName: "TRA_VALOR", serializeAs: "value" })
  public value: number;

  @column({ columnName: "TRA_OBSERVACIONES", serializeAs: "observations" })
  public observations: string;

  @column({ columnName: "TRA_USUARIO_MODIFICO", serializeAs: "userModify" })
  public userModify: string;

  @column({ columnName: "TRA_FECHA_MODIFICO", serializeAs: "dateModify" })
  public dateModify: Date;

  @column({ columnName: "TRA_USUARIO_CREO", serializeAs: "userCreate" })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "TRA_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;

  @hasMany(() => TransfersMovement, {
    localKey: "id",
    foreignKey: "transferId",
  })
  public transferMove: HasMany<typeof TransfersMovement>;

}
