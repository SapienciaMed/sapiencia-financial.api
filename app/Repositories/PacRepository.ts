import fs from 'fs';
import Excel from 'exceljs'
import { IPacAnnualization, IPacPrimary, IReviewBudgetRoute } from '../Interfaces/PacInterfaces';
import Pac from '../Models/Pac';
import { IPagingData } from '../Utils/ApiResponses';
import { IPacFilters } from 'App/Interfaces/PacInterfaces';
import PacAnnualization from 'App/Models/PacAnnualization';

export default interface IPacRepository {

    uploadPac(file: any): Promise<any>;
    searchPacByMultiData(filters: IPacFilters): Promise<IPagingData<IPacPrimary | null>>;
    getPacByRouteAndExercise(route: number, validity: number): Promise<IPagingData<IPacAnnualization | null>>;
    getAnnualizationsByPacAndType(pac: number, type: string): Promise<IPagingData<IPacAnnualization | null>>;
    reviewBudgetsRoute(budgetRoute: IReviewBudgetRoute): Promise<any>;
    validityList(filters: IPacFilters): Promise<IPagingData<IPacPrimary | string>>;
    resourcesTypeList(filters: IPacFilters): Promise<IPagingData<IPacPrimary | string>>;
    listDinamicsRoutes(filters: IPacFilters): Promise<IPagingData<IPacPrimary | number>>;

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
                    pacAnnualization: [
                        {
                            type: "Programado",
                            jan: row.getCell(9).value,
                            feb: row.getCell(11).value,
                            mar: row.getCell(13).value,
                            abr: row.getCell(15).value,
                            may: row.getCell(17).value,
                            jun: row.getCell(19).value,
                            jul: row.getCell(21).value,
                            ago: row.getCell(23).value,
                            sep: row.getCell(25).value,
                            oct: row.getCell(27).value,
                            nov: row.getCell(29).value,
                            dec: row.getCell(31).value
                        },
                        {
                            type: "Recaudado",
                            jan: row.getCell(10).value,
                            feb: row.getCell(12).value,
                            mar: row.getCell(14).value,
                            abr: row.getCell(16).value,
                            may: row.getCell(18).value,
                            jun: row.getCell(20).value,
                            jul: row.getCell(22).value,
                            ago: row.getCell(24).value,
                            sep: row.getCell(26).value,
                            oct: row.getCell(28).value,
                            nov: row.getCell(30).value,
                            dec: row.getCell(32).value
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
            if (row.getCell(i).value == "") {
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
            if (row.getCell(i).value != "" && parseFloat(row.getCell(i).value) < 0) {
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

    async reviewBudgetsRoute(budgetRoute: IReviewBudgetRoute): Promise<any> {

        console.log(budgetRoute);
        //TODO: Acá consultamos la ruta presupuestal y sus componentes

        //* Paso 1. Hallar el PosPre Origen a través del PosPre Sapiencia (Y que exista)

        //* Paso 2. Hallar el Proyecto a través del Código Referencia

        //* Paso 3. Hallar el Fondo

        //* Paso 4. Hallar la ruta presupuestal

        //* Paso 5. Verificar que la ruta no esté repetida en la interacción


        return true;

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

      if( !filters.exercise ){

        query.where("exercise", ">", 0); //Técnicamente ALL

      }else{

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

      if( filters.exercise ) query.where("exercise", filters.exercise);
      if( filters.resourceType ) query.where("sourceType", filters.resourceType);

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

      query.where("exercise", filters.exercise!)
           .andWhere("sourceType", filters.resourceType!);

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
      if( type !== "Ambos" ){

        query.where("pacId", pac)
             .andWhere("type", type);

      }else{

        query.where("pacId", pac);

      }

      const res = await query.paginate(1, 100);
      const { data, meta } = res.serialize();

      return {
        array: data as IPacAnnualization[] | null[],
        meta,
      };

    }

    async getPacByRouteAndExercise(route: number, validity: number): Promise<IPagingData<IPacAnnualization | null>> {

      const query = Pac.query()
                       .where("budgetRouteId" , route)
                       .andWhere("exercise", validity);

      query.preload("annualizations");

      const res = await query.paginate(1, 100);
      const { data, meta } = res.serialize();

      return {
        array: data as IPacAnnualization[] | null[],
        meta,
      };

    }

}
