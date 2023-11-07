export interface IExcelReportFilters {
  reportId: string;
  year: number;
}

export interface IReportColumnExecutionExpenses {
  Fondo: string;
  "Centro Gestor": string;
  "Posición Presupuestaria": string;
  "Área Funcional": string;
  Proyecto: string;
  Nombre: string;
  "Ppto Inicial": number;
  Reducciones: number;
  Adiciones: number;
  Créditos: number;
  "Contra créditos": number;
  "Total Ppto Actual": number;
  Disponibilidad: number;
  Compromiso: number;
  Factura: number;
  Pagos: number;
  "Disponible Neto": number;
  Ejecución: number;
  "porcentaje Ejecución": number;
}
