import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EResponseCodes } from 'App/Constants/ResponseCodesEnum';
import { ApiResponse } from 'App/Utils/ApiResponses';
import PacProvider from '@ioc:core.PacProvider'

export default class PacsController {

    public async uploadPac({request, response}:HttpContextContract){
        let data = request.body();
        console.log({data})
        if (!request.file('file')) {
            return response.status(400).json({ message: 'No se ha proporcionado ningún archivo' })
        }

        const file = request.file('file', { 
            size: '20mb',
            extnames: ['xlsx', 'xls'],
         })
        
        try {
            const { id } = request.params();
            return response.send(await PacProvider.uploadPac(file));
          } catch (err) {
            return response.badRequest(
              new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
          }

    }


}
