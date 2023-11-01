import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BudgetRecordProvider from '@ioc:core.BudgetRecordProvider'
import { EResponseCodes } from 'App/Constants/ResponseCodesEnum';
import { ApiResponse } from 'App/Utils/ApiResponses';

export default class BudgetRecordsController {

    public async createRp({ response }: HttpContextContract) {
        try {

            //let data = await request.validate(BudgetAvailabilityValidator);
            return response.send(
                await BudgetRecordProvider.createCdps()
            );
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }


}
