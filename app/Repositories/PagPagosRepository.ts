import * as fs from 'fs';
import * as mimeTypes from 'mime-types';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { IPago, IPagoFilters } from 'App/Interfaces/PagPagosInterfaces';
import { IPagingData } from 'App/Utils/ApiResponses';
import PagPagos from 'App/Models/PagPagos';
import Funds from 'App/Models/Funds';
import PagPagosValidator from 'App/Validators/PagPagosValidator';
import FundsValidator from 'App/Validators/FundsValidator';


export interface IPagoRepository {
  getPagosPaginated(filters: IPagoFilters): Promise<IPagingData<IPago | null>>;
  readExcel(fileBuffer: Buffer, documentType: string): Promise<IPago[]>;
}

export interface IFileData {
  documentType: string;
  fileContent: string;
}

export default class PagoRepository implements IPagoRepository {

  public getPagosPaginated = async (filters: IPagoFilters): Promise<IPagingData<IPago | null>> => {
    
    
    const query = PagPagos.query();

    if (filters.vinculacionRpCode) {
      query.where('vinculacionRpCode', filters.vinculacionRpCode);
    }

    const res = await query.paginate(filters.page, filters.perPage);
    const { data, meta } = res.serialize();

    return {
      array: data !== null ? (data as IPago[]) : [],
      meta,
    };
  };

 

  public readExcel = async (fileBuffer: Buffer, documentType: string): Promise<IPago[]> => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const worksheet = workbook.getWorksheet(1);
    const items: IPago[] = [];
    const headers: string[] = [];

    worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      headers.push(cell.value?.toString() || '');
    });

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return;

      const item: IPago = {} as IPago;

      row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
        const header = headers[colIndex - 1];
        if (header) {
          switch (documentType) {
            case 'pago':
              this.assignPagoProperty(item, header, cell.value);
              break;
            case 'funds':
              this.assignFundsProperty(item, header, cell.value);
              break;
            default:
              throw new Error(`Tipo de documento no reconocido: ${documentType}`);
          }
        }
      });

      if (Object.values(item).some((value) => value !== undefined && value !== null && value !== '')) {
        items.push(item);
      }
    });

    return items;
  };

  private assignPagoProperty(pago: IPago, header: string, value: any): void {
    switch (header) {
      case 'ID':
        pago.id = typeof value === 'number' ? value : undefined;
        break;
      case 'VinculacionRpCode':
        pago.vinculacionRpCode = typeof value === 'number' ? value : 0;
        break;
      case 'ValorCausado':
        pago.valorCausado = this.getNumberValue(value);
        break;
      case 'ValorPagado':
        pago.valorPagado = this.getNumberValue(value);
        break;
      case 'UsuarioCreo':
        pago.usuarioCreo = value?.toString() || '';
        break;
      case 'FechaCreo':
        pago.fechaCreo = value?.toString() || '';
        break;
      // Agrega más casos según sea necesario para otros títulos
      default:
        break;
    }
  }

  private assignFundsProperty(funds: IPago, header: string, value: any): void {
    switch (header) {
      case 'ID':
        funds.id = typeof value === 'number' ? value : undefined;
        break;
      case 'VinculacionRpCode':
        funds.vinculacionRpCode = typeof value === 'number' ? value : 0;
        break;
      case 'ValorCausado':
        funds.valorCausado = this.getNumberValue(value);
        break;
      case 'ValorPagado':
        funds.valorPagado = this.getNumberValue(value);
        break;
      case 'UsuarioCreo':
        funds.usuarioCreo = value?.toString() || '';
        break;
      case 'FechaCreo':
        funds.fechaCreo = value?.toString() || '';
        break;
      // Agrega más casos según sea necesario para otros títulos de Funds
      default:
        break;
    }
  }

  private getNumberValue(cellValue: any): number {
    return typeof cellValue === 'number' ? cellValue : 0;
  }

  public async processDocument(documentType: string, fileContent: string): Promise<void> {
      await this.processDocumentType(fileContent, PagPagosValidator, PagPagos, documentType);
  /*   switch (documentType) {
      case 'pago':
        break;
      case 'funds':
        await this.processDocumentType(fileContent, FundsValidator, Funds, documentType);
        break;
      default:
        throw new Error(`Tipo de documento no reconocido: ${documentType}`);
    } */
  }

  private async processDocumentType(fileContent: string, validator: any, model: any, documentType: string): Promise<void> {
    const fileBuffer = Buffer.from(fileContent, 'base64');
    const fileExtension = mimeTypes.extension('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const tempFilePath = path.join(__dirname, 'temp', `tempFile.${fileExtension}`);
    fs.writeFileSync(tempFilePath, fileBuffer);

    const items = await this.readExcel(fileBuffer, documentType);
    await this.insertItemsToDatabase(items, validator, model);

    fs.unlinkSync(tempFilePath);
  }

  private async insertItemsToDatabase(items: any[], validator: any, model: any): Promise<void> {
    for (const item of items) {
      try {
        await validator.validate({
          schema: validator.schema,
          data: item,
        });

      const res = await model.create(item);
      return res
      } catch (error) {
        console.error(`Error de validación para el item: ${error.messages}`);
      }
    }
  }
}
