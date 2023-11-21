import * as fs from 'fs';
import * as mimeTypes from 'mime-types';
import * as path from 'path';
import * as ExcelJS from 'exceljs';

import { IPago, IPagoFilters, IPagoMasive } from 'App/Interfaces/PagPagosInterfaces';
import { IPagingData } from 'App/Utils/ApiResponses';
import PagoRepository, { IFileData } from 'App/Repositories/PagPagosRepository';
import { ApiResponse } from '../Utils/ApiResponses';
import { EResponseCodes } from '../Constants/ResponseCodesEnum';
import { IResponseUploadMasive, IErrorsUploadMasive } from 'App/Interfaces/UploadMasiveInterfaces';
import LinkRpcdp from 'App/Models/LinkRpcdp';
import PagPagosValidator from 'App/Validators/PagPagosValidator';
import PagPagos from 'App/Models/PagPagos';
export interface IPagoService {
  uploadMasivePagos(fileData: any, usuarioCreo:any): Promise<ApiResponse<any>>;
  getPagosPaginated(filters: IPagoFilters): Promise<IPagingData<IPago | null>>;
  processDocument(fileData: IFileData): Promise<void>;
}

export default class PagoService implements IPagoService {
  constructor(private pagoRepository: PagoRepository) {}

  public bandErrors: boolean = false;
  public validArrayStructure: string[] = ["POSICION", "PAG_VALOR_CAUSADO", "PAG_VALOR_PAGADO"];

  public arrayErrorStructure: IErrorsUploadMasive[] = [];

  async getPagosPaginated(filters: IPagoFilters): Promise<IPagingData<IPago | null>> {
    return this.pagoRepository.getPagosPaginated(filters);
  }


  public async processDocument(fileData: IFileData): Promise<void> {
    const { documentType, fileContent } = fileData;
    await this.pagoRepository.processDocument(documentType, fileContent);
  }

  async uploadMasivePagos(fileData: any,usuarioCreo:any): Promise<ApiResponse<any>> {
 
    const result = await this.processBase64(fileData);
    let responseData;
   
  
    if (Object.keys(result).length > 0) {
      const items = result?.data?.items;
  
      if (items && Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const vinculacionRprIcd = await LinkRpcdp.query()
            .select('VRP_CODIGO')
            .where('VRP_CODRPR_REGISTRO_PRESUPUESTAL', item.posicion)
            .first();

          if (vinculacionRprIcd) {
            const pago: IPago = {
              vinculacionRpCode: vinculacionRprIcd.id,
              valorCausado: parseFloat(item.valorCausado),
              valorPagado: parseFloat(item.valorPagado),
              usuarioCreo: usuarioCreo,
              fechaCreo: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };
            responseData = await this.insertItemsToDatabase([pago], PagPagosValidator, PagPagos);
          }
        }
      } else {
        console.error('La propiedad "items" no es un arreglo válido o está vacía.');
      }
    } else {
      console.error('La estructura de datos "result" está vacía o no es válida.');
    }
  
    // Retorna un valor predeterminado en caso de que ninguna de las condiciones anteriores se cumpla
    return new ApiResponse(responseData, EResponseCodes.OK, 'Pagos cargados correctamente!');
  }
  

  async processBase64(fileContent: string): Promise<ApiResponse<IResponseUploadMasive | null>> {

    const fileBuffer = Buffer.from(fileContent, 'base64');
    const fileExtension = mimeTypes.extension('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const tempFilePath = path.join(__dirname, '/tmp/uploads', `tempFile.${fileExtension}`);

    try {
      fs.writeFileSync(tempFilePath, fileBuffer);
    } catch (error) {
      throw new Error(`Error al escribir el archivo temporal: ${error.message}`);
    }

    const readInfo = await this.readExcel(fileBuffer);
    fs.unlinkSync(tempFilePath);

    return readInfo;

  }

  public readExcel = async (fileBuffer: Buffer): Promise<ApiResponse<IResponseUploadMasive | null>> => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const worksheet = workbook.getWorksheet(1);
    const items: IPagoMasive[] = [];
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

      const objResult: IPagoMasive = {
        id: rowIndex,
        posicion: parseInt(row.getCell(1).value?.toString()!),
        valorCausado: parseFloat(row.getCell(2).value?.toString()!),
        valorPagado: parseFloat(row.getCell(3).value?.toString()!),
      };

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

  private async insertItemsToDatabase(items: any[], validator: any, model: any): Promise<void> {
    for (const item of items) {
      try {
        console.log(validator);
        
        const res = await model.create(item);
        return res;
      } catch (error) {
        console.error(`Error de validación para el item: ${error}`);
      }
    }
  }
  



}
