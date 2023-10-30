import fs from 'fs';
import Excel from 'exceljs'
import { IPacAnnualization, IPacPrimary, IPac, ICreateAssociation } from '../Interfaces/PacInterfaces';
import { IPagingData } from '../Utils/ApiResponses';
import { IPacFilters } from 'App/Interfaces/PacInterfaces';
import PacAnnualization from 'App/Models/PacAnnualization';
import Pac from 'App/Models/Pac';
import { IAnnualRoute } from '../Interfaces/PacTransferInterface';

export default interface IPacRepository {

  uploadPac(file: any): Promise<any>;
  searchPacByMultiData(filters: IPacFilters): Promise<IPagingData<IPacPrimary | null>>;
  getPacByRouteAndExercise(route: number, validity: number, version: number, type: string, page: number, perPage: number): Promise<IPagingData<IPac | null>>;
  getAnnualizationsByPacAndType(pac: number, type: string): Promise<IPagingData<IPacAnnualization | null>>;
  updateOrCreatePac(routesValidationRequest: any): Promise<any>;
  getPacByExcercise(exercise: number): Promise<Pac[]>;
  updatePacExcersiceVersion(pac: any): Promise<any>;
  validityList(filters: IPacFilters): Promise<IPagingData<IPacPrimary | string>>;
  resourcesTypeList(filters: IPacFilters): Promise<IPagingData<IPacPrimary | string>>;
  listDinamicsRoutes(filters: IPacFilters): Promise<IPagingData<IPacPrimary | number>>;
  updateTransfer(data: IAnnualRoute): Promise<IAnnualRoute | null>;
  getUltimateVersion(): Promise<number | null>;
  inactivateVersionPac(versionFixed: number, pacsByExerciseFixed: any): Promise<any>;
  createAssociations(data: ICreateAssociation): Promise<IPac | null>;
  createAnnualizations(data: ICreateAssociation): Promise<IPacAnnualization | null>;
  getPacById(id: number): Promise<IPagingData<IPac | null>>;

}

export default class PacRepository implements IPacRepository {
  uploadPac = async (file: any): Promise<any> => {

    const name = `${Math.random()}.xlsx`;

    await file.move('tmp/uploads', {
      name,
      overwrite: true
    })

    if (!file) {
      return { message: 'Error al mover el archivo' }
    }
    const filePath = `tmp/uploads/${name}`


    const workbook = new Excel.Workbook()
    await workbook.xlsx.readFile(filePath)
    const page = workbook.getWorksheet(1)

    const dataLoadedFromExcel = this.structureDataFile(page);

    fs.unlinkSync(filePath);
    return dataLoadedFromExcel;
  }

  structureDataFile = (page: any) => {
    let dataStructureFromExcel: any[] = [];
    let rowsWithFieldsEmpty: any[] = [];
    let rowsWithFieldNumberInvalid: any[] = [];
    let validTemplateStatus = {};
    page.eachRow((row, rowNumber) => {
      if (rowNumber == 0) { rowNumber += 1 }
      if (rowNumber == 1) {
        validTemplateStatus = this.validateExcelTemplate(row)
      } else {
        let rowNumberEmpty = this.validateFieldsEmpty(row, rowNumber)
        rowNumberEmpty != null && rowsWithFieldsEmpty.push({
          message: 'Algún dato de la ruta está vacío',
          error: true,
          rowError: rowNumberEmpty,
          columnError: null
        })

        let rowNumberFieldInvalid = this.validateFieldNumberValid(row, rowNumber)
        rowNumberFieldInvalid != null && rowsWithFieldNumberInvalid.push({
          message: rowNumberFieldInvalid.message,
          error: true,
          rowError: rowNumberFieldInvalid.row,
          columnError: null
        })

        dataStructureFromExcel.push({
          rowExcel: rowNumber,
          managementCenter: row.getCell(1).value,
          sapienciaPosition: row.getCell(2).value,
          sapienciaBudgetPosition: row.getCell(3).value,
          fundSapiencia: row.getCell(4).value,
          fund: row.getCell(5).value,
          functionArea: row.getCell(6).value,
          project: row.getCell(7).value,
          totalBudget: row.getCell(8).value,
          pacAnnualization: [
            {
              type: "Programado",
              jan: row.getCell(9).value ?? 0,
              feb: row.getCell(11).value ?? 0,
              mar: row.getCell(13).value ?? 0,
              abr: row.getCell(15).value ?? 0,
              may: row.getCell(17).value ?? 0,
              jun: row.getCell(19).value ?? 0,
              jul: row.getCell(21).value ?? 0,
              ago: row.getCell(23).value ?? 0,
              sep: row.getCell(25).value ?? 0,
              oct: row.getCell(27).value ?? 0,
              nov: row.getCell(29).value ?? 0,
              dec: row.getCell(31).value ?? 0
            },
            {
              type: "Recaudado",
              jan: row.getCell(10).value ?? 0,
              feb: row.getCell(12).value ?? 0,
              mar: row.getCell(14).value ?? 0,
              abr: row.getCell(16).value ?? 0,
              may: row.getCell(18).value ?? 0,
              jun: row.getCell(20).value ?? 0,
              jul: row.getCell(22).value ?? 0,
              ago: row.getCell(24).value ?? 0,
              sep: row.getCell(26).value ?? 0,
              oct: row.getCell(28).value ?? 0,
              nov: row.getCell(30).value ?? 0,
              dec: row.getCell(32).value ?? 0
            }
          ]
        })
      }
    })
    return {
      data: dataStructureFromExcel,
      validTemplateStatus,
      rowsWithFieldsEmpty,
      rowsWithFieldNumberInvalid
    };

  }

