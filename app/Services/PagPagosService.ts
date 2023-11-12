import { IPago, IPagoFilters } from 'App/Interfaces/PagPagosInterfaces';
import { IPagingData } from 'App/Utils/ApiResponses';
import PagoRepository, { IFileData } from 'App/Repositories/PagPagosRepository';

export interface IPagoService {
  getPagosPaginated(filters: IPagoFilters): Promise<IPagingData<IPago | null>>;
  processDocument(fileData: IFileData): Promise<void>;
}

export default class PagoService implements IPagoService {
  constructor(private pagoRepository: PagoRepository) {}

  async getPagosPaginated(filters: IPagoFilters): Promise<IPagingData<IPago | null>> {
    return this.pagoRepository.getPagosPaginated(filters);
  }

  public async processDocument(fileData: IFileData): Promise<void> {
    const { documentType, fileContent } = fileData;
    await this.pagoRepository.processDocument(documentType, fileContent);
  
/*     switch (documentType) {
      case 'pago':
        break;
      case 'funds':
        await this.pagoRepository.processDocument(documentType, fileContent);
        break;
      default:
        throw new Error(`Tipo de documento no reconocido: ${documentType}`);
    } */
  }
  


}
