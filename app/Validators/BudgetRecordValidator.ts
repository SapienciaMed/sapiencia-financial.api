import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class BudgetRecordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    supplierType: schema.string.optional(),
    supplierId: schema.number.optional(),
    contractorDocument: schema.string.optional(),
    documentDate: schema.date.optional(),
    dateValidity: schema.date.optional(),
    dependencyId: schema.number(),
    isNewContractObject:schema.boolean.optional(),
    contractualObject: schema.string(),
    componentId: schema.number(),
    consecutiveSap: schema.number.optional(),
    contractNumber: schema.string.optional(),
    responsibleDocument: schema.string.optional(),
    supervisorDocument: schema.string.optional(),
    userCreate: schema.string.optional(),
    userModify: schema.string.optional(),
    dateCreate: schema.date.optional(),
    dateModify: schema.string.optional(),
    linksRp: schema.array.optional().members(
        schema.object().members({
            id: schema.number.optional(),
            rpId: schema.number.optional(),
            amountCdpId: schema.number(),
            initialAmount: schema.number.optional(),
            creditAmount: schema.number.optional(),
            againtsAmount: schema.number.optional(),
            fixedCompleted: schema.number.optional(),
            finalAmount: schema.number.optional(),
            isActive: schema.boolean.optional(),
            reasonCancellation: schema.string.optional(),
            position: schema.number.optional(),
            observation: schema.string.optional(),
        })
    )
    
    
    
    
  });

  public messages: CustomMessages = {};
}
