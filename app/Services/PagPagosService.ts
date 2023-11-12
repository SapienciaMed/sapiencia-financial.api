import { IPago, IPagoFilters } from 'App/Interfaces/PagPagosInterfaces';
import { IPagingData } from 'App/Utils/ApiResponses';
import PagoRepository, { IFileData } from 'App/Repositories/PagPagosRepository';
import { ApiResponse } from '../Utils/ApiResponses';
import { EResponseCodes } from '../Constants/ResponseCodesEnum';

export interface IPagoService {
  getCommunication(fileData: any): Promise<ApiResponse<any>>;
  getPagosPaginated(filters: IPagoFilters): Promise<IPagingData<IPago | null>>;
  processDocument(fileData: IFileData): Promise<void>;
}

export default class PagoService implements IPagoService {
  constructor(private pagoRepository: PagoRepository) {}

  async getPagosPaginated(filters: IPagoFilters): Promise<IPagingData<IPago | null>> {
    return this.pagoRepository.getPagosPaginated(filters);
  }

  async processDocument(fileData: IFileData): Promise<void> {
    const { documentType, fileContent } = fileData;

    switch (documentType) {
      case 'pago':
        await this.processPagoDocument(fileContent);
        break;
      default:
        throw new Error(`Tipo de documento no reconocido: ${documentType}`);
    }
  }

  private async processPagoDocument(_fileContent: string): Promise<void> {
   /*  const pagos: IPago[] = await this.pagoRepository.readExcel(fileContent);
    await this.pagoRepository.insertPagosToDatabase(pagos, PagPagosValidator); */
  }

  async getCommunication(fileData: any): Promise<ApiResponse<any>> {

    console.log("Hola!");
    console.log(fileData);
    return new ApiResponse(null, EResponseCodes.INFO, "Llegamos hasta el servicio de PagPagos");

  }

}
