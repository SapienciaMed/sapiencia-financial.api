import * as fs from 'fs';
import * as mimeTypes from 'mime-types';
import * as path from 'path';
import * as ExcelJS from 'exceljs';

import { IFundsRepository } from "App/Repositories/FundsRepository";
import { IFundsUploadMasive, IErrorsUploadMasive, IResponseUploadMasive } from '../Interfaces/UploadMasiveInterfaces';
import { ApiResponse } from '../Utils/ApiResponses';
import { EResponseCodes } from '../Constants/ResponseCodesEnum';
//import Funds from 'App/Models/Funds';

export interface IFundsUploadMasiveService {
  uploadMasiveFunds(file: string): Promise<any>;
}

export default class FundsUploadMasiveService implements IFundsUploadMasiveService {

  constructor(private fundsRepository: IFundsRepository) {}

  public bandErrors: boolean = false;
  public validArrayStructure: string[] = ["ENTIDAD CP",	"CODIGO",	"DENOMINACION", "DESCRIPCION",	"VALIDEZ DE",	"VALIDEZ A"];

  //*Arrays para errores:
  public arrayErrorStructure: IErrorsUploadMasive[] = []; //Estructura Columnas
  public arrayEmptyData: IErrorsUploadMasive[] = []; //Columnas vacías
  public arrayErrorDates: IErrorsUploadMasive[] = []; //Error en las fechas
  public arrayErrorExist: IErrorsUploadMasive[] = []; //Ya existe en la base de datos
  public arrayErrorRepeat: IErrorsUploadMasive[] = []; //Repetidos en el excel


  async uploadMasiveFunds(file: string): Promise<any> {

    const result = await this.processBase64(file);

    return result;

  }

  async processBase64(fileContent: string): Promise<ApiResponse<IResponseUploadMasive | IErrorsUploadMasive[] | null>> {

    const fileBuffer = Buffer.from(fileContent, 'base64');
    const fileExtension = mimeTypes.extension('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const tempFilePath = path.join(__dirname, '/files/uploads', `tempFile.${fileExtension}`);

    try {
      fs.writeFileSync(tempFilePath, fileBuffer);
    } catch (error) {
      throw new Error(error);
    }

    const readInfo = await this.readExcel(fileBuffer);
    fs.unlinkSync(tempFilePath);

    return readInfo;

  }

  public readExcel = async (fileBuffer: Buffer): Promise<ApiResponse<IResponseUploadMasive | IErrorsUploadMasive[] | null>> => {

    // ********************************************************* //
    // **** LIMPIAMOS ARREGLOS DE ERRORES ANTES DE COMENZAR **** //
    // ********************************************************* //
    this.arrayErrorStructure = []; //Estructura Columnas
    this.arrayEmptyData = []; //Columnas vacías
    this.arrayErrorDates = []; //Errores fechas
    this.arrayErrorExist = []; //Ya existe en la base de datos
    this.arrayErrorRepeat = []; //Repetidos en el excel

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const worksheet = workbook.getWorksheet(1);
    const items: IFundsUploadMasive[] = [];
    const headers: string[] = [];

    let bandControlForValidEmpty: boolean = false;
    let bandControlForValidDates: boolean = false;
    let bandControlForExistFunds: boolean = false;
    let bandControlForRepeatExcelFunds: boolean = false;
    let auxArrayFunds: string[] = []; //Guardar fondo para validar repetidos

    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      headers.push(cell.value?.toString() || '');
    });

    // ------------------------------ //
    // --- Comparación de títulos --- //
    // ------------------------------ //
    const validTitles = this.validTitles(headers);

    worksheet.eachRow( (row, rowIndex) => {

      //* Omitimos la primera fila porque es la de títulos.
      if (rowIndex === 1) return;

      // ------------------------------------ //
      // --- Comparación de celdas vacías --- //
      // ------------------------------------ //
      const validEmpty = this.validEmpty(row, rowIndex);
      if(validEmpty !== null) bandControlForValidEmpty = true;

      // ------------------------------------------ //
      // --- Comparación de fechas consistentes --- //
      // ------------------------------------------ //
      const validDates = this.validDates(row, rowIndex);
      if(validDates !== null) bandControlForValidDates = true;

      const objResult: IFundsUploadMasive = {
        row: rowIndex,
        cpEntity : row.getCell(1).value?.toString()!,
        code : row.getCell(2).value?.toString()!,
        denomination : row.getCell(3).value?.toString()!,
        description : row.getCell(4).value?.toString()!,
        dateFrom : new Date(Date.parse(row.getCell(5).value?.toString()!)),
        dateTo : new Date(Date.parse(row.getCell(6).value?.toString()!)),
      }

      // auxArrayFunds.push(row.getCell(2).value?.toString()!)
      items.push(objResult);

    });

