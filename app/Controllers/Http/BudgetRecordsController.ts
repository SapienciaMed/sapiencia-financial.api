import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BudgetRecordProvider from '@ioc:core.BudgetRecordProvider'
import { EResponseCodes } from 'App/Constants/ResponseCodesEnum';
import { ApiResponse } from 'App/Utils/ApiResponses';
import BudgetRecordValidator from 'App/Validators/BudgetRecordValidator';

export default class BudgetRecordsController {

    public async createRp({ request,response }: HttpContextContract) {
        try {
            const budgetRecord = await request.validate(BudgetRecordValidator);
            return response.send(
                await BudgetRecordProvider.createCdps(budgetRecord)
            );
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }
    
    public async getComponents({ response }: HttpContextContract) {
        try {
            console.log("111111")
            return response.send(
                await BudgetRecordProvider.getComponents()
            );
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }


}