  validateFieldsEmpty = (row: any, rowNumber: number) => {
    let rowsWithValuesEmpty = 0;
    for (let i = 1; i <= 7; i++) {
      if (row.getCell(i).value == null) {
        rowsWithValuesEmpty += 1

      }
    }
    if (rowsWithValuesEmpty > 0) {
      return rowNumber;
    }

    return null;

  }

  validateFieldNumberValid = (row: any, rowNumber: number) => {
    let rowsWithValuesInvalid = 0;
    for (let i = 8; i <= 32; i++) {
      if (row.getCell(i).value != null && parseFloat(row.getCell(i).value) < 0) {
        rowsWithValuesInvalid += 1
      }
    }
    if (rowsWithValuesInvalid > 0) {
      return {
        row: rowNumber,
        message: "Valor debe ser mayor o igual a cero"
      };
    }

    return null;

  }

  validateExcelTemplate = (row: any) => {
    const titles = [
      'CENTRO GESTOR',
      'POSICION PRESUPUESTAL',
      'POSICION PRESUPUESTAL SAPIENCIA',
      'FONDO SAPIENCIA',
      'FONDO',
      'AREA FUNCIONAL',
      'PROYECTO',
      'PRESUPUESTO SAPIENCIA',
      'PROGRAMADO ENERO',
      'RECAUDADO ENERO',
      'PROGRAMADO FEBRERO',
      'RECAUDADO FEBRERO',
      'PROGRAMADO MARZO',
      'RECAUDADO MARZO',
      'PROGRAMADO ABRIL',
      'RECAUDADO ABRIL',
      'PROGRAMADO MAYO',
      'RECAUDADO MAYO',
      'PROGRAMADO JUNIO',
      'RECAUDADO JUNIO',
      'PROGRAMADO JULIO',
      'RECAUDADO JULIO',
      'PROGRAMADO AGOSTO',
      'RECAUDADO AGOSTO',
      'PROGRAMADO SEPTIEMBRE',
      'RECAUDADO SEPTIEMBRE',
      'PROGRAMADO OCTUBRE',
      'RECAUDADO OCTUBRE',
      'PROGRAMADO NOVIEMBRE',
      'RECAUDADO NOVIEMBRE',
      'PROGRAMADO DICIEMBRE',
      'RECAUDADO DICIEMBRE'
    ]

    let errorTemplate = 0;
    titles.forEach((title: any, index: number) => {
      let titleExcel = row.getCell(index + 1).value
      if (titleExcel != title) {
        errorTemplate += 1;
      }
    })
    if (errorTemplate > 0) {
      return {
        message: "El archivo no cumple la estructura",
        error: true,
        rowError: 1,
        columnError: null
      }
    }

    return {
      message: "Estructura cumple",
      error: false,
      rowError: null,
      columnError: null
    }
  }

    updateOrCreatePac = async (routesValidationRequest: any) => {
        
        for await (let pac of routesValidationRequest.condensed) {
            let annualizations: any[] = []
            delete pac.numberExcelRom
            delete pac.pacAnnualizationProgrammed.totalBudget
            delete pac.pacAnnualizationCollected.totalBudget
            delete pac.balance;
            annualizations.push(pac.pacAnnualizationProgrammed)
            annualizations.push(pac.pacAnnualizationCollected)
            delete pac.pacAnnualizationProgrammed;
            delete pac.pacAnnualizationCollected;
            const toCreatePac = new Pac();
            toCreatePac.fill({ ...pac });
            let pacCreated = await toCreatePac.save();
            await pacCreated
                .related('pacAnnualizations')
                .createMany(annualizations)
        }
        return routesValidationRequest
    }
   
