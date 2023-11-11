import Pac from "App/Models/Pac";
import Additions from "../Models/Addition";
import { IPac } from "../Interfaces/PacInterfaces";
import {
  IDataBasicProject,
  IPacReport,
  IReportColumnExecutionExpenses,
  IHistoryProjects,
  IReportDetailChangeBudgets,
  IReportChangeBudgets,
  IReportColumnCdpBalance,
  IReportColumnRpBalance,
  IReportColumnAccountsPayable,
} from "../Interfaces/ReportsInterfaces";
import { IAdditionsReport } from "../Interfaces/AdditionsInterfaces";
import { IStrategicDirectionService } from "../Services/External/StrategicDirectionService";
import ProjectsVinculation from "../Models/ProjectsVinculation";
import BudgetsRoutes from "App/Models/BudgetsRoutes";
import {
  getAdditionMovement,
  getAmountBudgetAvailability,
  getCheckWhetherOrNotHaveRp,
  getCreditAndAgainstCredits,
  getInvoicesAndPaymentsVrp,
  getlinksRpCdp,
} from "App/Utils/functions";
import Transfer from "App/Models/Transfer";
import { ITransfersReport } from "App/Interfaces/TransfersInterfaces";
import BudgetAvailability from "App/Models/BudgetAvailability";

export interface IReportRepository {
  generateReportPac(year: number): Promise<any[]>;
  generateReportDetailChangeBudgets(year: number): Promise<any[]>;
  generateReportExecutionExpenses(year: number): Promise<any[]>;
  generateReportOverviewBudgetModifications(year: number): Promise<any[]>;
  generateReportCdpBalance(year: number): Promise<any[]>;
  generateReportRpBalance(year: number): Promise<any[]>;
  generateReportAccountsPayable(year: number): Promise<any[]>;
}

export default class ReportRepository implements IReportRepository {
  constructor(private strategicDirectionService: IStrategicDirectionService) {}

  //? Este array nos va permitir contener la información que busquemos de planeación, como una especie de "histórico"
  //? de esta manera, si ya tenemos cargada la información, no tenemos porque hacer nuevas consultas a la API de planeación
  //? el objetivo es economizar al menos un 60% del tiempo usado para las consultas.
  public historyArrayFunctionalProject: IHistoryProjects[] = [];

  async getProjectGeneral(
    vinculationId: number,
    candidateName: string
  ): Promise<IDataBasicProject | null> {
    let projectCode: string = "";
    let projectName: string = "";
    let functionalArea: string = "";

    //* Validamos el array de históricos primero antes de:
    if (this.historyArrayFunctionalProject.length > 0) {
      //* Realizo busqueda:
      const result = this.historyArrayFunctionalProject.find(
        (obj) => obj.vinculationId === vinculationId
      );

      if (result && result != null && result != undefined) {
        let objResult: IDataBasicProject;

        if (result.projectCode === "9000000") {
          objResult = {
            projectCode: result.projectCode,
            projectName: candidateName,
            functionalArea: result.functionalArea,
          };
        } else {
          objResult = {
            projectCode: result.projectCode,
            projectName: result.projectName,
            functionalArea: result.functionalArea,
          };
        }

        return objResult;
      }
    }

    //* Si paso acá quiere decir que no encontré en el histórico y tendremos que consultar la API planeación
    const filtersByPlanning = { page: 1, perPage: 10000000 };
    const getProjectPlanning =
      await this.strategicDirectionService.getProjectInvestmentPaginated(
        filtersByPlanning
      );
    if (
      !getProjectPlanning ||
      getProjectPlanning == null ||
      getProjectPlanning == undefined
    )
      return null;

    //? Debería de traer una sola vinculación []
    const searchProject = await ProjectsVinculation.query()
      .where("id", vinculationId)
      .preload("areaFuntional");

    const getProject = searchProject.map((i) => i.serialize());
    const pkInvestmentProject: number = Number(
      getProject[0].investmentProjectId
    );
    functionalArea = getProject[0].areaFuntional.number;

    if (
      getProject[0].operationProjectId &&
      getProject[0].operationProjectId != null
    ) {
      projectCode = "9000000";
      projectName = candidateName;
    } else {
      for (const projPlanning of getProjectPlanning.data.array) {
        if (projPlanning.id === pkInvestmentProject) {
          projectCode = projPlanning.projectCode;
          projectName = projPlanning.name;
        }
      }
    }

    const objResult: IDataBasicProject = {
      projectCode,
      projectName,
      functionalArea,
    };

    //* Alimento el histórico:
    const objHistory: IHistoryProjects = {
      vinculationId,
      projectCode,
      projectName,
      functionalArea,
    };
    this.historyArrayFunctionalProject.push(objHistory);

    return objResult;
  }

