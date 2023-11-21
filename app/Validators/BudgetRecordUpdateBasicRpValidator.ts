import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class BudgetRecordUpdateBasicRpValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number(),
    dependencyId: schema.number.optional(),
    contractualObject: schema.string.optional(),
    componentId: schema.number.optional(),
    consecutiveSap: schema.number.optional(),
    documentDate: schema.date.optional(),
    dateValidity: schema.date.optional(),
    contractNumber: schema.string.optional(),
    responsibleDocument: schema.string.optional(),
    supervisorDocument: schema.string.optional(),
  });

  public messages: CustomMessages = {};
}
