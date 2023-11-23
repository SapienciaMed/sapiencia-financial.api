import { schema, CustomMessages} from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreditorValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    typeDocument: schema.string.optional(),
    document: schema.string.optional(),
    taxIdentification: schema.string.optional(),
    name: schema.string.optional(),
    city: schema.string.optional(),
    address: schema.string.optional(),
    phone: schema.number.optional(),
    email: schema.string.optional(),
    userModify: schema.string.optional(),
    userCreate: schema.string.optional(),
    dateCreate: schema.date.optional(),
    dateModify: schema.string.optional()
    
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {};
}
