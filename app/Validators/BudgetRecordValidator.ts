import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class BudgetRecordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    supplierType: schema.string(),
    supplierId: schema.number(),
    contractorDocument: schema.string(),
    documentDate: schema.date(),
    dateValidity: schema.date(),
    dependencyId: schema.number(),
    contractualObject: schema.string(),
    componentId: schema.number(),
    userCreate: schema.string.optional(),
    userModify: schema.string.optional(),
    dateCreate: schema.date.optional(),
    dateModify: schema.string.optional(),
    linksRp: schema.array.optional().members(
        schema.object().members({
            id: schema.number.optional(),
            rpId: schema.number(),
            amountCdpId: schema.number(),
            initialAmount: schema.number.optional(),
            isActive: schema.boolean.optional(),
            reasonCancellation: schema.string.optional(),
        })
    )
      
  });

  public messages: CustomMessages = {};
}
