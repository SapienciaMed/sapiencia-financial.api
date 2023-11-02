import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class updateRouteCDPValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({     
        id: schema.number.optional(),
        idRppCode: schema.number(),
        cdpPosition: schema.number(),
        amount: schema.number(),
        isActive: schema.boolean.optional(),
        reasonCancellation: schema.string.optional(),
        modifiedIdcCountercredit: schema.number.optional(),
        idcModifiedCredit: schema.number.optional(),
        idcFixedCompleted: schema.number.optional(),
        idcFinalValue: schema.number.optional(),  
      })
   


  public messages: CustomMessages = {};
}
