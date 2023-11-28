import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PagoService from 'App/Services/PagPagosService';
import PagPagosRepository from 'App/Repositories/PagPagosRepository'; // Asegúrate de importar el repositorio correcto
import { IPagoFilters } from 'App/Interfaces/PagPagosInterfaces';
import { ApiResponse } from 'App/Utils/ApiResponses';
import { EResponseCodes } from 'App/Constants/ResponseCodesEnum';

export default class PagPagosController {
  private pagoService: PagoService;

  constructor() {
    const pagoRepository = new PagPagosRepository(); // Crea una instancia del repositorio
    this.pagoService = new PagoService(pagoRepository);
  }

  public async getPagosPaginated({ request, response }: HttpContextContract) {
    try {
      const data = request.body() as IPagoFilters;
      const result = await this.pagoService.getPagosPaginated(data);
      return response.send(new ApiResponse(result, EResponseCodes.OK));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }


  public async validarExistenciaRP({ request, response }: HttpContextContract) {
    try {
      const { posicion, consecutivoSap } = request.body(); // Asegúrate de enviar estos parámetros en el cuerpo de la solicitud
      const exists = await this.pagoService.validarExistenciaRP(posicion, consecutivoSap);

      if (exists) {
        
        return response.send(new ApiResponse(exists, EResponseCodes.OK, 'La relación existe.'));
      } else {
        return response.send(new ApiResponse(0, EResponseCodes.FAIL, 'La relación no existe.'));
      }
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async processDocument({ request, response }: HttpContextContract) {
    try {
      const { documentType, fileContent } = request.body();
      await this.pagoService.processDocument({ documentType, fileContent });
      return response.send(new ApiResponse(null, EResponseCodes.OK, 'Documento procesado con éxito'));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