  //HU-086 Reporte PAC - 7876
  async generateReportPac(year: number): Promise<any[]> {
    //** ************************************************************* */
    //** Agrupamos toda la data y la traemos ordenada Tipo de Recurso  */
    //** Validaremos que estén activos y sean del año solicitado       */
    //** ************************************************************* */
    const res = await Pac.query()
      .where("exercise", year)
      .andWhere("isActive", true)
      .orderBy("sourceType", "desc")
      .preload("pacAnnualizations");

    const getResponse: IPac[] = res.map((i) => i.serialize());
    const responseReport: any[] = [];

    for (const pac of getResponse) {
      //**Definamos el cuadro de variables requeridas */
      let resourceType: string = "";
      let managementCenter: string = "";
      let posPreSapi: string = "";
      let fundSapi: string = "";
      let functionalArea: string = "";
      let projectCode: string = "";
      let projectName: string = "";
      let budgetSapi: number = 0;
      let collected: number = 0;

      let programmingJan: number = 0;
      let programmingFeb: number = 0;
      let programmingMar: number = 0;
      let programmingApr: number = 0;
      let programmingMay: number = 0;
      let programmingJun: number = 0;
      let programmingJul: number = 0;
      let programmingAug: number = 0;
      let programmingSep: number = 0;
      let programmingOct: number = 0;
      let programmingNov: number = 0;
      let programmingDec: number = 0;

      let collectedJan: number = 0;
      let collectedFeb: number = 0;
      let collectedMar: number = 0;
      let collectedApr: number = 0;
      let collectedMay: number = 0;
      let collectedJun: number = 0;
      let collectedJul: number = 0;
      let collectedAug: number = 0;
      let collectedSep: number = 0;
      let collectedOct: number = 0;
      let collectedNov: number = 0;
      let collectedDec: number = 0;

      let executeJan: number = 0;
      let executeFeb: number = 0;
      let executeMar: number = 0;
      let executeApr: number = 0;
      let executeMay: number = 0;
      let executeJun: number = 0;
      let executeJul: number = 0;
      let executeAug: number = 0;
      let executeSep: number = 0;
      let executeOct: number = 0;
      let executeNov: number = 0;
      let executeDec: number = 0;

      let diferenceJan: number = 0;
      let diferenceFeb: number = 0;
      let diferenceMar: number = 0;
      let diferenceApr: number = 0;
      let diferenceMay: number = 0;
      let diferenceJun: number = 0;
      let diferenceJul: number = 0;
      let diferenceAug: number = 0;
      let diferenceSep: number = 0;
      let diferenceOct: number = 0;
      let diferenceNov: number = 0;
      let diferenceDec: number = 0;

      let percentExecute: number = 0;
      let forCollected: number = 0;

      //? Obtengamos la primera segmentación de datos
      //? Primero obtengamos la ruta presupuestal [Solo nos debería traer 1]
      const searchBudgetRoute = await BudgetsRoutes.query()
        .where("id", Number(pac.budgetRouteId))
        .preload("pospreSapiencia")
        .preload("projectVinculation")
        .preload("funds")
        .preload("projectVinculation");

      if (
        !searchBudgetRoute ||
        searchBudgetRoute == null ||
        searchBudgetRoute == undefined
      )
        return [
          null,
          "Ocurrió un error hallando la ruta presupuestal en los reportes, revisar consistencia de información",
        ];

      const getBudgetRoute = searchBudgetRoute.map((i) => i.serialize());

      //? Ahora traigamos el tema de los proyectos
      //? También haremos la abstracción de la API Externa
      const getDataProject: IDataBasicProject | null =
        await this.getProjectGeneral(
          Number(getBudgetRoute[0].idProjectVinculation),
          getBudgetRoute[0].pospreSapiencia?.description!
        );
      if (
        !getDataProject ||
        getDataProject == null ||
        getDataProject == undefined
      )
        return [
          null,
          "Ocurrió un error hallando la información del proyecto, revisar consistencia de información",
        ];

      //* Primer grupo de información, lo primero es traernos la información de ruta
      //* Se consolida junto con la información de los proyectos.
      resourceType = pac.sourceType!;
      managementCenter = getBudgetRoute[0].managementCenter!;
      posPreSapi = getBudgetRoute[0].pospreSapiencia?.number!;
      fundSapi = getBudgetRoute[0].fund?.number!;
      functionalArea = getDataProject.functionalArea;
      projectCode = getDataProject.projectCode;
      projectName = getDataProject.projectName;

      //? **************************************************************************************************************
      //? Ahora traigamos las anualizaciones
      //? Calculo los totales asociados a los valores programados
      budgetSapi =
        Number(pac.pacAnnualizations![0].jan) +
        Number(pac.pacAnnualizations![0].feb) +
        Number(pac.pacAnnualizations![0].mar) +
        Number(pac.pacAnnualizations![0].abr) +
        Number(pac.pacAnnualizations![0].may) +
        Number(pac.pacAnnualizations![0].jun) +
        Number(pac.pacAnnualizations![0].jul) +
        Number(pac.pacAnnualizations![0].ago) +
        Number(pac.pacAnnualizations![0].sep) +
        Number(pac.pacAnnualizations![0].oct) +
        Number(pac.pacAnnualizations![0].nov) +
        Number(pac.pacAnnualizations![0].dec);

      programmingJan = Number(pac.pacAnnualizations![0].jan);
      if (isNaN(programmingJan)) programmingJan = 0.0;
      programmingFeb = Number(pac.pacAnnualizations![0].feb);
      if (isNaN(programmingFeb)) programmingFeb = 0.0;
      programmingMar = Number(pac.pacAnnualizations![0].mar);
      if (isNaN(programmingMar)) programmingMar = 0.0;
      programmingApr = Number(pac.pacAnnualizations![0].abr);
      if (isNaN(programmingApr)) programmingApr = 0.0;
      programmingMay = Number(pac.pacAnnualizations![0].may);
      if (isNaN(programmingMay)) programmingMay = 0.0;
      programmingJun = Number(pac.pacAnnualizations![0].jun);
      if (isNaN(programmingJun)) programmingJun = 0.0;
      programmingJul = Number(pac.pacAnnualizations![0].jul);
      if (isNaN(programmingJul)) programmingJul = 0.0;
      programmingAug = Number(pac.pacAnnualizations![0].ago);
      if (isNaN(programmingAug)) programmingAug = 0.0;
      programmingSep = Number(pac.pacAnnualizations![0].sep);
      if (isNaN(programmingSep)) programmingSep = 0.0;
      programmingOct = Number(pac.pacAnnualizations![0].oct);
      if (isNaN(programmingOct)) programmingOct = 0.0;
      programmingNov = Number(pac.pacAnnualizations![0].nov);
      if (isNaN(programmingNov)) programmingNov = 0.0;
      programmingDec = Number(pac.pacAnnualizations![0].dec);
      if (isNaN(programmingDec)) programmingDec = 0.0;

      collected =
        Number(pac.pacAnnualizations![1].jan) +
        Number(pac.pacAnnualizations![1].feb) +
        Number(pac.pacAnnualizations![1].mar) +
        Number(pac.pacAnnualizations![1].abr) +
        Number(pac.pacAnnualizations![1].may) +
        Number(pac.pacAnnualizations![1].jun) +
        Number(pac.pacAnnualizations![1].jul) +
        Number(pac.pacAnnualizations![1].ago) +
        Number(pac.pacAnnualizations![1].sep) +
        Number(pac.pacAnnualizations![1].oct) +
        Number(pac.pacAnnualizations![1].nov) +
        Number(pac.pacAnnualizations![1].dec);

      collectedJan = Number(pac.pacAnnualizations![1].jan);
      if (isNaN(collectedJan)) collectedJan = 0.0;
      collectedFeb = Number(pac.pacAnnualizations![1].feb);
      if (isNaN(collectedFeb)) collectedFeb = 0.0;
      collectedMar = Number(pac.pacAnnualizations![1].mar);
      if (isNaN(collectedMar)) collectedMar = 0.0;
      collectedApr = Number(pac.pacAnnualizations![1].abr);
      if (isNaN(collectedApr)) collectedApr = 0.0;
      collectedMay = Number(pac.pacAnnualizations![1].may);
      if (isNaN(collectedMay)) collectedMay = 0.0;
      collectedJun = Number(pac.pacAnnualizations![1].jun);
      if (isNaN(collectedJun)) collectedJun = 0.0;
      collectedJul = Number(pac.pacAnnualizations![1].jul);
      if (isNaN(collectedJul)) collectedJul = 0.0;
      collectedAug = Number(pac.pacAnnualizations![1].ago);
      if (isNaN(collectedAug)) collectedAug = 0.0;
      collectedSep = Number(pac.pacAnnualizations![1].sep);
      if (isNaN(collectedSep)) collectedSep = 0.0;
      collectedOct = Number(pac.pacAnnualizations![1].oct);
      if (isNaN(collectedOct)) collectedOct = 0.0;
      collectedNov = Number(pac.pacAnnualizations![1].nov);
      if (isNaN(collectedNov)) collectedNov = 0.0;
      collectedDec = Number(pac.pacAnnualizations![1].dec);
      if (isNaN(collectedDec)) collectedDec = 0.0;

      executeJan = Number(((100 * collectedJan) / programmingJan).toFixed(2));
      if (isNaN(executeJan)) executeJan = 0.0;
      executeFeb = Number(((100 * collectedFeb) / programmingFeb).toFixed(2));
      if (isNaN(executeFeb)) executeFeb = 0.0;
      executeMar = Number(((100 * collectedMar) / programmingMar).toFixed(2));
      if (isNaN(executeMar)) executeMar = 0.0;
      executeApr = Number(((100 * collectedApr) / programmingApr).toFixed(2));
      if (isNaN(executeApr)) executeApr = 0.0;
      executeMay = Number(((100 * collectedMay) / programmingMay).toFixed(2));
      if (isNaN(executeMay)) executeMay = 0.0;
      executeJun = Number(((100 * collectedJun) / programmingJun).toFixed(2));
      if (isNaN(executeJun)) executeJun = 0.0;
      executeJul = Number(((100 * collectedJul) / programmingJul).toFixed(2));
      if (isNaN(executeJul)) executeJul = 0.0;
      executeAug = Number(((100 * collectedAug) / programmingAug).toFixed(2));
      if (isNaN(executeAug)) executeAug = 0.0;
      executeSep = Number(((100 * collectedSep) / programmingSep).toFixed(2));
      if (isNaN(executeSep)) executeSep = 0.0;
      executeOct = Number(((100 * collectedOct) / programmingOct).toFixed(2));
      if (isNaN(executeOct)) executeOct = 0.0;
      executeNov = Number(((100 * collectedNov) / programmingNov).toFixed(2));
      if (isNaN(executeNov)) executeNov = 0.0;
      executeDec = Number(((100 * collectedDec) / programmingDec).toFixed(2));
      if (isNaN(executeDec)) executeDec = 0.0;

      diferenceJan = Number((collectedJan - programmingJan).toFixed(2));
      if (isNaN(diferenceJan)) diferenceJan = 0.0;
      diferenceFeb = Number((collectedFeb - programmingFeb).toFixed(2));
      if (isNaN(diferenceFeb)) diferenceFeb = 0.0;
      diferenceMar = Number((collectedMar - programmingMar).toFixed(2));
      if (isNaN(diferenceMar)) diferenceMar = 0.0;
      diferenceApr = Number((collectedApr - programmingApr).toFixed(2));
      if (isNaN(diferenceApr)) diferenceApr = 0.0;
      diferenceMay = Number((collectedMay - programmingMay).toFixed(2));
      if (isNaN(diferenceMay)) diferenceMay = 0.0;
      diferenceJun = Number((collectedJun - programmingJun).toFixed(2));
      if (isNaN(diferenceJun)) diferenceJun = 0.0;
      diferenceJul = Number((collectedJul - programmingJul).toFixed(2));
      if (isNaN(diferenceJul)) diferenceJul = 0.0;
      diferenceAug = Number((collectedAug - programmingAug).toFixed(2));
      if (isNaN(diferenceAug)) diferenceAug = 0.0;
      diferenceSep = Number((collectedSep - programmingSep).toFixed(2));
      if (isNaN(diferenceSep)) diferenceSep = 0.0;
      diferenceOct = Number((collectedOct - programmingOct).toFixed(2));
      if (isNaN(diferenceOct)) diferenceOct = 0.0;
      diferenceNov = Number((collectedNov - programmingNov).toFixed(2));
      if (isNaN(diferenceNov)) diferenceNov = 0.0;
      diferenceDec = Number((collectedDec - programmingDec).toFixed(2));
      if (isNaN(diferenceDec)) diferenceDec = 0.0;

      percentExecute = Number(((100 * collected) / budgetSapi).toFixed(2));
      forCollected = Number(budgetSapi - collected);

      //? **************************************************************************************************************
      //? **************************************************************************************************************

      let objResponse: IPacReport = {
        "Tipo de recurso": resourceType,
        "Centro Gestor": managementCenter,
        "Posición Presupuestal": posPreSapi,
        "Fondo Sapiencia": fundSapi,
        "Área Funcional": functionalArea,
        Proyecto: projectCode,
        "Nombre proyecto": projectName,
        "Presupuesto Sapiencia": budgetSapi,
        "Programado Enero": programmingJan,
        "Cobrado Enero": collectedJan,
        "Ejecutado Enero": executeJan,
        "Diferencias Enero": diferenceJan,
        "Programado Febrero": programmingFeb,
        "Cobrado Febrero": collectedFeb,
        "Ejecutado Febrero": executeFeb,
        "Diferencias Febrero": diferenceFeb,
        "Programado Marzo": programmingMar,
        "Cobrado Marzo": collectedMar,
        "Ejecutado Marzo": executeMar,
        "Diferencias Marzo": diferenceMar,
        "Programado Abril": programmingApr,
        "Cobrado Abril": collectedApr,
        "Ejecutado Abril": executeApr,
        "Diferencias Abril": diferenceApr,
        "Programado Mayo": programmingMay,
        "Cobrado Mayo": collectedMay,
        "Ejecutado Mayo": executeMay,
        "Diferencias Mayo": diferenceMay,
        "Programado Junio": programmingJun,
        "Cobrado Junio": collectedJun,
        "Ejecutado Junio": executeJun,
        "Diferencias Junio": diferenceJun,
        "Programado Julio": programmingJul,
        "Cobrado Julio": collectedJul,
        "Ejecutado Julio": executeJul,
        "Diferencias Julio": diferenceJul,
        "Programado Agosto": programmingAug,
        "Cobrado Agosto": collectedAug,
        "Ejecutado Agosto": executeAug,
        "Diferencias Agosto": diferenceAug,
        "Programado Septiembre": programmingSep,
        "Cobrado Septiembre": collectedSep,
        "Ejecutado Septiembre": executeSep,
        "Diferencias Septiembre": diferenceSep,
        "Programado Octubre": programmingOct,
        "Cobrado Octubre": collectedOct,
        "Ejecutado Octubre": executeOct,
        "Diferencias Octubre": diferenceOct,
        "Programado Noviembre": programmingNov,
        "Cobrado Noviembre": collectedNov,
        "Ejecutado Noviembre": executeNov,
        "Diferencias Noviembre": diferenceNov,
        "Programado Diciembre": programmingDec,
        "Cobrado Diciembre": collectedDec,
        "Ejecutado Diciembre": executeDec,
        "Diferencias Diciembre": diferenceDec,
        Recaudado: collected,
        "Por Recaudar": forCollected,
        "% Ejecución": percentExecute,
      };

      responseReport.push(objResponse);
    }

    return responseReport;
  }

