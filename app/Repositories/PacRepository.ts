import fs from 'fs';
import Excel from 'exceljs'
import { IReviewBudgetRoute } from '../Interfaces/PacInterfaces';

export default interface IPacRepository {

    uploadPac(file: any): Promise<any>;
    reviewBudgetsRoute(budgetRoute: IReviewBudgetRoute): Promise<any>;

}

export default class PacRepository implements IPacRepository{
    uploadPac = async(file: any): Promise<any>=> {

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

    structureDataFile = (page:any)=>{
        let dataStructureFromExcel:any[]=[];
        let validTemplateStatus={};
        page.eachRow((row, rowNumber) => {
            if(rowNumber == 1){
                validTemplateStatus = this.validateExcelTemplate(row)
            }else{
                dataStructureFromExcel.push({
                    managementCenter: row.getCell(1).value,
                    sapienciaPosition: row.getCell(2).value,
                    sapienciaBudgetPosition: row.getCell(3).value,
                    fundSapiencia: row.getCell(4).value,
                    fund: row.getCell(5).value,
                    functionArea: row.getCell(6).value,
                    project: row.getCell(7).value,
                })
            }
        })
        return {
            data:dataStructureFromExcel,
            validTemplateStatus
        };

    }


    validateExcelTemplate = (row:any)=>{
        const titles = [
            'CENTRO GESTOR',
            'POSICION PRESUPUESTAL',
            'POSICION PRESUPUESTAL SAPIENCIA',
            'FONDO SAPIENCIA',
            'FONDO' 	 ,
            'AREA FUNCIONAL' ,
            'PROYECTO',
            'PRESUPUESTO SAPIENCIA',
            'PROGRAMADO ENERO' ,
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
            'PROGRAMADO NOVIEMBRE' ,
            'RECAUDADO NOVIEMBRE',
            'PROGRAMADO DICIEMBRE',
            'RECAUDADO DICIEMBRE'
        ]

        let errorTemplate = 0;
        titles.forEach((title:any,index:number)=>{
             let titleExcel = row.getCell(index+1).value
             if(titleExcel !=  title){
                errorTemplate +=1;
             }
        })
        if(errorTemplate>0){
            return {
                message:"El archivo no cumple la estructura",
                error:true,
                rowError:1,
                columnError:null
            }
        }else{
            return {
                message:"Estructura cumple",
                error:false,
                rowError:null,
                columnError:null
             }
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

}
