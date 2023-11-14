import * as fs from 'fs';
import * as mimeTypes from 'mime-types';
import * as path from 'path';
import * as ExcelJS from 'exceljs';

import { IFundsRepository } from "App/Repositories/FundsRepository";
import { IFundsUploadMasive, IErrorsUploadMasive, IResponseUploadMasive } from '../Interfaces/UploadMasiveInterfaces';
import { ApiResponse } from '../Utils/ApiResponses';
import { EResponseCodes } from '../Constants/ResponseCodesEnum';

export interface IFundsUploadMasiveService {
  uploadMasiveFunds(file: string): Promise<any>;
}

export default class FundsUploadMasiveService implements IFundsUploadMasiveService {

  constructor(private fundsRepository: IFundsRepository) {}

  public bandErrors: boolean = false;
  public validArrayStructure: string[] = ["ENTIDAD CP",	"CODIGO",	"DENOMINACION", "DESCRIPCION",	"VALIDEZ DE",	"VALIDEZ A"];

  //*Arrays para errores:
  public arrayErrorStructure: IErrorsUploadMasive[] = []; //Estructura Columnas

  async uploadMasiveFunds(file: string): Promise<any> {

    console.log(this.fundsRepository);
    const result = await this.processBase64(file);

    return result;

  }

  async processBase64(fileContent: string): Promise<ApiResponse<IResponseUploadMasive | null>> {

    const fileBuffer = Buffer.from(fileContent, 'base64');
    const fileExtension = mimeTypes.extension('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const tempFilePath = path.join(__dirname, '/tmp/uploads', `tempFile.${fileExtension}`);

    try {
      fs.writeFileSync(tempFilePath, fileBuffer);
    } catch (error) {
      throw new Error(error);
    }

    const readInfo = await this.readExcel(fileBuffer);
    fs.unlinkSync(tempFilePath);

    return readInfo;

  }

  public readExcel = async (fileBuffer: Buffer): Promise<ApiResponse<IResponseUploadMasive | null>> => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const worksheet = workbook.getWorksheet(1);
    const items: IFundsUploadMasive[] = [];
    const headers: string[] = [];

    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      headers.push(cell.value?.toString() || '');
    });

    //Comparación de títulos
    const validTitles = await this.validTitles(headers);
    if(validTitles !== null){
      const response: IResponseUploadMasive = {
        generalResponse: "Error validando los títulos",
        errorsResponse: validTitles
      }
      return new ApiResponse(response, EResponseCodes.FAIL, "El archivo no cumple la estructura");
    }


    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return;

      const objResult: IFundsUploadMasive = {
        row: rowIndex,
        cpEntity : row.getCell(1).value?.toString()!,
        code : row.getCell(2).value?.toString()!,
        denomination : row.getCell(3).value?.toString()!,
        description : row.getCell(4).value?.toString()!,
        dateFrom : new Date(Date.parse(row.getCell(5).value?.toString()!)),
        dateTo : new Date(Date.parse(row.getCell(6).value?.toString()!)),
      }

      if (Object.values(objResult).some((value) => value !== undefined && value !== null && value !== '')) {
        items.push(objResult);
      }

    });

    const response: IResponseUploadMasive = {
      generalResponse: "Los filtros se superaron exitosamente",
      errorsResponse: null,
      headers,
      items
    }

    return new ApiResponse(response, EResponseCodes.INFO, "¡Archivo guardado exitosamente!");

  };

  //? ******************************************* ?//
  //? ********** VALIDACIÓN DE TITULOS ********** ?//
  //? ******************************************* ?//
  async validTitles(headers: string[]): Promise<IErrorsUploadMasive[] | null> {

    const errors: IErrorsUploadMasive[] = [];
    let band: boolean = false;

    if(headers.length !== this.validArrayStructure.length){
      const objError: IErrorsUploadMasive = {
        row: 1,
        description: `Se encontró un error con la cantidad de columnas, se esperan ${this.validArrayStructure.length} columnas.`
      }
      this.arrayErrorStructure.push(objError);
      errors.push(objError);
      return errors;
    }

    for (let i = 0; i < headers.length; i++) {

      if(headers[i] !== this.validArrayStructure[i]){
        const objError: IErrorsUploadMasive = {
          row: 1,
          description: `Se encontró un error con el nombramiento del título de columna, se espera ${this.validArrayStructure[i]}.`
        }
        this.arrayErrorStructure.push(objError);
        errors.push(objError);
        band = true;

      }

    }

    if( band ) return errors;
    return null;

  }








}
