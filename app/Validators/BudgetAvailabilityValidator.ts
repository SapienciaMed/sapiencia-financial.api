import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class BudgetAvailabilityValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    id: schema.number.optional(),
    exercise: schema.string(),
    date: schema.date(),
    contractObject: schema.string(),
    consecutive: schema.number(),
    sapConsecutive: schema.number(),
    icdArr: schema.array().members(
      schema.object().members({
        id: schema.number.optional(),
        idRppCode: schema.number(),
        cdpPosition: schema.number(),
        amount: schema.number(),
        isActive: schema.boolean.optional(),
        reasonCancellation: schema.string.optional(),
      })
    ),
  });

  public messages: CustomMessages = {};
}