  //HU-091 Reporte Detalle modificaciones presupuesto - 7873
  async generateReportDetailChangeBudgets(year: number): Promise<any[]> {
    let infoArrayResult: IReportDetailChangeBudgets[] = []; //Tanto para disminución como adición y Traslados

    //** *************************** **//
    //** Grupo Adición y Disminución **//
    //** *************************** **//
    const getAdditions = await Additions.query()
      .orderBy("typeMovement", "desc")
      .preload("additionMove", (q) => {
        q.preload("budgetRoute", (r) => {
          r.preload("projectVinculation"),
            r.preload("funds"),
            r.preload("budget"),
            r.preload("pospreSapiencia");
        });
      });

    const getGeneralAddAndRedResponse: any[] = getAdditions.map((i) =>
      i.serialize()
    );
    const getAdjustDataAddAndRed =
      getGeneralAddAndRedResponse as IAdditionsReport[];

    for (const iterResAdd of getAdjustDataAddAndRed) {
      const actAdminDis: string = iterResAdd.actAdminDistrict;
      const actAdminSap: string = iterResAdd.actAdminSapiencia;
      const typeMovement: string = iterResAdd.typeMovement;

      for (const iterResMovement of iterResAdd.additionMove) {
        let credit: number = Number(iterResMovement.value);
        let againstCredit: number = Number(0);
        let addBudgetExpenses: number = 0;
        let addBudgetIncomes: number = 0;
        let decBudgetExpenses: number = 0;
        let decBudgetIncomes: number = 0;

        let projectCode: string = "";
        let projectName: string = "";
        let functionalArea: string = "";
        let fund: string = iterResMovement.budgetRoute.fund?.number!;

        let posPreSapi: string =
          iterResMovement.budgetRoute.pospreSapiencia?.number!;
        let desPosPreSapi: string =
          iterResMovement.budgetRoute.pospreSapiencia?.description!;
        let exercise: number =
          iterResMovement.budgetRoute.pospreSapiencia?.ejercise!;
        let initialBudget: number = iterResMovement.budgetRoute.initialBalance!;

        if (exercise === year) {
          const getDataProject: IDataBasicProject | null =
            await this.getProjectGeneral(
              Number(iterResMovement.budgetRoute.idProjectVinculation),
              desPosPreSapi
            );

          if (
            !getDataProject ||
            getDataProject == null ||
            getDataProject == undefined
          )
            return [
              null,
              "Ocurrió un error hallando la información del proyecto, revisar consistencia de información",
            ];

          projectCode = getDataProject.projectCode;
          projectName = getDataProject.projectName;
          functionalArea = getDataProject.functionalArea;

          //* Calculo para si es ingreso o gasto
          //? Este cálculo también lo hago según sin es adición o disminución
          if (typeMovement === "Adicion") {
            if (iterResMovement.type === "Ingreso") {
              addBudgetIncomes += Number(iterResMovement.value);
            } else {
              addBudgetExpenses += Number(iterResMovement.value);
            }
          } else {
            if (iterResMovement.type === "Ingreso") {
              decBudgetIncomes += Number(iterResMovement.value);
            } else {
              decBudgetExpenses += Number(iterResMovement.value);
            }
          }

          //Organizo objeto para infoArrayAddition
          const objTransaction: IReportDetailChangeBudgets = {
            "Acto Administrativo Distrito": actAdminDis,
            "Acto Administrativo Sapiencia": actAdminSap,
            "Tipo De Modificación": typeMovement,
            Proyecto: projectCode,
            "Nombre Proyecto": projectName,
            "Área Funcional": functionalArea,
            Fondo: fund,
            Pospre: posPreSapi,
            "Presupuesto Inicial": initialBudget,
            "Adición Presupuesto Gastos": addBudgetExpenses,
            "Adición Presupuesto Ingresos": addBudgetIncomes,
            "Reducción Presupuesto Gasto": decBudgetExpenses,
            "Reducción Presupuesto Ingreso": decBudgetIncomes,
            "Crédito Presupuesto": credit,
            "Contracrédito Presupuesto": againstCredit,
          };

          infoArrayResult.push(objTransaction);
        }
      }
    } //For de adición y disminución

    //** *************** **//
    //** Grupo Traslados **//
    //** *************** **//
    const getTransfers = await Transfer.query()
      .orderBy("id", "desc")
      .preload("transferMove", (s) => {
        s.preload("budgetRoute", (t) => {
          t.preload("projectVinculation"),
            t.preload("funds"),
            t.preload("budget"),
            t.preload("pospreSapiencia");
        });
      });

    const getGeneralTransferResponse: any[] = getTransfers.map((i) =>
      i.serialize()
    );
    const getAdjustDataTransfer =
      getGeneralTransferResponse as ITransfersReport[];

    for (const iterTransfer of getAdjustDataTransfer) {
      const actAdminDis: string = iterTransfer.actAdminDistrict;
      const actAdminSap: string = iterTransfer.actAdminSapiencia;
      const typeMovement: string = "Traslado";

      for (const iterResMovement of iterTransfer.transferMove!) {
        let credit: number = 0;
        let againstCredit: number = 0;

        if (iterResMovement.type === "Origen") {
          credit = iterResMovement.value;
          againstCredit = 0;
        } else {
          againstCredit = iterResMovement.value;
          credit = 0;
        }

        let addBudgetExpenses: number = 0;
        let addBudgetIncomes: number = 0;
        let decBudgetExpenses: number = 0;
        let decBudgetIncomes: number = 0;

        let projectCode: string = "";
        let projectName: string = "";
        let functionalArea: string = "";
        let fund: string = iterResMovement.budgetRoute.fund?.number!;

        let posPreSapi: string =
          iterResMovement.budgetRoute.pospreSapiencia?.number!;
        let desPosPreSapi: string =
          iterResMovement.budgetRoute.pospreSapiencia?.description!;
        let exercise: number =
          iterResMovement.budgetRoute.pospreSapiencia?.ejercise!;
        let initialBudget: number = iterResMovement.budgetRoute.initialBalance!;

        if (exercise === year) {
          const getDataProject: IDataBasicProject | null =
            await this.getProjectGeneral(
              Number(iterResMovement.budgetRoute.idProjectVinculation),
              desPosPreSapi
            );

          if (
            !getDataProject ||
            getDataProject == null ||
            getDataProject == undefined
          )
            return [
              null,
              "Ocurrió un error hallando la información del proyecto, revisar consistencia de información",
            ];

          projectCode = getDataProject.projectCode;
          projectName = getDataProject.projectName;
          functionalArea = getDataProject.functionalArea;

          //Organizo objeto para infoArrayAddition
          const objTransaction: IReportDetailChangeBudgets = {
            "Acto Administrativo Distrito": actAdminDis,
            "Acto Administrativo Sapiencia": actAdminSap,
            "Tipo De Modificación": typeMovement,
            Proyecto: projectCode,
            "Nombre Proyecto": projectName,
            "Área Funcional": functionalArea,
            Fondo: fund,
            Pospre: posPreSapi,
            "Presupuesto Inicial": initialBudget,
            "Adición Presupuesto Gastos": addBudgetExpenses,
            "Adición Presupuesto Ingresos": addBudgetIncomes,
            "Reducción Presupuesto Gasto": decBudgetExpenses,
            "Reducción Presupuesto Ingreso": decBudgetIncomes,
            "Crédito Presupuesto": credit,
            "Contracrédito Presupuesto": againstCredit,
          };

          infoArrayResult.push(objTransaction);
        }
      }
    } //For de traslados

    return infoArrayResult;
  }

