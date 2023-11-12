export interface IExcelReportFilters {
  reportId: string;
  year: number;
}

export interface IHistoryProjects {
  vinculationId: number;
  projectCode: string;
  projectName: string;
  functionalArea: string;
}

export interface IPacReport {
  "Tipo de recurso": string;
  "Centro Gestor": string;
  "Posición Presupuestal": string;
  "Fondo Sapiencia": string;
  "Área Funcional": string;
  Proyecto: string;
  "Nombre proyecto": string;
  "Presupuesto Sapiencia": number;
  "Programado Enero": number;
  "Cobrado Enero": number;
  "Ejecutado Enero": number;
  "Diferencias Enero": number;
  "Programado Febrero": number;
  "Cobrado Febrero": number;
  "Ejecutado Febrero": number;
  "Diferencias Febrero": number;
  "Programado Marzo": number;
  "Cobrado Marzo": number;
  "Ejecutado Marzo": number;
  "Diferencias Marzo": number;
  "Programado Abril": number;
  "Cobrado Abril": number;
  "Ejecutado Abril": number;
  "Diferencias Abril": number;
  "Programado Mayo": number;
  "Cobrado Mayo": number;
  "Ejecutado Mayo": number;
  "Diferencias Mayo": number;
  "Programado Junio": number;
  "Cobrado Junio": number;
  "Ejecutado Junio": number;
  "Diferencias Junio": number;
  "Programado Julio": number;
  "Cobrado Julio": number;
  "Ejecutado Julio": number;
  "Diferencias Julio": number;
  "Programado Agosto": number;
  "Cobrado Agosto": number;
  "Ejecutado Agosto": number;
  "Diferencias Agosto": number;
  "Programado Septiembre": number;
  "Cobrado Septiembre": number;
  "Ejecutado Septiembre": number;
  "Diferencias Septiembre": number;
  "Programado Octubre": number;
  "Cobrado Octubre": number;
  "Ejecutado Octubre": number;
  "Diferencias Octubre": number;
  "Programado Noviembre": number;
  "Cobrado Noviembre": number;
  "Ejecutado Noviembre": number;
  "Diferencias Noviembre": number;
  "Programado Diciembre": number;
  "Cobrado Diciembre": number;
  "Ejecutado Diciembre": number;
  "Diferencias Diciembre": number;
  Recaudado: number;
  "Por Recaudar": number;
  "% Ejecución": number;
}

export interface IReportDetailChangeBudgets {
  "Acto Administrativo Distrito": string;
  "Acto Administrativo Sapiencia": string;
  "Tipo De Modificación": string;
  Proyecto: string;
  "Nombre Proyecto": string;
  "Área Funcional": string;
  Fondo: string;
  Pospre: string;
  "Presupuesto Inicial": number;
  "Adición Presupuesto Gastos": number;
  "Adición Presupuesto Ingresos": number;
  "Reducción Presupuesto Gasto": number;
  "Reducción Presupuesto Ingreso": number;
  "Crédito Presupuesto": number;
  "Contracrédito Presupuesto": number;
}

export interface IReportChangeBudgets {
  "Tipo De Modificación": string;
  "Acto Administrativo Distrito": string;
  "Acto Administrativo Sapiencia": string;
  "Valor Total": number;
  "Valor En Millones": number;
  "Porcentaje Sobre El Presupuesto Inicial": number;
  Observación: string;
}

export interface IReportTransfers {
  "Acto Administrativo Distrito": string;
  "Acto Administrativo Sapiencia": string;
  "Centro Gestor": string;
  "Posición Presupuestal": string;
  Fondo: string;
  "Área Funcional": string;
  Proyecto: string;
  "Valor Contracrédito": number;
  "Valor Crédito": number;
  "Nombre Proyecto": string;
  Observación: string;
}

export interface IReportModifiedRoutes {
  "Tipo De Modificación": string;
  "Acto Administrativo Distrito": string;
  "Acto Administrativo Sapiencia": string;
  "Centro Gestor": string;
  "Posición Presupuestal": string;
  Fondo: string;
  "Área Funcional": string;
  Proyecto: string;
  "Valor Ingreso": number;
  "Valor Gasto": number;
  "Nombre Proyecto": string;
}

export interface IDataBasicProject {
  projectCode: string;
  projectName: string;
  functionalArea: string;
}

export interface IDataCredits {
  id: number;
  transferId: number;
  type: string;
  budgetRouteId: number;
  value: string;
}

export interface IReportColumnExecutionExpenses {
  Id?: number;
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
  "Porcentaje de Ejecución": string;
}

export interface IReportColumnCdpBalance {
  Id?: number;
  "Consecutivo CDP SAP": number;
  "Consecutivo CDP Aurora": number;
  Posición: number;
  Fondo: string;
  "Centro Gestor": string;
  "Posicion Presupuestaria": string;
  "Area Funcional": string;
  Proyecto: string;
  "Nombre proyecto": string;
  "Valor Final": number;
}

export interface IReportColumnRpBalance {
  Id?: number;
  "Consecutivo RP SAP": number;
  "Consecutivo RP Aurora": number;
  Posición: number;
  Fondo: string;
  "Centro Gestor": string;
  "Posicion Presupuestaria": string;
  "Area Funcional": string;
  Proyecto: string;
  "Nombre proyecto": string;
  "Valor Final": number;
}

export interface IReportColumnAccountsPayable {
  Id?: number;
  "Consecutivo RP SAP": number;
  "Consecutivo RP Aurora": number;
  Posición: number;
  Fondo: string;
  "Centro Gestor": string;
  "Posicion Presupuestaria": string;
  "Area Funcional": string;
  Proyecto: string;
  "Nombre proyecto": string;
  "Valor Final": number;
  "Valor Causado": number;
}

export interface IReportColumnDetailedExecution {
  Id?: number;
  Fondo: string;
  "Nombre Fondo": string;
  Proyecto: string;
  "Nombre Proyecto": string;
  "Pospre origen": string;
  "Nombre Pospre": string;
  "Pospre Sapiencia": string;
  "Presupuesto Inicial": number;
  Reducciones: number;
  Adiciones: number;
  Créditos: number;
  "Contra créditos": number;
  "Presupuesto total": number;
  Disponibilidad: number;
  Compromiso: number;
  Factura: number;
  Pagos: number;
  "Total Disponible Neto": number;
  "Total Ejecución": number;
  "Porcentaje de Ejecución": string;
}
