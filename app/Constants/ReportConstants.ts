import {
  IReportColumnAccountsPayable,
  IReportColumnBudgetExecution,
  IReportColumnCdpBalance,
  IReportColumnDetailedExecution,
  IReportColumnExecutionExpenses,
  IReportColumnExecutionIncome,
  IReportColumnRpBalance,
} from "App/Interfaces/ReportsInterfaces";

export const InitialReportExecutionExpenses: IReportColumnExecutionExpenses[] =
  [
    {
      Fondo: "",
      "Centro Gestor": "",
      "Posición Presupuestaria": "",
      "Área Funcional": "",
      Proyecto: "",
      Nombre: "",
      "Ppto Inicial": 0,
      Reducciones: 0,
      Adiciones: 0,
      Créditos: 0,
      "Contra créditos": 0,
      "Total Ppto Actual": 0,
      Disponibilidad: 0,
      Compromiso: 0,
      Factura: 0,
      Pagos: 0,
      "Disponible Neto": 0,
      Ejecución: 0,
      "Porcentaje de Ejecución": "",
    },
  ];

export const InitialReportCdpBalance: IReportColumnCdpBalance[] = [
  {
    "Consecutivo CDP SAP": 0,
    "Consecutivo CDP Aurora": 0,
    Posición: 0,
    Fondo: "",
    "Centro Gestor": "",
    "Posicion Presupuestaria": "",
    "Area Funcional": "",
    Proyecto: "",
    "Nombre proyecto": "",
    "Valor Final": 0,
  },
];

export const InitialReportRpBalance: IReportColumnRpBalance[] = [
  {
    "Consecutivo RP SAP": 0,
    "Consecutivo RP Aurora": 0,
    Posición: 0,
    Fondo: "",
    "Centro Gestor": "",
    "Posicion Presupuestaria": "",
    "Area Funcional": "",
    Proyecto: "",
    "Nombre proyecto": "",
    "Valor Final": 0,
  },
];

export const InitialReportAccountsPayable: IReportColumnAccountsPayable[] = [
  {
    "Consecutivo RP SAP": 0,
    "Consecutivo RP Aurora": 0,
    Posición: 0,
    Fondo: "",
    "Centro Gestor": "",
    "Posicion Presupuestaria": "",
    "Area Funcional": "",
    Proyecto: "",
    "Nombre proyecto": "",
    "Valor Final": 0,
    "Valor Causado": 0,
  },
];

export const InitialReportDetailedExecution: IReportColumnDetailedExecution[] =
  [
    {
      Fondo: "",
      "Nombre Fondo": "",
      Proyecto: "",
      "Nombre Proyecto": "",
      "Pospre origen": "",
      "Nombre Pospre": "",
      "Pospre Sapiencia": "",
      "Presupuesto Inicial": 0,
      Reducciones: 0,
      Adiciones: 0,
      Créditos: 0,
      "Contra créditos": 0,
      "Presupuesto total": 0,
      Disponibilidad: 0,
      Compromiso: 0,
      Factura: 0,
      Pagos: 0,
      "Total Disponible Neto": 0,
      "Total Ejecución": 0,
      "Porcentaje de Ejecución": "",
    },
  ];

export const InitialReportExecutionIncome: IReportColumnExecutionIncome[] = [
  {
    Fondo: "",
    "Centro Gestor": "",
    "Posición Presupuestaria": "",
    "Área Funcional": "",
    Proyecto: "",
    "Nombre Pospre": "",
    "Ppto Inicial": 0,
    Reducciones: 0,
    Adiciones: 0,
    Créditos: 0,
    "Contra créditos": 0,
    "Total Ppto Actual": 0,
    Recaudo: 0,
    "Por Recaudar": 0,
    "Total Ejecución": 0,
    "Porcentaje de Ejecución": "",
  },
];

export const InitialReportBudgetExecution: IReportColumnBudgetExecution[] = [
  {
    Proyecto: "",
    Pospre: "",
    Concepto: "",
    "Presupuesto Ajustado": 0,
    "Ejecución CDP": 0,
    "Porcentaje Ejecución CDP": "",
    "Ejecución RP": 0,
    "Porcentaje Ejecución RP": "",
    "Ejecución Causados": 0,
    "Porcentaje Ejecución Causados": "",
    "Ejecución Pagos": 0,
    "Porcentaje Ejecución Pagos": "",
    Disponible: 0,
    "Fecha Actual": "",
  },
];
