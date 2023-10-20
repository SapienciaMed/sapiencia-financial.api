import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CdpsValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    id: schema.number.optional(),
    date: schema.date(),
    contractObject: schema.string(),
    consecutive: schema.number(),
    sapConsecutive: schema.number(),
    icdArr: schema.array().members(
      schema.object().members({
        idRppCode: schema.number(),
        cdpPosition: schema.number(),
        amount: schema.number(),
      })
    ),
  });

  public messages: CustomMessages = {};
}