import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PayrollProvider from '@ioc:core.PayrollProvider' 
import { EResponseCodes } from 'App/Constants/ResponseCodesEnum';
import { IContractorsFilter } from 'App/Interfaces/payrollInterfaceExt';
import { ApiResponse } from 'App/Utils/ApiResponses';

export default class PayrollsController {


    public async getAllDependencies({response}:HttpContextContract){
        try {
            return response.send(
                await PayrollProvider.getAllDependencies()
            );
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }
    
    public async getContractorsByDocuments({request, response}:HttpContextContract){
        try {
            let contractorsFilter = request.body() as IContractorsFilter

            return response.send(
                await PayrollProvider.getContractorsByDocuments(contractorsFilter)
            );
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }

}