  //HU-090 Reporte Resumen modificaciones presupuesto
  async generateReportOverviewBudgetModifications(
    year: number
  ): Promise<any[]> {
    let infoArrayResult: IReportChangeBudgets[] = []; //Tanto para disminución como adición.

    //** *************************** **//
    //** Grupo Adición y Disminución **//
    //** *************************** **//
    const getAdditions = await Additions.query()
      .orderBy("typeMovement", "desc")
      .preload("additionMove", (q) => {
        q.preload("budgetRoute", (r) => {
          r.preload("projectVinculation"),
            r.preload("funds"),
            r.preload("budget"),
            r.preload("pospreSapiencia");
        });
      });

    const getGeneralAddAndRedResponse: any[] = getAdditions.map((i) =>
      i.serialize()
    );
    const getAdjustDataAddAndRed =
      getGeneralAddAndRedResponse as IAdditionsReport[];

    for (const iterResAdd of getAdjustDataAddAndRed) {
      const actAdminDis: string = iterResAdd.actAdminDistrict;
      const actAdminSap: string = iterResAdd.actAdminSapiencia;
      const typeMovement: string = iterResAdd.typeMovement;
      const observation: string = "";

      for (const iterResMovement of iterResAdd.additionMove) {
        let total: number = 0;
        let millionsTotal: number = 0;
        let millionsLiquid: number = 0;
        let exercise: number =
          iterResMovement.budgetRoute.pospreSapiencia?.ejercise!;
        let initialBudget: number = iterResMovement.budgetRoute.initialBalance!;
        let percentUpInitialValue: number = 0;

        if (exercise === year) {
          //* Calculo indiferente si es ingreso o gasto
          total = Number(iterResMovement.value);
          millionsTotal = Number((total / 1000000).toFixed(2));
          millionsLiquid = Number((initialBudget / 1000000).toFixed(2));
          percentUpInitialValue = Number(millionsTotal / millionsLiquid);

          //! Por si nos quedan valores que podrían dividirse en 0
          millionsTotal === Number("Infinity")
            ? (millionsTotal = 0)
            : (millionsTotal = millionsTotal);
          millionsLiquid === Number("Infinity")
            ? (millionsLiquid = 0)
            : (millionsLiquid = millionsLiquid);
          percentUpInitialValue === Number("Infinity")
            ? (percentUpInitialValue = 0)
            : (percentUpInitialValue = percentUpInitialValue);

          //Organizo objeto para infoArrayAddition
          const objTransaction: IReportChangeBudgets = {
            "Tipo De Modificación": typeMovement,
            "Acto Administrativo Distrito": actAdminDis,
            "Acto Administrativo Sapiencia": actAdminSap,
            "Valor Total": total,
            "Valor En Millones": millionsTotal,
            "Porcentaje Sobre El Presupuesto Inicial": percentUpInitialValue,
            Observación: observation,
          };

          infoArrayResult.push(objTransaction);
        }
      }
    } //For de adición y disminución

    //** *************** **//
    //** Grupo Traslados **//
    //** *************** **//
    const getTransfers = await Transfer.query()
      .orderBy("id", "desc")
      .preload("transferMove", (s) => {
        s.preload("budgetRoute", (t) => {
          t.preload("projectVinculation"),
            t.preload("funds"),
            t.preload("budget"),
            t.preload("pospreSapiencia");
        });
      });

    const getGeneralTransferResponse: any[] = getTransfers.map((i) =>
      i.serialize()
    );
    const getAdjustDataTransfer =
      getGeneralTransferResponse as ITransfersReport[];

    for (const iterTransfer of getAdjustDataTransfer) {
      const actAdminDis: string = iterTransfer.actAdminDistrict;
      const actAdminSap: string = iterTransfer.actAdminSapiencia;
      const typeMovement: string = "Traslado";
      const observation: string = iterTransfer.observations;

      for (const iterResMovement of iterTransfer.transferMove!) {
        let total: number = 0;
        let millionsTotal: number = 0;
        let millionsLiquid: number = 0;
        let exercise: number =
          iterResMovement.budgetRoute.pospreSapiencia?.ejercise!;
        let initialBudget: number = iterResMovement.budgetRoute.initialBalance!;
        let percentUpInitialValue: number = 0;

        if (exercise === year) {
          //* Calculo indiferente si es origen o destino / Contra crédito o Crédito
          total = Number(iterResMovement.value);
          millionsTotal = Number((total / 1000000).toFixed(2));
          millionsLiquid = Number((initialBudget / 1000000).toFixed(2));
          percentUpInitialValue = Number(millionsTotal / millionsLiquid);

          //! Por si nos quedan valores que podrían dividirse en 0
          millionsTotal === Number("Infinity")
            ? (millionsTotal = 0)
            : (millionsTotal = millionsTotal);
          millionsLiquid === Number("Infinity")
            ? (millionsLiquid = 0)
            : (millionsLiquid = millionsLiquid);
          percentUpInitialValue === Number("Infinity")
            ? (percentUpInitialValue = 0)
            : (percentUpInitialValue = percentUpInitialValue);

          //Organizo objeto para infoArrayAddition
          const objTransaction: IReportChangeBudgets = {
            "Tipo De Modificación": typeMovement,
            "Acto Administrativo Distrito": actAdminDis,
            "Acto Administrativo Sapiencia": actAdminSap,
            "Valor Total": total,
            "Valor En Millones": millionsTotal,
            "Porcentaje Sobre El Presupuesto Inicial": percentUpInitialValue,
            Observación: observation,
          };

          infoArrayResult.push(objTransaction);
        }
      }
    }

    return infoArrayResult;
  }

