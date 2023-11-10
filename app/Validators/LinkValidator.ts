import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class LinkValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number(),
    rpId: schema.number.optional(),
    amountCdpId: schema.number.optional(),
    initialAmount: schema.number.optional(),
    creditAmount: schema.number.optional(),
    againtsAmount: schema.number.optional(),
    fixedCompleted: schema.number.optional(),
    finalAmount: schema.number.optional(),
    isActive: schema.boolean.optional(),
    reasonCancellation: schema.string.optional(),    
    position: schema.number.optional(),
    observation: schema.string.optional(),    
    
    
  });

  public messages: CustomMessages = {};
}

