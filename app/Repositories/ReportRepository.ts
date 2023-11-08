import Pac from "App/Models/Pac";
import { IPac } from "../Interfaces/PacInterfaces";
import {
  IDataBasicProject,
  IPacReport,
  IReportColumnExecutionExpenses,
} from "../Interfaces/ReportsInterfaces";
import { IStrategicDirectionService } from "../Services/External/StrategicDirectionService";
import ProjectsVinculation from "../Models/ProjectsVinculation";
import BudgetsRoutes from "App/Models/BudgetsRoutes";
import {
  getAdditionMovement,
  getAmountBudgetAvailability,
  getCreditAndAgainstCredits,
} from "App/Utils/functions";

export interface IReportRepository {
  generateReportPac(year: number): Promise<any[]>;
  generateReportExecutionExpenses(year: number): Promise<any[]>;
}

export default class ReportRepository implements IReportRepository {
  constructor(private strategicDirectionService: IStrategicDirectionService) {}

  //Obtener Proyectos vinculados si son inversion o funcionamiento
  async getProjectGeneral(
    vinculationId: number,
    candidateName: string
  ): Promise<IDataBasicProject | null> {
    let projectCode: string = "";
    let projectName: string = "";
    let functionalArea: string = "";

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

    return objResult;
  }

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

      diferenceJan = Number(
        ((100 * (programmingJan - collectedJan)) / programmingJan).toFixed(2)
      );
      if (isNaN(diferenceJan)) diferenceJan = 0.0;
      diferenceFeb = Number(
        ((100 * (programmingFeb - collectedFeb)) / programmingFeb).toFixed(2)
      );
      if (isNaN(diferenceFeb)) diferenceFeb = 0.0;
      diferenceMar = Number(
        ((100 * (programmingMar - collectedMar)) / programmingMar).toFixed(2)
      );
      if (isNaN(diferenceMar)) diferenceMar = 0.0;
      diferenceApr = Number(
        ((100 * (programmingApr - collectedApr)) / programmingApr).toFixed(2)
      );
      if (isNaN(diferenceApr)) diferenceApr = 0.0;
      diferenceMay = Number(
        ((100 * (programmingMay - collectedMay)) / programmingMay).toFixed(2)
      );
      if (isNaN(diferenceMay)) diferenceMay = 0.0;
      diferenceJun = Number(
        ((100 * (programmingJun - collectedJun)) / programmingJun).toFixed(2)
      );
      if (isNaN(diferenceJun)) diferenceJun = 0.0;
      diferenceJul = Number(
        ((100 * (programmingJul - collectedJul)) / programmingJul).toFixed(2)
      );
      if (isNaN(diferenceJul)) diferenceJul = 0.0;
      diferenceAug = Number(
        ((100 * (programmingAug - collectedAug)) / programmingAug).toFixed(2)
      );
      if (isNaN(diferenceAug)) diferenceAug = 0.0;
      diferenceSep = Number(
        ((100 * (programmingSep - collectedSep)) / programmingSep).toFixed(2)
      );
      if (isNaN(diferenceSep)) diferenceSep = 0.0;
      diferenceOct = Number(
        ((100 * (programmingOct - collectedOct)) / programmingOct).toFixed(2)
      );
      if (isNaN(diferenceOct)) diferenceOct = 0.0;
      diferenceNov = Number(
        ((100 * (programmingNov - collectedNov)) / programmingNov).toFixed(2)
      );
      if (isNaN(diferenceNov)) diferenceNov = 0.0;
      diferenceDec = Number(
        ((100 * (programmingDec - collectedDec)) / programmingDec).toFixed(2)
      );
      if (isNaN(diferenceDec)) diferenceDec = 0.0;

      percentExecute = Number(((100 * collected) / budgetSapi).toFixed(2));
      forCollected = Number(budgetSapi - collected);

      //? **************************************************************************************************************
      //? **************************************************************************************************************

      let objResponse: IPacReport = {
        resourceType,
        managementCenter,
        posPreSapi,
        fundSapi,
        functionalArea,
        projectCode,
        projectName,
        budgetSapi,
        programmingJan,
        collectedJan,
        executeJan,
        diferenceJan,
        programmingFeb,
        collectedFeb,
        executeFeb,
        diferenceFeb,
        programmingMar,
        collectedMar,
        executeMar,
        diferenceMar,
        programmingApr,
        collectedApr,
        executeApr,
        diferenceApr,
        programmingMay,
        collectedMay,
        executeMay,
        diferenceMay,
        programmingJun,
        collectedJun,
        executeJun,
        diferenceJun,
        programmingJul,
        collectedJul,
        executeJul,
        diferenceJul,
        programmingAug,
        collectedAug,
        executeAug,
        diferenceAug,
        programmingSep,
        collectedSep,
        executeSep,
        diferenceSep,
        programmingOct,
        collectedOct,
        executeOct,
        diferenceOct,
        programmingNov,
        collectedNov,
        executeNov,
        diferenceNov,
        programmingDec,
        collectedDec,
        executeDec,
        diferenceDec,
        collected,
        forCollected,
        percentExecute,
      };

      responseReport.push(objResponse);
    }

    return responseReport;
  }

  async generateReportExecutionExpenses(year: number): Promise<any[]> {
    // Matriz que almacenará el resultado del informe
    const resObject: IReportColumnExecutionExpenses[] = [];

    // Consulta la ruta de presupuesto para el año especificado
    const queryBudgetRoute = await BudgetsRoutes.query()
      .preload("pospreSapiencia", (subQuery) => {
        subQuery.where("ejercise", year);
      })
      .preload("projectVinculation")
      .preload("funds")
      .preload("projectVinculation")
      .orderBy("id", "desc");

    // Mapea los resultados de la consulta a objetos serializados
    const resBudgetRoute = queryBudgetRoute.map((i) => i.serialize());

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

      // Reducciones y adiciones
      const resultAdditionMovement = await getAdditionMovement(rpp.id);

      if (resultAdditionMovement.length > 0) {
        for (const additionMovement of resultAdditionMovement) {
          if (additionMovement.addition.typeMovement === "Adicion")
            valueAddiction += +additionMovement.value;
          if (additionMovement.addition.typeMovement === "Disminucion")
            valueReduction += +additionMovement.value;
        }
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

      // Disponibilidad
      const resultAmountBudgetAvailability = await getAmountBudgetAvailability(
        rpp.id
      );

      if (resultAmountBudgetAvailability?.availability)
        availability = +resultAmountBudgetAvailability?.availabilityValue;
      if (resultAmountBudgetAvailability?.compromise)
        compromise = +resultAmountBudgetAvailability?.compromiseValue;

      // Disponible Neto
      availabilityNet =
        +currentPpr - (availability + compromise + invoices + payments);

      // Ejecución
      execution = +compromise + +invoices + +payments;

      // Porcentaje de Ejecución
      percentageExecution = Number(+execution / +currentPpr);
      if (!isFinite(percentageExecution)) percentageExecution = 0;

      // Crear un nuevo objeto de informe
      const newItem: IReportColumnExecutionExpenses = {
        //Id: rpp.id,
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
    console.log({ resObject });

    return resObject;
  }
}
