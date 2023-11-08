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
  "Proyecto": string;
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
  "Recaudado" : number;
  "Por Recaudar": number;
  "% Ejecución": number;

}

export interface IReportDetailChangeBudgets {

  "Acto Administrativo Distrito" : string,
  "Acto Administrativo Sapiencia" : string,
  "Tipo De Modificación" : string,
  "Proyecto": string,
  "Nombre Proyecto": string,
  "Área Funcional": string,
  "Fondo": string,
  "Pospre": string,
  "Presupuesto Inicial": number,
  "Adición Presupuesto Gastos": number,
  "Adición Presupuesto Ingresos": number,
  "Reducción Presupuesto Gasto": number,
  "Reducción Presupuesto Ingreso": number,
  "Crédito Presupuesto": number,
  "Contracrédito Presupuesto": number

}

export interface IDataBasicProject {

  projectCode: string;
  projectName: string;
  functionalArea: string;

}
