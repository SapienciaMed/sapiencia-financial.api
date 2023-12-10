import { IFunctionalAreaMasiveSave, IResponseUploadMasiveFunctionalArea } from './../Interfaces/FunctionalAreaInterfaces';
// En el archivo FunctionalAreaService.ts

import * as fs from 'fs';
import * as mimeTypes from 'mime-types';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { ApiResponse } from '../Utils/ApiResponses';
import { EResponseCodes } from '../Constants/ResponseCodesEnum';
import FunctionalArea from 'App/Models/FunctionalArea';


export interface IFunctionalAreaUploadService {
    // Otros métodos...
    uploadMasiveAreaFunctional(fileData: any, usuarioCreo: any): Promise<ApiResponse<any>>;
  }
export default class FunctionalAreaService implements IFunctionalAreaUploadService {
  public async uploadMasiveAreaFunctional(fileData: any, usuarioCreo: any): Promise<ApiResponse<any>> {
    const result = await this.processBase64(fileData);
    let responseData;

    if (Object.keys(result).length > 0) {
      const items = result?.data?.items;

      if (items && Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const functionalArea: IFunctionalAreaMasiveSave = {
            number: item.number,
            userCreate:usuarioCreo,
            denomination:"NO EXPECIFICA",
            description: "No expecifica",
            dateCreate: new Date(new Date().toISOString().slice(0, 19).replace('T', ' ')),
          };

          responseData = await this.insertItemsToDatabase([functionalArea], FunctionalArea);
        }
      } else {
        console.error('La propiedad "items" no es un arreglo válido o está vacía.');
      }
    } else {
      console.error('La estructura de datos "result" está vacía o no es válida.');
    }

    return new ApiResponse(responseData, EResponseCodes.OK, 'Áreas funcionales cargadas correctamente!');
  }

  async processBase64(fileContent: string): Promise<ApiResponse<IResponseUploadMasiveFunctionalArea | null>> {
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

  public readExcel = async (fileBuffer: Buffer): Promise<ApiResponse<IResponseUploadMasiveFunctionalArea | null>> => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const worksheet = workbook.getWorksheet(1);
    const items: IFunctionalAreaMasiveSave[] = [];
    const headers: string[] = [];

    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      headers.push(cell.value?.toString() || "");
    });

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return;

      const objResult: IFunctionalAreaMasiveSave = {
        number: row.getCell(1).value?.toString()!,
        tipoProyecto: row.getCell(2).value?.toString()!,
        proyecto: row.getCell(3).value?.toString()!,
      };

      if (
        Object.values(objResult).some(
          (value) => value !== undefined && value !== null && value !== ""
        )
      ) {
        items.push(objResult);
      }
    });

    const response: IResponseUploadMasiveFunctionalArea = {
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

  private async insertItemsToDatabase(
    items: IFunctionalAreaMasiveSave[],
    model: any
  ): Promise<void> {
    for (const item of items) {
      try {
        const { number } = item;

        const existingRecord = await model.query()
          .where('ARF_CODIGO', number)
          .first();

        if (existingRecord) {
          await existingRecord.merge(item).save();
        } else {
          await model.create(item);
        }
      } catch (error) {
        console.error(`Error de validación para el item: ${error}`);
      }
    }
  }
}
