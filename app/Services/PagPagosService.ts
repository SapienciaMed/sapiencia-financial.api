import * as fs from 'fs';
import * as mimeTypes from 'mime-types';
import * as path from 'path';
import * as ExcelJS from 'exceljs';

import { IPago, IPagoFilters, IPagoMasive,IPagoResponse,IPagoMasiveSave } from 'App/Interfaces/PagPagosInterfaces';
import { IPagingData } from 'App/Utils/ApiResponses';
import PagoRepository, { IFileData } from 'App/Repositories/PagPagosRepository';
import { ApiResponse } from '../Utils/ApiResponses';
import { EResponseCodes } from '../Constants/ResponseCodesEnum';
import { IResponseUploadMasive, IErrorsUploadMasive } from 'App/Interfaces/UploadMasiveInterfaces';
import LinkRpcdp from 'App/Models/LinkRpcdp';
import PagPagosValidator from 'App/Validators/PagPagosValidator';
import PagPagos from 'App/Models/PagPagos';
export interface IPagoService {
  uploadMasivePagos(fileData: any, usuarioCreo:any,mes:number): Promise<ApiResponse<any>>;
  getPagosPaginated(filters: IPagoFilters): Promise<IPagingData<IPagoResponse | null>>;
  processDocument(fileData: IFileData): Promise<void>;
}

export default class PagoService implements IPagoService {
  constructor(private pagoRepository: PagoRepository) {}

  public bandErrors: boolean = false;
  public validArrayStructure: string[] = ["POSICION", "PAG_VALOR_CAUSADO", "PAG_VALOR_PAGADO"];

  public arrayErrorStructure: IErrorsUploadMasive[] = [];

  async getPagosPaginated(filters: IPagoFilters): Promise<IPagingData<IPagoResponse | null>> {
    return this.pagoRepository.getPagosPaginated(filters);
  }

  public async processDocument(fileData: IFileData): Promise<void> {
    const { documentType, fileContent } = fileData;
    await this.pagoRepository.processDocument(documentType, fileContent);
  }

  async uploadMasivePagos(fileData: any,usuarioCreo:any,mes:number): Promise<ApiResponse<any>> {
 
    const result = await this.processBase64(fileData,mes);
    let responseData;
   
  
    if (Object.keys(result).length > 0) {
      const items = result?.data?.items;

     
      
      if (items && Array.isArray(items) && items.length > 0) {
        for (const item of items) {
       /*    const vinculacionRprIcd = await LinkRpcdp.query()
          .select('VRP_CODIGO')
          .where('VRP_CODRPR_REGISTRO_PRESUPUESTAL', item.posicion)
          .first(); */
            const pago: IPagoMasiveSave = {
              vinculacionRpCode: item.vinculacionRpCode,
              valorCausado: parseFloat(item.valorCausado),
              valorPagado: parseFloat(item.valorPagado),
              usuarioCreo: usuarioCreo,
              mes: mes,
              fechaCreo: new Date(new Date().toISOString().slice(0, 19).replace('T', ' ')),
            };
            responseData = await this.insertItemsToDatabase([pago], PagPagosValidator, PagPagos);
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
  

  async processBase64(fileContent: string, mes:number): Promise<ApiResponse<IResponseUploadMasive | null>> {

    const fileBuffer = Buffer.from(fileContent, 'base64');
    const fileExtension = mimeTypes.extension('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const tempFilePath = path.join(__dirname, '/files/uploads', `tempFile.${fileExtension}`);

    try {
      fs.writeFileSync(tempFilePath, fileBuffer);
    } catch (error) {
      throw new Error(`Error al escribir el archivo temporal: ${error.message}`);
    }

    const readInfo = await this.readExcel(fileBuffer,mes);
    fs.unlinkSync(tempFilePath);

    return readInfo;

  }

  public readExcel = async (fileBuffer: Buffer, usuarioCreo:any): Promise<ApiResponse<IResponseUploadMasive | null>> => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const worksheet = workbook.getWorksheet(1);
    const items: IPagoMasiveSave[] = [];
    const headers: string[] = [];

    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      headers.push(cell.value?.toString() || '');
    });


    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return;

      const objResult: IPagoMasiveSave = {
        id: rowIndex,
        posicion: parseInt(row.getCell(1).value?.toString()!),
        valorCausado: parseFloat(row.getCell(2).value?.toString()!),
        valorPagado: parseFloat(row.getCell(3).value?.toString()!),
        vinculacionRpCode: parseFloat(row.getCell(4).value?.toString()!),
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




  private async insertItemsToDatabase(items: any[], validator: any, model: any): Promise<void> {
    for (const item of items) {
   
      
      try {
        const res = await model.create(item);
        // Hacer algo con res si es necesario
      } catch (error) {
        console.error(`Error de validación para el item: ${error}`);
      }
    }
  }
  



}
