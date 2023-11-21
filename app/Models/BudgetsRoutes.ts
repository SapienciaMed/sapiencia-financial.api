import {
  BaseModel,
  HasOne,
  column,
  hasMany,
  hasOne,
  HasMany,
} from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import ProjectsVinculation from "./ProjectsVinculation";
import Budgets from "./Budgets";
import PosPreSapiencia from "./PosPreSapiencia";
import Funds from "./Funds";
import AmountBudgetAvailability from "./AmountBudgetAvailability";

export default class BudgetsRoutes extends BaseModel {
  public static table = "RPP_RUTAS_PRESUPUESTALES";

  @column({ isPrimary: true, columnName: "RPP_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    columnName: "RPP_CODVPY_PROYECTO",
    serializeAs: "idProjectVinculation",
  })
  public idProjectVinculation: number;

  @column({ columnName: "RPP_CENTRO_GESTOR", serializeAs: "managementCenter" })
  public managementCenter: string;

  @column({ columnName: "RPP_DIV", serializeAs: "div" })
  public div: string;

  @column({ columnName: "RPP_CODPPR_POSPRE", serializeAs: "idBudget" })
  public idBudget: number;

  @column({
    columnName: "RPP_CODPPS_POSPRE_SAPIENCIA",
    serializeAs: "idPospreSapiencia",
  })
  public idPospreSapiencia: number;

  @column({ columnName: "RPP_CODFND_FONDO", serializeAs: "idFund" })
  public idFund: number;

  @column({ columnName: "RPP_SALDO", serializeAs: "balance" })
  public balance: number;

  @column({ columnName: "RPP_SALDO_INICIAL", serializeAs: "initialBalance" })
  public initialBalance: number;

  @column({ columnName: "RPP_USUARIO_MODIFICO", serializeAs: "userModify" })
  public userModify: string;

  @column({ columnName: "RPP_FECHA_MODIFICO", serializeAs: "dateModify" })
  public dateModify: Date;

  @column({ columnName: "RPP_USUARIO_CREO", serializeAs: "userCreate" })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "RPP_FECHA_CREO",
    serializeAs: "dateCreate",
  })
  public dateCreate: DateTime;

  @hasOne(() => ProjectsVinculation, {
    localKey: "idProjectVinculation",
    foreignKey: "id",
    serializeAs: "projectVinculation",
  })
  public projectVinculation: HasOne<typeof ProjectsVinculation>;

  @hasOne(() => Budgets, {
    localKey: "idBudget",
    foreignKey: "id",
    serializeAs: "budget",
  })
  public budget: HasOne<typeof Budgets>;

  @hasOne(() => PosPreSapiencia, {
    localKey: "idPospreSapiencia",
    foreignKey: "id",
    serializeAs: "pospreSapiencia",
  })
  public pospreSapiencia: HasOne<typeof PosPreSapiencia>;

  @hasOne(() => Funds, {
    localKey: "idFund",
    foreignKey: "id",
    serializeAs: "fund",
  })
  public funds: HasOne<typeof Funds>;

  @hasMany(() => AmountBudgetAvailability, {
    foreignKey: "idRppCode",
    localKey: "id",
    serializeAs: "amountBudgetAvailabilities",
  })
  public amountBudgetAvailabilities: HasMany<typeof AmountBudgetAvailability>;
}
