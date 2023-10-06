import fs from 'fs';
import Excel from 'exceljs'

export default interface IPacRepository {
    uploadPac(file: any): Promise<any>;
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
        page.eachRow((row, rowNumber) => {

            if(rowNumber == 1){
                this.validateExcelTemplate(row)
            }

                dataStructureFromExcel.push({
                    managementCenter: row.getCell(1).value,
                    sapienciaPosition: row.getCell(2).value, 
                    sapienciaBudgetPosition: row.getCell(3).value,
                    fundSapiencia: row.getCell(4).value,
                    fund: row.getCell(5).value,
                    functionArea: row.getCell(6).value,
                    project: row.getCell(7).value,
                })
                
        })
        return dataStructureFromExcel;

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
            'PROGRAMADO' ,
            'ENERO RECAUDADO',
            'ENERO PROGRAMADO' ,
            'FEBRERO RECAUDADO',
            'FEBRERO PROGRAMADO',
            'MARZO RECAUDADO',
            'MARZO PROGRAMADO',
            'ABRIL RECAUDADO',
            'ABRIL PROGRAMADO',
            'MAYO RECAUDADO',
            'MAYO PROGRAMADO',
            'JUNIO RECAUDADO',
            'JUNIO PROGRAMADO',
            'JULIO RECAUDADO',
            'JULIO PROGRAMADO',
            'AGOSTO RECAUDADO',
            'AGOSTO PROGRAMADO',
            'SEPTIEMBRE RECAUDADO',
            'SEPTIEMBRE PROGRAMADO',
            'OCTUBRE RECAUDADO',
            'OCTUBRE PROGRAMADO',
            'NOVIEMBRE RECAUDADO',
            'NOVIEMBRE PROGRAMADO' ,
            'DICIEMBRE RECAUDADO',
            'DICIEMBRE PROGRAMADO'
        ]

        titles.forEach((title:any,index:number)=>{
             let d = row.getCell(index+1).value
            console.log({title})
            console.log("===>>" ,d)
        })      
    }

}