    // ------------------------------------------------- //
    // --- Comparación de fondos duplicados en excel --- //
    // ------------------------------------------------- //
    let applyRow: number = 1;
    for (const iterFunds of items){

      applyRow += 1;
      if( auxArrayFunds.includes(iterFunds.code) ){

        const objError: IErrorsUploadMasive = {
          row: applyRow,
          description: `Tiene datos duplicados en el archivo`,
          additionalDef : `El fondo ${iterFunds.code} ubicado en la fila ${applyRow} se encuentra repetivo en el archivo`
        }

        this.arrayErrorRepeat.push(objError);
        bandControlForRepeatExcelFunds = true;

      }

      auxArrayFunds.push(iterFunds.code);

    }

    // ----------------------------------------- //
    // --- Comparación de si ya existe en BD --- //
    // ----------------------------------------- //
    let numberRow: number = 1;
    for (const iterFunds of items) {

      numberRow += 1;
      const search = await this.fundsRepository.getFundsByNumber(iterFunds.code);

      if( search.array.length > 0 ){

        const objError: IErrorsUploadMasive = {
          row: numberRow,
          description: `El fondo ya existe`,
          additionalDef : `El fondo ${iterFunds.code} ubicado en la fila ${numberRow} ya está registrado en la base de datos`
        }

        this.arrayErrorExist.push(objError);
        bandControlForExistFunds = true;

      }

    }

    // ***************************************************** //
    // **** ORGANIZO LAS RESPUESTAS DE LAS VALIDACIONES **** //
    // ***************************************************** //
    if(validTitles !== null) return new ApiResponse(this.arrayErrorStructure, EResponseCodes.FAIL, "El archivo no cumple la estructura");
    if(this.arrayEmptyData.length > 0 || bandControlForValidEmpty) return new ApiResponse(this.arrayEmptyData, EResponseCodes.FAIL, "Algún dato está vacío");
    if(this.arrayErrorDates.length > 0 || bandControlForValidDates) return new ApiResponse(this.arrayErrorDates, EResponseCodes.FAIL, "Error en fechas");
    if(this.arrayErrorExist.length > 0 || bandControlForExistFunds) return new ApiResponse(this.arrayErrorExist, EResponseCodes.FAIL, "El fondo ya existe");
    if(this.arrayErrorRepeat.length > 0 || bandControlForRepeatExcelFunds) return new ApiResponse(this.arrayErrorRepeat, EResponseCodes.FAIL, "Tiene datos duplicados en el archivo");

    const response: IResponseUploadMasive = {
      generalResponse: "Los filtros se superaron exitosamente",
      errorsResponse: null,
      headers,
      items
    }

    //? ******************************************** ?//
    //? ****** AGREGAR LOS FONDOS MASIVAMENTE ****** ?//
    //? ******************************************** ?//
    //TODO!


    // **************************************************** //
    // **** LIMPIAMOS ARREGLOS DE ERRORES AL FINALIZAR **** //
    // **************************************************** //
    this.arrayErrorStructure = []; //Estructura Columnas
    this.arrayEmptyData = []; //Columnas vacías
    this.arrayErrorDates = []; //Errores fechas
    this.arrayErrorExist = []; //Ya existe en la base de datos
    this.arrayErrorRepeat = []; //Repetidos en el excel