  //HU-094 Reporte Ejecucion de gastos
  async generateReportExecutionExpenses(year: number): Promise<any[]> {
    // Matriz que almacenará el resultado del informe
    const resObject: IReportColumnExecutionExpenses[] = [];

    // Consulta la ruta de presupuesto para el año especificado
    const queryBudgetRoute = await BudgetsRoutes.query()
      .preload("pospreSapiencia", (subQuery) => {
        subQuery.where("ejercise", year);
      })
      .preload("funds")
      .preload("projectVinculation")
      .orderBy("id", "desc");

    // Mapea los resultados de la consulta a objetos serializados
    const resBudgetRoute = queryBudgetRoute
      .map((i) => i.serialize())
      .filter((i) => i.pospreSapiencia && i.pospreSapiencia !== null);

    // Recorre los resultados y genera el informe
    for (const rpp of resBudgetRoute) {
      // Variables para almacenar información
      let nameFund: string = "";
      let nameManagementCenter: string = "";
      let numberPospre: string = "";
      let functionalArea: string = "";
      let projectCode: string = "";
      let projectName: string = "";
      let initialPpr: number = 0;
      let valueReduction: number = 0;
      let valueAddiction: number = 0;
      let currentPpr: number = 0;
      let credits: number = 0;
      let againstCredits: number = 0;
      let availability: number = 0;
      let compromise: number = 0;
      let invoices: number = 0;
      let payments: number = 0;
      let availabilityNet: number = 0;
      let execution: number = 0;
      let percentageExecution: number = 0;

      // Fondo
      if (rpp.fund?.number) nameFund = rpp.fund?.number ?? "";

      // Centro Gestor
      if (rpp.managementCenter)
        nameManagementCenter = rpp.managementCenter ?? "";

      // Pospresupuesto SAPCIENCIA
      if (rpp.pospreSapiencia?.number)
        numberPospre = rpp.pospreSapiencia?.number ?? "";

      // Obtener información del proyecto
      const getDataProject: IDataBasicProject | null =
        await this.getProjectGeneral(
          Number(rpp.idProjectVinculation),
          rpp.pospreSapiencia?.description!
        );

      if (
        !getDataProject ||
        getDataProject == null ||
        getDataProject == undefined
      ) {
        // Manejo de errores en caso de que no se pueda obtener información del proyecto
        return [
          null,
          "Ocurrió un error hallando la información del proyecto, revisar consistencia de información",
        ];
      } else {
        // Asignar datos del proyecto
        functionalArea = getDataProject.functionalArea;
        projectCode = getDataProject.projectCode;
        projectName = getDataProject.projectName;
      }

      //Valor inicial
      if (rpp.initialBalance) initialPpr = rpp.initialBalance;

      // Reducciones y adiciones
      const resultAdditionMovement = await getAdditionMovement(rpp.id);
      if (resultAdditionMovement.length > 0) {
        const sumAddiction: number = resultAdditionMovement
          .filter((objeto) => objeto.addition.typeMovement === "Adicion")
          .reduce((total, objeto) => total + parseInt(objeto.value, 10), 0);
        valueAddiction = sumAddiction;
        const sumReduction: number = resultAdditionMovement
          .filter((objeto) => objeto.addition.typeMovement === "Disminucion")
          .reduce((total, objeto) => total + parseInt(objeto.value, 10), 0);
        valueReduction = sumReduction;
      }

      // Créditos y contra créditos
      const resultCredit = await getCreditAndAgainstCredits(rpp.id);
      if (resultCredit) {
        if (resultCredit?.type === "Destino") {
          credits = +resultCredit.value;
        } else {
          againstCredits = +resultCredit.value;
        }
      }

      // Total Ppto Actual
      if (rpp.balance) currentPpr = rpp.balance ? +rpp.balance : 0;

      // Disponibilidad y Compromiso
      const resultAmountBudgetAvailability = await getAmountBudgetAvailability(
        rpp.id,
        year
      );
      // Disponibilidad
      if (resultAmountBudgetAvailability?.availability)
        availability = +resultAmountBudgetAvailability?.availabilityValue;
      // Compromiso
      if (resultAmountBudgetAvailability?.compromise)
        compromise = +resultAmountBudgetAvailability?.compromiseValue;

      //Factura y Pagos
      const resultInvoicesAndPayments = await getInvoicesAndPaymentsVrp(
        rpp.id,
        year
      );
      //Factura
      invoices = resultInvoicesAndPayments.invoiceSumn;
      //Pagos
      payments = resultInvoicesAndPayments.paymentSumn;

      // Disponible Neto
      availabilityNet =
        +currentPpr - (availability + compromise + invoices + payments);

      // Ejecución
      execution = +compromise + +invoices + +payments;

      // Porcentaje de Ejecución
      percentageExecution = Number(+execution / +currentPpr) * 100;
      if (!isFinite(percentageExecution)) percentageExecution = 0;

      // Crear un nuevo objeto de informe
      const newItem: IReportColumnExecutionExpenses = {
        // Id: rpp.id,
        Fondo: nameFund,
        "Centro Gestor": nameManagementCenter,
        "Posición Presupuestaria": numberPospre,
        "Área Funcional": functionalArea,
        Proyecto: projectCode,
        Nombre: projectName,
        "Ppto Inicial": +initialPpr,
        Reducciones: valueReduction && +valueReduction,
        Adiciones: valueAddiction && +valueAddiction,
        Créditos: +credits,
        "Contra créditos": againstCredits,
        "Total Ppto Actual": currentPpr && +currentPpr,
        Disponibilidad: availability,
        Compromiso: compromise,
        Factura: +invoices,
        Pagos: +payments,
        "Disponible Neto": +availabilityNet,
        Ejecución: +execution,
        "Porcentaje de Ejecución": `${percentageExecution} %`,
      };

      // Agregar el objeto al resultado
      resObject.push(newItem);
    }

    // Devuelve la matriz de resultados
    return resObject;
  }

