import { IVinculationMGAData } from './../Interfaces/VinculationMGAInterfaces';
import { IResponsePospreUploadMasive } from './../Interfaces/PosPreSapienciaInterfaces';
import { DateTime } from 'luxon';
import * as fs from 'fs';
import * as mimeTypes from 'mime-types';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { ApiResponse } from '../Utils/ApiResponses';
import { EResponseCodes } from '../Constants/ResponseCodesEnum';
import VinculationMGA from 'App/Models/VinculationMGA';
export interface IPospreMgaUploadMasiveService {
  uploadMasiveMga(fileData: any, usuarioCreo: any, aditionalData: []): Promise<ApiResponse<any>>;
}
export default class PospreUploadMasiveMgaService implements IPospreMgaUploadMasiveService {
  public async uploadMasiveMga(fileData: any, usuarioCreo: any, aditionalData: []): Promise<ApiResponse<any>> {
    aditionalData;
    const result = await this.processBase64(fileData);
    let responseData;

    if (Object.keys(result).length > 0) {
      const items = result?.data?.items;
      // const aditionalDataItem = aditionalData;
      
      
      if (items && Array.isArray(items) && items.length > 0) {
        for (const [index, item] of items.entries()) {
        
            const aditionalDataItem = aditionalData;
            const arrDataVpy = Object.values(aditionalDataItem)

          const vinculationMgaData: IVinculationMGAData = {
            budgetId:arrDataVpy[index]['posePre'],
            userCreate: usuarioCreo,
            activityId:arrDataVpy[index]['id'],
            consecutiveActivityDetailed: arrDataVpy[index]['activityMGA'],
            detailedActivityId: arrDataVpy[index]['idProject'],
            dateCreate: DateTime.fromJSDate(new Date()),
            
          }

           await this.insertIntoMga([vinculationMgaData], VinculationMGA);
        
        }
      } else {
        console.error('La propiedad "items" no es un arreglo válido o está vacía.');
      }
    } else {
      console.error('La estructura de datos "result" está vacía o no es válida.');
    }

    return new ApiResponse(responseData, EResponseCodes.OK, 'Áreas funcionales cargadas correctamente!');
  }

  async processBase64(fileContent: string): Promise<ApiResponse<any | null>> {
    const fileBuffer = Buffer.from(fileContent, 'base64');
    const fileExtension = mimeTypes.extension('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const tempFilePath = path.join(__dirname, '/files/uploads', `tempFile.${fileExtension}`);

    try {
      fs.writeFileSync(tempFilePath, fileBuffer);
    } catch (error) {
      throw new Error(`Error al escribir el archivo temporal: ${error.message}`);
    }

    const readInfo = await this.readExcel(fileBuffer);
    fs.unlinkSync(tempFilePath);

    return readInfo;
  }

  public readExcel = async (fileBuffer: Buffer): Promise<ApiResponse<any | null>> => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const worksheet = workbook.getWorksheet(1);
    const items: IVinculationMGAData[] = [];
    const headers: string[] = [];

    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      headers.push(cell.value?.toString() || "");
    });

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return;

      const objResult: IVinculationMGAData = {
        consecutiveActivityDetailed: row.getCell(7).value?.toString()!,
      };

      if (
        Object.values(objResult).some(
          (value) => value !== undefined && value !== null && value !== ""
        )
      ) {
        items.push(objResult);
      }
    });

    const response: IResponsePospreUploadMasive = {
      generalResponse: "Los filtros se superaron exitosamente",
      errorsResponse: null,
      headers,
      items,
    };

    return new ApiResponse(
      response,
      EResponseCodes.INFO,
      "¡Archivo guardado exitosamente!"
    );
  };



  private async insertIntoMga(
    items: any[],
    model: any
  ): Promise<void> {
    for (const item of items) {
      try {
        await model.create(item);
      } catch (error) {
        console.error(`Error de validación para el item: ${error}`);
      }
    }

  }


}
