import fs from 'fs';
import Excel from 'exceljs'
import { IReviewBudgetRoute } from '../Interfaces/PacInterfaces';
import Pac from 'App/Models/Pac';

export default interface IPacRepository {

    uploadPac(file: any): Promise<any>;
    reviewBudgetsRoute(budgetRoute: IReviewBudgetRoute): Promise<any>;
    updateOrCreatePac(routesValidationRequest: any): Promise<any>;
    getPacByExcercise(exercise: number): Promise<Pac[]>;
    updatePacExcersiceVersion(pac: any): Promise<any>;
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

    async reviewBudgetsRoute(_budgetRoute: IReviewBudgetRoute): Promise<any> {

        //console.log(budgetRoute);
        //TODO: Acá consultamos la ruta presupuestal y sus componentes

        //* Paso 1. Hallar el PosPre Origen a través del PosPre Sapiencia (Y que exista)

        //* Paso 2. Hallar el Proyecto a través del Código Referencia

        //* Paso 3. Hallar el Fondo

        //* Paso 4. Hallar la ruta presupuestal

        //* Paso 5. Verificar que la ruta no esté repetida en la interacción


        return true;

    }

    updateOrCreatePac = async (routesValidationRequest: any) => {
        for await (let pac of routesValidationRequest.condensed) {
            let annualizations: any[] = []
            delete pac.numberExcelRom
            delete pac.pacAnnualizationProgrammed.totalBudget
            delete pac.pacAnnualizationCollected.totalBudget
            annualizations.push(pac.pacAnnualizationProgrammed)
            annualizations.push(pac.pacAnnualizationCollected)
            delete pac.pacAnnualizationProgrammed;
            delete pac.pacAnnualizationCollected;
            const toCreatePac = new Pac();
            toCreatePac.fill({ ...pac, dateCreate: new Date('2023-09-04 17:51:46') });
            //console.log({pac, annualizations})
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
            let annualization:any[] = []
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

}
