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
            page.eachRow((row, rowNumber) => {

                if(rowNumber == 1){
                    this.validateExcelTemplate(row)
                }
                if (rowNumber >= 1 && rowNumber<3) {
                    console.log({row:row.getCell(1).value})
                    console.log({row:row.getCell(2).value})
                    console.log({row:row.getCell(3).value})
                    console.log({row:row.getCell(4).value})
                    console.log({row:row.getCell(5).value})
                    console.log({row:row.getCell(6).value})
                    console.log({row:row.getCell(7).value})
                    console.log({row:row.getCell(8).value})
                    console.log({row:row.getCell(9).value})
                    console.log({row:row.getCell(10).value})
                    console.log({row:row.getCell(11).value})
                    console.log({row:row.getCell(12).value})
                    console.log({row:row.getCell(13).value})
                    console.log({row:row.getCell(14).value})
                    console.log({row:row.getCell(15).value})
                    console.log({row:row.getCell(16).value})
                    console.log({row:row.getCell(17).value})
                    console.log({row:row.getCell(18).value})
                    console.log({row:row.getCell(19).value})
                    console.log({row:row.getCell(20).value})
                    console.log({row:row.getCell(21).value})
                    console.log({row:row.getCell(22).value})
                    console.log({row:row.getCell(23).value})
                    console.log({row:row.getCell(24).value})
                    console.log({row:row.getCell(25).value})
                    console.log({row:row.getCell(26).value})
                    console.log({row:row.getCell(27).value})
                    console.log({row:row.getCell(28).value})
                    console.log({row:row.getCell(29).value})
                    console.log({row:row.getCell(30).value})
                    console.log({row:row.getCell(31).value})
                    console.log({row:row.getCell(32).value})

                }
            })

            fs.unlinkSync(filePath);
            return "Cargando información";
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

        titles.forEach((e:any,index:number)=>{
            let d = row.getCell(index+1).value
            console.log("===>>" ,d)
        })      
    }

}