  //HU-095 Reporte CDP con saldo
  async generateReportCdpBalance(year: number): Promise<any[]> {
    const resObject: IReportColumnCdpBalance[] = [];

    const queryBudgetAvailability = await BudgetAvailability.query()
      .where("exercise", year)
      .orderBy("id", "desc")
      .preload("amounts", (subQuery) => {
        subQuery.preload("budgetRoute", (subSubQuery) => {
          subSubQuery.preload("funds");
          subSubQuery.preload("pospreSapiencia");
          subSubQuery.preload("projectVinculation");
        });
      });

    const resBudgetAvailability = queryBudgetAvailability.map((i) =>
      i.serialize()
    );

    for (const cdp of resBudgetAvailability) {
      let idCdp: number = cdp.id;
      let consecutiveSap: number = 0;
      let consecutiveAurora: number = 0;
      let positionIcd: number = 0;
      let fund: string = "";
      let nameManagementCenter: string = "";
      let numberPospre: string = "";
      let functionalArea: string = "";
      let projectCode: string = "";
      let projectName: string = "";
      let finalAmount: number = 0;

      if (idCdp) {
        if (cdp.amounts.length > 0) {
          for (const icd of cdp.amounts) {
            if (icd.isActive === 1) {
              const itHas = await getCheckWhetherOrNotHaveRp(icd.id);
              if (!itHas) {
                // console.log({ idCdp, icd: icd.id, rpp: icd.idRppCode });

                //Consecutivo CDP SAP
                consecutiveSap = Number(cdp.sapConsecutive);

                //Consecutivo CDP Aurora
                consecutiveAurora = Number(cdp.consecutive);

                //Posicion
                positionIcd = Number(icd.cdpPosition);

                //Fondo
                fund = icd.budgetRoute.fund.number;

                //Centro gestor
                nameManagementCenter = icd.budgetRoute.managementCenter;

                //Posicion Presupuestaria
                numberPospre = icd.budgetRoute.pospreSapiencia.number;

                //Area Funcional, Proyecto y Nombre del proyecto
                const getDataProject: IDataBasicProject | null =
                  await this.getProjectGeneral(
                    Number(icd.budgetRoute.idProjectVinculation),
                    icd.budgetRoute.pospreSapiencia?.description!
                  );

                if (
                  !getDataProject ||
                  getDataProject == null ||
                  getDataProject == undefined
                ) {
                  // Manejo de errores en caso de que no se pueda obtener información del proyecto
                  return [
                    null,
                    "Ocurrió un error hallando la información del proyecto, revisar consistencia de información",
                  ];
                } else {
                  // Asignar datos del proyecto
                  functionalArea = getDataProject.functionalArea;
                  projectCode = getDataProject.projectCode;
                  projectName = getDataProject.projectName;
                }

                //Valor Final
                finalAmount = icd.idcFinalValue ? Number(icd.idcFinalValue) : 0;

                const newItem: IReportColumnCdpBalance = {
                  // Id: idCdp,
                  "Consecutivo CDP SAP": consecutiveSap,
                  "Consecutivo CDP Aurora": consecutiveAurora,
                  Posición: positionIcd,
                  Fondo: fund,
                  "Centro Gestor": nameManagementCenter,
                  "Posicion Presupuestaria": numberPospre,
                  "Area Funcional": functionalArea,
                  Proyecto: projectCode,
                  "Nombre proyecto": projectName,
                  "Valor Final": finalAmount,
                };
                // Agregar el objeto al resultado
                resObject.push(newItem);
              }
            }
          }
        }
      }
    }

    return resObject;
  }