  getPacByExcercise = async (exercise: number): Promise<Pac[]> => {
    const pacs = await Pac.query().where('exercise', exercise).preload('pacAnnualizations')
    return pacs;
  };


  updatePacExcersiceVersion = async (pac: any): Promise<any> => {

    for await (let row of pac) {
      let annualization: any[] = []
      let routePacMatch = await Pac.findOrFail(row.id)
      let pacAnnualizationProgrammed = row.pacAnnualizationProgrammed
      let pacAnnualizationCollected = row.pacAnnualizationCollected
      delete row.pacAnnualizationProgrammed.totalBudget;
      delete row.pacAnnualizationCollected.totalBudget;

      annualization.push(pacAnnualizationProgrammed)
      annualization.push(pacAnnualizationCollected)

      await routePacMatch
        .related('pacAnnualizations')
        .updateOrCreateMany(annualization, 'id')

    }

    return pac;

  }
  async validityList(filters: IPacFilters): Promise<IPagingData<IPacPrimary | string>> {

    const query = Pac.query();
    query.distinct("exercise");

    const res = await query.paginate(filters.page, filters.perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IPacPrimary[] | string[],
      meta,
    };

  }

  async resourcesTypeList(filters: IPacFilters): Promise<IPagingData<IPacPrimary | string>> {

    const query = Pac.query();

    if (!filters.exercise) {

      query.where("exercise", ">", 0); //Técnicamente ALL

    } else {

      query.where("exercise", filters.exercise!); //Tiene que venir !

    }

    query.distinct("sourceType");

    const res = await query.paginate(filters.page, filters.perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IPacPrimary[] | string[],
      meta,
    };

  }

  async listDinamicsRoutes(filters: IPacFilters): Promise<IPagingData<IPacPrimary | number>> {

    const query = Pac.query();

    //? Con filters.exercise y con filters.resourceType obtenemos el grupo

    if (filters.exercise) query.where("exercise", filters.exercise);
    if (filters.resourceType) query.where("sourceType", filters.resourceType);

    query.select("budgetRouteId");

    const res = await query.paginate(filters.page, filters.perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IPacPrimary[] | number[],
      meta,
    };

  }

  async searchPacByMultiData(filters: IPacFilters): Promise<IPagingData<IPacPrimary | null>> {

    const query = Pac.query();

    if (!filters.version) {

      if (!filters.route) {

        query.where("exercise", filters.exercise!)
          .andWhere("sourceType", filters.resourceType!)
        //.andWhere("isActive", true);

      } else {

        query.where("exercise", filters.exercise!)
          .andWhere("sourceType", filters.resourceType!)
          .andWhere("budgetRouteId", filters.route!);
        //.andWhere("isActive", true);

      }

    } else {

      if (!filters.route) {

        query.where("exercise", filters.exercise!)
          .andWhere("sourceType", filters.resourceType!)
          .andWhere("version", filters.version);
        //.andWhere("isActive", true);

      } else {

        query.where("exercise", filters.exercise!)
          .andWhere("sourceType", filters.resourceType!)
          .andWhere("version", filters.version)
          .andWhere("budgetRouteId", filters.route!);
        //.andWhere("isActive", true);

      }

    }

    const res = await query.paginate(filters.page, filters.perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IPacPrimary[] | null[],
      meta,
    };

  }

  async getAnnualizationsByPacAndType(pac: number, type: string): Promise<IPagingData<IPacAnnualization | null>> {

    const query = PacAnnualization.query();

    //Si es ambos entonces traería ambos grupos de datos.
    if (type !== "Ambos") {

      query.where("pacId", pac)
        .andWhere("type", type);

    } else {

      query.where("pacId", pac);

    }

    const res = await query.paginate(1, 100);
    const { data, meta } = res.serialize();

    return {
      array: data as IPacAnnualization[] | null[],
      meta,
    };

  }

  async getPacByRouteAndExercise(route: number, validity: number, version: number, type: string, page: number, perPage: number): Promise<IPagingData<IPac | null>> {

    const query = Pac.query();

    if (route !== 0 &&
      version === 0 &&
      type === "no") {

      query.where("budgetRouteId", route)
        .andWhere("exercise", validity);

    }

    if (route !== 0 &&
      version === 0 &&
      type !== "no") {

      if (type !== "Ambos") {

        query.where("budgetRouteId", route)
          .andWhere("exercise", validity)
          .andWhere("sourceType", type);

      } else {

        query.where("budgetRouteId", route)
          .andWhere("exercise", validity);

      }

    }

    if (route !== 0 &&
      version !== 0 &&
      type === "no") {

      query.where("budgetRouteId", route)
        .andWhere("exercise", validity)
        .andWhere("version", version)

    }

    if (route !== 0 &&
      version !== 0 &&
      type !== "no") {

      if (type !== "Ambos") {

        query.where("budgetRouteId", route)
          .andWhere("exercise", validity)
          .andWhere("version", version)
          .andWhere("sourceType", type);

      } else {

        query.where("budgetRouteId", route)
          .andWhere("exercise", validity)
          .andWhere("version", version);

      }

    }

    if (route === 0 &&
      version !== 0 &&
      type !== "no") {

      if (type !== "Ambos") {

        query.where("exercise", validity)
          .andWhere("version", version)
          .andWhere("sourceType", type);

      } else {

        query.where("exercise", validity)
          .andWhere("version", version);

      }

    }

    query.preload("pacAnnualizations");

    const res = await query.paginate(page, perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IPac[] | null[],
      meta,
    };

  }

