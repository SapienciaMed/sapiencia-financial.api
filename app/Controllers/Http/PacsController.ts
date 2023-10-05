import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EResponseCodes } from 'App/Constants/ResponseCodesEnum';
import { ApiResponse } from 'App/Utils/ApiResponses';
import PacProvider from '@ioc:core.PacProvider'

export default class PacsController {

    public async uploadPac({request, response}:HttpContextContract){
        if (!request.file('file')) {
            return response.status(400).json({ message: 'No se ha proporcionado ningún archivo' })
        }

        const file = request.file('file', { 
            size: '20mb',
            extnames: ['xlsx', 'xls'],
         })
        const resp = await PacProvider.uploadPac(file)

        return response.accepted(
        new ApiResponse(resp, EResponseCodes.OK, "¡Proyecto guardado exitosamente!")
        );
    }


}