  //HU-096 Reporte Rp con saldo
  async generateReportRpBalance(year: number): Promise<any[]> {
    let resObject: IReportColumnRpBalance[] = [];

    const resultRpBalance = await getlinksRpCdp(year, "RpBalance");

    for (const vrp of resultRpBalance) {
      // let idVrp: number = vrp.id;
      let consecutiveSap: number = 0;
      let consecutiveAurora: number = 0;
      let positionRp: number = 0;
      let fund: string = "";
      let nameManagementCenter: string = "";
      let numberPospre: string = "";
      let functionalArea: string = "";
      let projectCode: string = "";
      let projectName: string = "";
      let finalAmount: number = 0;

      //Consecutivo RP SAP
      consecutiveSap = vrp.budgetRecord.consecutiveSap;

      //Consecutivo RP Aurora
      consecutiveAurora = vrp.budgetRecord.id;

      //Posición
      positionRp = vrp.position;

      //Fondo
      fund = vrp.amountBudgetAvailability.budgetRoute.fund.number;

      //Centro gestor
      nameManagementCenter =
        vrp.amountBudgetAvailability.budgetRoute.managementCenter;

      //Posicion Presupuestaria
      numberPospre =
        vrp.amountBudgetAvailability.budgetRoute.pospreSapiencia.number;

      //Area Funcional, Proyecto y Nombre del proyecto
      const getDataProject: IDataBasicProject | null =
        await this.getProjectGeneral(
          Number(vrp.amountBudgetAvailability.budgetRoute.idProjectVinculation),
          vrp.amountBudgetAvailability.budgetRoute.pospreSapiencia?.description!
        );

      if (
        !getDataProject ||
        getDataProject == null ||
        getDataProject == undefined
      ) {
        // Manejo de errores en caso de que no se pueda obtener información del proyecto
        return [
          null,
          "Ocurrió un error hallando la información del proyecto, revisar consistencia de información",
        ];
      } else {
        // Asignar datos del proyecto
        functionalArea = getDataProject.functionalArea;
        projectCode = getDataProject.projectCode;
        projectName = getDataProject.projectName;
      }

      //Valor Final
      finalAmount = vrp.finalAmount;

      const newItem: IReportColumnRpBalance = {
        // Id: idVrp,
        "Consecutivo RP SAP": consecutiveSap,
        "Consecutivo RP Aurora": consecutiveAurora,
        Posición: positionRp,
        Fondo: fund,
        "Centro Gestor": nameManagementCenter,
        "Posicion Presupuestaria": numberPospre,
        "Area Funcional": functionalArea,
        Proyecto: projectCode,
        "Nombre proyecto": projectName,
        "Valor Final": finalAmount,
      };

      // Agregar el objeto al resultado
      resObject.push(newItem);
    }

    return resObject;
  }

