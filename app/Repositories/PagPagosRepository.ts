import * as fs from 'fs';
import * as mimeTypes from 'mime-types';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { IPago, IPagoFilters } from 'App/Interfaces/PagPagosInterfaces';
import { IPagingData } from 'App/Utils/ApiResponses';
import PagPagos from 'App/Models/PagPagos';
import VinculationMGARepository from './VinculationMGARepository';
import PagPagosValidator from 'App/Validators/PagPagosValidator';

export interface IPagoRepository {
    getPagosPaginated(filters: IPagoFilters): Promise<IPagingData<IPago | null>>;
    readExcel(fileBuffer: Buffer): Promise<IPago[]>;
}
  
export interface IFileData {
    documentType: string; 
    fileContent: string; 
  }

export default class PagoRepository implements IPagoRepository {
  public getPagosPaginated = async (filters: IPagoFilters): Promise<IPagingData<IPago | null>> => {
    const query = PagPagos.query();

    if (filters.id) {
        query.where('id', filters.id);
    }

    if (filters.vinculacionRpCode) {
        query.where('vinculacionRpCode', filters.vinculacionRpCode);
    }

    const res = await query.paginate(filters.page, filters.perPage);
    const { data, meta } = res.serialize();

    return {
        array: data !== null ? data as IPago[] : [],
        meta,
      };
  };

  public readExcel = async (fileBuffer: Buffer): Promise<IPago[]> => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const worksheet = workbook.getWorksheet(1);

    const pagos: IPago[] = [];

    worksheet.eachRow((row, rowNumber) => {
        const idCellValue = row.getCell(1).value;
        const vinculacionRpCodeCellValue = row.getCell(2).value;

        const id: number | undefined = typeof idCellValue === 'number' ? idCellValue : undefined;
        const vinculacionRpCode: number | undefined = typeof vinculacionRpCodeCellValue === 'number' ? vinculacionRpCodeCellValue : undefined;

        const valorCausado: number = this.getNumberValue(row.getCell(3));
        const valorPagado: number = this.getNumberValue(row.getCell(4));
        const usuarioCreo: string = row.getCell(5).value!.toString();
        const fechaCreo: string = row.getCell(6).value!.toString();
        if (id !== undefined || vinculacionRpCode !== undefined) {
            const pago: IPago = {
                id: id !== undefined ? id : 0,
                vinculacionRpCode: vinculacionRpCode !== undefined ? vinculacionRpCode : 0,
                valorCausado,
                valorPagado,
                usuarioCreo,
                fechaCreo,
            };

            pagos.push(pago);
        }
    });

    return pagos;
};

private getNumberValue(cell: ExcelJS.Cell): number {
    const cellValue = cell.value;
    return typeof cellValue === 'number' ? cellValue : 0;
}


public async processDocument(fileData: IFileData): Promise<void> {
    const { documentType, fileContent } = fileData;

    switch (documentType) {
      case 'pago':
        await this.processPagoDocument(fileContent, PagPagosValidator);
        break;
      default:
        throw new Error(`Tipo de documento no reconocido: ${documentType}`);
    }
  }

  private async processPagoDocument(fileContent: string, validator: any): Promise<void> {
    const fileBuffer = Buffer.from(fileContent, 'base64');
    const fileExtension = mimeTypes.extension('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const tempFilePath = path.join(__dirname, 'temp', `tempFile.${fileExtension}`);
    fs.writeFileSync(tempFilePath, fileBuffer);
  
    const pagos: IPago[] = await this.readExcel(fileBuffer);
    await this.insertPagosToDatabase(pagos, validator);
  
    fs.unlinkSync(tempFilePath);
  }
  

  private async insertPagosToDatabase(pagos: IPago[], validator: any): Promise<void> {
    for (const pago of pagos) {
      try {
        await validator.validate({
          schema: validator.schema,
          data: {
            id: pago.id,
            vinculacionRpCode: pago.vinculacionRpCode,
            valorCausado: pago.valorCausado,
            valorPagado: pago.valorPagado,
            usuarioCreo: pago.usuarioCreo,
            fechaCreo: pago.fechaCreo,
          },
        });
  
        await PagPagos.create({
          id: pago.id,
          vinculacionRpCode: pago.vinculacionRpCode,
          valorCausado: pago.valorCausado,
          valorPagado: pago.valorPagado,
          usuarioCreo: pago.usuarioCreo,
          fechaCreo: pago.fechaCreo,
        });
      } catch (error) {
        console.error(`Error de validación para el pago ${pago.id}: ${error.messages}`);
      }
    }
  }
  
  }


