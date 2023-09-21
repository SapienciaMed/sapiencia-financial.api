import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm';
import Entities from './Entities';

export default class FunctionalProject extends BaseModel {

  public static table = "PFU_PROYECTOS_FUNCIONAMIENTO";

  @column({
    isPrimary: true,
    columnName: "PFU_CODIGO",
    serializeAs: "id"
  })
  public id: number;

  @column({
    columnName: 'PPR_CODECP_ENTIDAD',
    serializeAs: "entityId"
  })
  public entityId: number;

  @column({
    columnName: "PFU_NUMERO",
    serializeAs: "number"
  })
  public number: string;

  @column({
    columnName: "PFU_NOMBRE",
    serializeAs: "name"
  })
  public name: string;

  @column({
    columnName: "PFU_ACTIVO",
    serializeAs: "isActivated"
  })
  public isActivated: boolean;

  @column({
    columnName: "PFU_EJERCICIO",
    serializeAs: "exercise"
  })
  public exercise: number;

  @column({
    columnName: "PFU_VALIDEZ_DESDE",
    serializeAs: "dateFrom"
  })
  public dateFrom: Date;

  @column({
    columnName: "PFU_VALIDEZ_HASTA",
    serializeAs: "dateTo"
  })
  public dateTo: Date;

  @column({
    columnName: "PFU_VALOR_PRESUPUESTADO",
    serializeAs: "budgetValue"
  })
  public budgetValue: number;

  @column({
    columnName: "PFU_VALOR_ASIGNADO",
    serializeAs: "assignmentValue"
  })
  public assignmentValue: number;

  @column({
      columnName: "PFU_USUARIO_MODIFICO",
      serializeAs: "userModify"
  })
  public userModify: string;

  @column({
    columnName: "PFU_FECHA_MODIFICO",
    serializeAs: "dateModify"
  })
  public dateModify: Date;

  @column({
    columnName: "PFU_USUARIO_CREO",
    serializeAs: "userCreate"
  })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "PFU_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;

  @hasOne(() => Entities, {
    localKey: "entityId",
    foreignKey: "id",
    serializeAs: "entity",
  })
  public entity: HasOne<typeof Entities>;

}