  async updateTransfer(data: IAnnualRoute): Promise<IAnnualRoute | null> {

    const { id } = data;
    const toUpdate = await PacAnnualization.find(id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.jan = data.jan;
    toUpdate.feb = data.feb;
    toUpdate.mar = data.mar;
    toUpdate.abr = data.abr;
    toUpdate.may = data.may;
    toUpdate.jun = data.jun;
    toUpdate.jul = data.jul;
    toUpdate.ago = data.ago;
    toUpdate.sep = data.sep;
    toUpdate.oct = data.oct;
    toUpdate.nov = data.nov;
    toUpdate.dec = data.dec;

    await toUpdate.save();
    return toUpdate.serialize() as IAnnualRoute;

  }

  async getUltimateVersion(): Promise<Pac | null | unknown> {

    const search = Pac.query();
    search.where("isActive", true);
    search.orderBy("version", "desc");
    search.select("version");
    search.first()

    return search as unknown | Pac[];

  }

  inactivateVersionPac = async (versionFixed: number, pacsByExerciseFixed: any): Promise<any> => {
    const pacsByExerciseFilter = pacsByExerciseFixed.filter(e => e.version == versionFixed);

    try {
      for await (let pac of pacsByExerciseFilter) {
        let pacRoute = await Pac.findOrFail(pac.id)
        pacRoute.isActive = false;
        await pacRoute.save()
      }
      return "Actualización correcta"
    } catch (error) {
      throw new Error("Error en la edición de estado en el pac");

    }

  }

  async createAssociations(data: ICreateAssociation): Promise<IPac | null> {

    const properties: IPac = {
      sourceType: data.resourceType,
      budgetRouteId: Number(data.route),
      version: Number(data.version),
      exercise: Number(data.exercise),
      isActive: true,
      dateCreate: new Date()
    }

    const toCreateAssociation = new Pac();

    toCreateAssociation.fill({ ...properties });
    await toCreateAssociation.save();
    return toCreateAssociation.serialize() as IPac;

  }

  async createAnnualizations(data: ICreateAssociation): Promise<IPacAnnualization | null> {

    const properties: IPacAnnualization = {

      pacId: data.pacId,
      type: data.type!,
      jan: Number(data.annualization!.jan),
      feb: Number(data.annualization!.feb),
      mar: Number(data.annualization!.mar),
      abr: Number(data.annualization!.abr),
      may: Number(data.annualization!.may),
      jun: Number(data.annualization!.jun),
      jul: Number(data.annualization!.jul),
      ago: Number(data.annualization!.ago),
      sep: Number(data.annualization!.sep),
      oct: Number(data.annualization!.oct),
      nov: Number(data.annualization!.nov),
      dec: Number(data.annualization!.dec),
      dateCreate: new Date()

    }

    const toCreateAnnualization = new PacAnnualization();

    toCreateAnnualization.fill({ ...properties });
    await toCreateAnnualization.save();

    //* También debemos crear por defecto el recaudado pero en 0
    const collectedExtra: IPacAnnualization = {

      pacId: data.pacId,
      type: "Recaudado",
      jan: 0,
      feb: 0,
      mar: 0,
      abr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      ago: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      dateCreate: new Date()

    }

    const toCreateAnnualizationForCollected = new PacAnnualization();
    toCreateAnnualizationForCollected.fill({ ...collectedExtra });
    await toCreateAnnualizationForCollected.save();

    //Devuelvame el primero indiferentemente del caso.
    return toCreateAnnualization.serialize() as IPacAnnualization;

  }

  async getPacById(id: number): Promise<IPagingData<IPac | null>> {

    const query = Pac.query();

    query.where("id", id);
    query.preload("pacAnnualizations");

    const res = await query.paginate(1, 1000000);
    const { data, meta } = res.serialize();

    return {
      array: data as IPac[] | null[],
      meta,
    };

  }


}
