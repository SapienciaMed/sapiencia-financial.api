import * as fs from 'fs';
import * as mimeTypes from 'mime-types';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { IPago, IPagoFilters, IPagoResponse } from 'App/Interfaces/PagPagosInterfaces';
import { IPagingData } from 'App/Utils/ApiResponses';
import PagPagos from 'App/Models/PagPagos';
import PagPagosValidator from 'App/Validators/PagPagosValidator';
import LinkRpcdp from 'App/Models/LinkRpcdp';

export interface IPagoRepository {
  getPagosPaginated(filters: IPagoFilters): Promise<IPagingData<any | null>>; 
  readExcel(fileBuffer: Buffer, documentType: string): Promise<IPago[]>;
}

export interface IFileData {
  documentType: string;
  fileContent: string;
}

export default class PagoRepository implements IPagoRepository {


  mapPagoResponse(data: any[]): IPagoResponse[] {
    console.log(data);
    
    return data.map((item) => ({
      PAG_MES: item.mes,
      CONSECUTIVO_SAP: item.id,
      PAG_VALOR_CAUSADO: item.valorCausado,
      PAG_VALOR_PAGADO: item.valorPagado,
      VRP_POSICION: item['$extras'].VRP_POSICION,
      VRP_VALOR_FINAL: item['$extras'].VRP_VALOR_FINAL,
    }));
  }


  public getPagosPaginated = async (filters: IPagoFilters): Promise<IPagingData<IPagoResponse | null>> => {
    
    
    const query = PagPagos.query();
    if (filters.vinculacionRpCode) {
      query
        .innerJoin(
          'VRP_VINCULACION_RPR_ICD',
          'PAG_PAGOS.PAG_CODVRP_VINCULACION_RP',
          'VRP_VINCULACION_RPR_ICD.VRP_CODIGO'
        )
        .select([
          'PAG_PAGOS.*', // Selecciona todas las columnas de PAG_PAGOS
          'VRP_VINCULACION_RPR_ICD.*', // Selecciona todas las columnas de VRP_VINCULACION_RPR_ICD
        ])
        .where('VRP_VINCULACION_RPR_ICD.VRP_CODIGO', filters.vinculacionRpCode);    }
    
    if (filters.mes) {
      query.where('PAG_PAGOS.PAG_MES', filters.mes);
    }
  
    const res = await query.paginate(filters.page, filters.perPage);
    const dataExtra: any[] = [];
    res.forEach(element => {
      dataExtra.push(element['$extras']);
    });

    const { data, meta } = res.serialize();

    const newData = data.map((dataItem, index) => {
      return {
        ...dataItem,  // Mantén las propiedades originales de dataItem
        '$extras': dataExtra[index],  // Agrega las propiedades de dataExtra correspondientes
      };
    });


    console.log(newData);
    
    // console.log(JSON.stringify(data, null, 2));
    const responseData: IPagoResponse[] = this.mapPagoResponse(newData as any) || [];
   console.log("hola entramos aqui", responseData);
   
    return {
      array: responseData,
      meta,
    };
  };

  public getRPInformationPaginated = async (filters: IPagoFilters): Promise<IPagingData<IPagoResponse | null>> => {
    
    
    const query = PagPagos.query();
    if (filters.vinculacionRpCode) {
      query
        .innerJoin(
          'VRP_VINCULACION_RPR_ICD',
          'PAG_PAGOS.PAG_CODVRP_VINCULACION_RP',
          'VRP_VINCULACION_RPR_ICD.VRP_CODIGO'
        )
        .select([
          'PAG_PAGOS.*', // Selecciona todas las columnas de PAG_PAGOS
          'VRP_VINCULACION_RPR_ICD.*', // Selecciona todas las columnas de VRP_VINCULACION_RPR_ICD
        ])
        .where('VRP_VINCULACION_RPR_ICD.VRP_CODIGO', filters.vinculacionRpCode);    }
    
    if (filters.mes) {
      query.where('PAG_PAGOS.PAG_MES', filters.mes);
    }
  
    const res = await query.paginate(filters.page, filters.perPage);
    const dataExtra: any[] = [];
    res.forEach(element => {
      dataExtra.push(element['$extras']);
    });

    const { data, meta } = res.serialize();

    const newData = data.map((dataItem, index) => {
      return {
        ...dataItem,  // Mantén las propiedades originales de dataItem
        '$extras': dataExtra[index],  // Agrega las propiedades de dataExtra correspondientes
      };
    });


    console.log(newData);
    
    // console.log(JSON.stringify(data, null, 2));
    const responseData: IPagoResponse[] = this.mapPagoResponse(newData as any) || [];
   console.log("hola entramos aqui", responseData);
   
    return {
      array: responseData,
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
