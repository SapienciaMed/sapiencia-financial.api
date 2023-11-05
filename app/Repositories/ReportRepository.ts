import { IReportColumnExecutionExpenses } from "App/Interfaces/ReportInterfaces";
import AdditionsMovement from "App/Models/AdditionsMovement";
import AmountBudgetAvailability from "App/Models/AmountBudgetAvailability";
import Pac from "App/Models/Pac";

export interface IReportRepository {
  generateReportPac(year: number): Promise<any[]>;
  generateReportExecutionExpenses(year: number): Promise<any[]>;
}

export default class ReportRepository implements IReportRepository {
  async generateReportPac(year: number): Promise<any[]> {
    const res = await Pac.query().where("exercise", year);

    return res.map((i) => i.serialize());
  }

  async generateReportExecutionExpenses(year: number): Promise<any> {
    const resObject: IReportColumnExecutionExpenses[] = [
      {
        Fondo: "",
        "Centro Gestor": "",
        "Posición Presupuestaria": "",
        "Área Funcional": "",
        Proyecto: "",
        Nombre: "",
        "Ppto Inicial": "",
        Reducciones: "",
        Adiciones: "",
        Créditos: "",
        "Contra créditos": "",
        "Total Ppto Actual": "",
        Disponibilidad: "",
        Compromiso: "",
        Factura: "",
        Pagos: "",
        "Disponible Neto": "",
        Ejecución: "",
        "porcentaje Ejecución": "",
      },
    ];

    //Addition Movement Query
    const queryAdditionMovement = await AdditionsMovement.query()
      .preload("addition")
      .preload("budgetRoute", (subQuery) =>
        subQuery
          .preload("pospreSapiencia", (subQueryBudgetRoute) =>
            subQueryBudgetRoute.whereILike("ejercise", year)
          )
          .preload("funds")
          .preload("projectVinculation")
      );

    const resAdditionMovement = queryAdditionMovement
      .map((i) => i.serialize())
      .filter((i) => i.budgetRoute?.pospreSapiencia?.id);

    //ICD Query
    const queryAmountBudgetAvailability =
      await AmountBudgetAvailability.query().preload("budgetRoute");

    const resAmountBudgetAvailability = queryAmountBudgetAvailability.map((i) =>
      i.serialize()
    );

    // console.log(resAdditionMovement);
    // console.log(
    //   "----------------------resAdditionMovement-------------------------"
    // );
    // console.log(resAmountBudgetAvailability);
    // console.log(
    //   "----------------------resAmountBudgetAvailability-------------------------"
    // );
    // console.log(resObject);
    // console.log("-----------------------------------------------");

    return { resAdditionMovement, resAmountBudgetAvailability };
  }
}