  //HU-097 Report Cuentas por pagar
  async generateReportAccountsPayable(year: number): Promise<any[]> {
    let resObject: IReportColumnAccountsPayable[] = [];

    const resultAccountsPayable = await getlinksRpCdp(year, "AccountsPayable");

    for (const vrp of resultAccountsPayable) {
      let idVrp: number = vrp.id;
      let consecutiveSap: number = 0;
      let consecutiveAurora: number = 0;
      let positionRp: number = 0;
      let fund: string = "";
      let nameManagementCenter: string = "";
      let numberPospre: string = "";
      let functionalArea: string = "";
      let projectCode: string = "";
      let projectName: string = "";
      let finalAmount: number = 0;
      let valueCaused: number = 0;

      // //Consecutivo RP SAP
      // consecutiveSap = vrp.budgetRecord.consecutiveSap;

      // //Consecutivo RP Aurora
      // consecutiveAurora = vrp.budgetRecord.id;

      // //Posición
      // positionRp = vrp.position;

      // //Fondo
      // fund = vrp.amountBudgetAvailability.budgetRoute.fund.number;

      // //Centro gestor
      // nameManagementCenter =
      //   vrp.amountBudgetAvailability.budgetRoute.managementCenter;

      // //Posicion Presupuestaria
      // numberPospre =
      //   vrp.amountBudgetAvailability.budgetRoute.pospreSapiencia.number;

      // //Area Funcional, Proyecto y Nombre del proyecto
      // const getDataProject: IDataBasicProject | null =
      //   await this.getProjectGeneral(
      //     Number(vrp.amountBudgetAvailability.budgetRoute.idProjectVinculation),
      //     vrp.amountBudgetAvailability.budgetRoute.pospreSapiencia?.description!
      //   );

      // if (
      //   !getDataProject ||
      //   getDataProject == null ||
      //   getDataProject == undefined
      // ) {
      //   // Manejo de errores en caso de que no se pueda obtener información del proyecto
      //   return [
      //     null,
      //     "Ocurrió un error hallando la información del proyecto, revisar consistencia de información",
      //   ];
      // } else {
      //   // Asignar datos del proyecto
      //   functionalArea = getDataProject.functionalArea;
      //   projectCode = getDataProject.projectCode;
      //   projectName = getDataProject.projectName;
      // }

      // //Valor Final
      // finalAmount = vrp.finalAmount;

      // //Valor Causado
      // valueCaused = vrp.finalAmount;

      const newItem: IReportColumnAccountsPayable = {
        Id: idVrp,
        "Consecutivo RP SAP": consecutiveSap,
        "Consecutivo RP Aurora": consecutiveAurora,
        Posición: positionRp,
        Fondo: fund,
        "Centro Gestor": nameManagementCenter,
        "Posicion Presupuestaria": numberPospre,
        "Area Funcional": functionalArea,
        Proyecto: projectCode,
        "Nombre proyecto": projectName,
        "Valor Final": finalAmount,
        "Valor Causado": valueCaused,
      };

      // Agregar el objeto al resultado
      resObject.push(newItem);
    }

    return resObject;
  }
}
