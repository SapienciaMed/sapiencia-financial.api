import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreditorsProvider from '@ioc:core.CreditorsProvider'
import { EResponseCodes } from 'App/Constants/ResponseCodesEnum';
import { ICreditorsFilter } from 'App/Interfaces/Creditors';
import { ApiResponse } from 'App/Utils/ApiResponses';

export default class CreditorsController {
    public async getCreditorsByFilters({ request, response }: HttpContextContract) {
        try {
            const data= request.body() as ICreditorsFilter

            return response.send(
                await CreditorsProvider.getCreditorsByFilters(data)
            );
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }


}
