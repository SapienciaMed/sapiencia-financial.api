import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreditorsProvider from '@ioc:core.CreditorsProvider'
import { EResponseCodes } from 'App/Constants/ResponseCodesEnum';
import { ApiResponse } from 'App/Utils/ApiResponses';

export default class CreditorsController {
    public async getCreditorsByFilters({ response }: HttpContextContract) {
        try {
            return response.send(
                await CreditorsProvider.getCreditorsByFilters()
            );
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }


}