    return new ApiResponse(response, EResponseCodes.OK, "¡Archivo guardado exitosamente!");

  };

  //? ******************************************* ?//
  //? ********** VALIDACIÓN DE TITULOS ********** ?//
  //? ******************************************* ?//
  validTitles(headers: string[]): IResponseUploadMasive | IErrorsUploadMasive[] | null {

    const errors: IErrorsUploadMasive[] = [];
    let band: boolean = false;

    if(headers.length !== this.validArrayStructure.length){
      const objError: IErrorsUploadMasive = {
        row: 1,
        description: `El archivo no cumple la estructura`,
        additionalDef : `No están coincidiendo la cantidad de títulos de columna, deberíamos tener ${this.validArrayStructure.length}
                         columnas pero estamos obteniendo ${headers.length}`
      }
      this.arrayErrorStructure.push(objError);
      errors.push(objError);
      return errors;
    }

    for (let i = 0; i < headers.length; i++) {

      if(headers[i] !== this.validArrayStructure[i]){
        const objError: IErrorsUploadMasive = {
          row: 1,
          description: `El archivo no cumple la estructura.`,
          additionalDef : `No están coincidiendo los títulos de columna, se esperaba ${this.validArrayStructure[i]} en vez de ${headers[i]}`
        }
        this.arrayErrorStructure.push(objError);
        errors.push(objError);
        band = true;

      }

    }

    if( band ) return errors;
    return null;

  }

  //? ************************************************* ?//
  //? ********** VALIDACIÓN DE CELDAS VACÍAS ********** ?//
  //? ************************************************* ?//
  validEmpty(row: any, rowIndex: number): IErrorsUploadMasive[] | null {

    let band: boolean = false;
    if( !row.getCell(1).value || row.getCell(1).value === "" || row.getCell(1).value == null || row.getCell(1).value == undefined ){

      const objError: IErrorsUploadMasive = {
        row: rowIndex,
        description: `Algún dato está vacío`,
        additionalDef: `La ENTIDAD SAPI está vacía en la fila ${rowIndex}`
      }

      this.arrayEmptyData.push(objError);
      band = true;

    }

    if( !row.getCell(2).value || row.getCell(2).value === "" || row.getCell(2).value == null || row.getCell(2).value == undefined ){

      const objError: IErrorsUploadMasive = {
        row: rowIndex,
        description: `Algún dato está vacío`,
        additionalDef: `El CODIGO está vacío en la fila ${rowIndex}`
      }

      this.arrayEmptyData.push(objError);
      band = true;

    }

    if( !row.getCell(3).value || row.getCell(3).value === "" || row.getCell(3).value == null || row.getCell(3).value == undefined ){

      const objError: IErrorsUploadMasive = {
        row: rowIndex,
        description: `Algún dato está vacío`,
        additionalDef: `La DENOMINACION está vacía en la fila ${rowIndex}`
      }

      this.arrayEmptyData.push(objError);
      band = true;

    }

    if( !row.getCell(4).value || row.getCell(4).value === "" || row.getCell(4).value == null || row.getCell(4).value == undefined ){

      const objError: IErrorsUploadMasive = {
        row: rowIndex,
        description: `Algún dato está vacío`,
        additionalDef: `La DESCRIPCION está vacía en la fila ${rowIndex}`
      }

      this.arrayEmptyData.push(objError);
      band = true;

    }

    if( !row.getCell(5).value || row.getCell(5).value === "" || row.getCell(5).value == null || row.getCell(5).value == undefined ){

      const objError: IErrorsUploadMasive = {
        row: rowIndex,
        description: `Algún dato está vacío`,
        additionalDef: `La VALIDEZ DE está vacía en la fila ${rowIndex}`
      }

      this.arrayEmptyData.push(objError);
      band = true;

    }

    if( !row.getCell(6).value || row.getCell(6).value === "" || row.getCell(6).value == null || row.getCell(6).value == undefined ){

      const objError: IErrorsUploadMasive = {
        row: rowIndex,
        description: `Algún dato está vacío`,
        additionalDef: `La VALIDEZ A está vacía en la fila ${rowIndex}`
      }

      this.arrayEmptyData.push(objError);
      band = true;

    }

    if( band ) return this.arrayEmptyData;
    return null;

  }

  //? ****************************************** ?//
  //? ********** VALIDACIÓN DE FECHAS ********** ?//
  //? ****************************************** ?//
  validDates(row: any, rowIndex: number): IErrorsUploadMasive[] | null {

    let band: boolean = false;
    const getDateFrom: Date = new Date(Date.parse(row.getCell(5).value));
    const getDateTo: Date = new Date(Date.parse(row.getCell(6).value));

    if( getDateFrom > getDateTo ){

      const objError: IErrorsUploadMasive = {
        row: rowIndex,
        description: `Error en fechas`,
        additionalDef: `La VALIDEZ DE ${getDateFrom} es mayor a la VALIDEZ A ${getDateTo} en la fila ${rowIndex}`
      }

      this.arrayErrorDates.push(objError);
      band = true;

    }


    if( band ) return this.arrayErrorDates;
    return null;

  }


  async insertFundsinfo(items: any[], model: any): Promise<void>{
    for (const item of items) {
      try {
        const res = await model.create(item);
        return res;
      } catch (error) {
        console.error(`Error de validación para el item: ${error}`);
      }
    }
  }


}
