import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BudgetRecordProvider from '@ioc:core.BudgetRecordProvider'
import { EResponseCodes } from 'App/Constants/ResponseCodesEnum';
import { IBudgetRecordFilter } from 'App/Interfaces/BudgetRecord';
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
    
    public async updateDataBasicRp({ request,response }: HttpContextContract) {
        try {
            const budgetRecordDataBasic = await request.validate(BudgetRecordValidator);
            return response.send(
                await BudgetRecordProvider.updateDataBasicRp(budgetRecordDataBasic)
            );
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }
    
    public async getComponents({ response }: HttpContextContract) {
        try {
            return response.send(
                await BudgetRecordProvider.getComponents()
            );
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }
    
    public async getRpByFilters({ request,response }: HttpContextContract) {
        try {
            const budgetRecordFilter = request.body() as IBudgetRecordFilter;
            return response.send(
                await BudgetRecordProvider.getRpByFilters(budgetRecordFilter)
            );
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }

    public async getTotalValuesImports({ request, response }: HttpContextContract) {
        try {
          const { id } = request.params() as { id: number };
          return response.send(await BudgetRecordProvider.getTotalValuesImports(id));
        } catch (err) {
          return response.badRequest(
            new ApiResponse(null, EResponseCodes.FAIL, String(err))
          );
        }
      }
      
      public async updateRp({ request,response }: HttpContextContract) {
        try {
            const { id } = request.params() as { id: number };
            //const budgetRecordDataBasic = await request.validate(LinkValidator);
            
            return response.send(
                await BudgetRecordProvider.updateRp(id,request.all())
            );
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }
      
    public async getAllActivityObjectContracts({ request,response }: HttpContextContract) {
        try {
            
            return response.send(
                await BudgetRecordProvider.getAllActivityObjectContracts()
            );
        } catch (err) {
            return response.badRequest(
                new ApiResponse(null, EResponseCodes.FAIL, String(err))
            );
        }
    }


}
