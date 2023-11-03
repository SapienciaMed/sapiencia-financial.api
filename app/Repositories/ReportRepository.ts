import { IReportColumnExecutionExpenses } from "App/Interfaces/ReportInterfaces";
import BudgetsRoutes from "App/Models/BudgetsRoutes";
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

  async generateReportExecutionExpenses(year: number): Promise<any[]> {
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

    const query = await BudgetsRoutes.query()
      .preload("pospreSapiencia", (subQuery) =>
        subQuery.whereILike("ejercise", year)
      )
      .preload("funds")
      .preload("projectVinculation");

    const res = query
      .map((i) => i.serialize())
      .filter((i) => i.pospreSapiencia?.id);

    console.log(res);
    console.log("-----------------------------------------------");
    console.log(resObject);
    console.log("-----------------------------------------------");

    return res;
  }
}
