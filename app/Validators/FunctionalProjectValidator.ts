import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class FunctionalProjectValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
      id:schema.number.optional(),
      entityId:schema.number(),
      number:schema.string(),
      name:schema.string(),
      isActivated:schema.boolean(),
      exercise:schema.number(),
      dateFrom:schema.string(),
      dateTo:schema.string(),
      budgetValue:schema.number.optional(),
      assignmentValue:schema.number.optional(),
      userModify:schema.string.optional(),
      dateModify:schema.string(),
      userCreate:schema.string.optional(),
      dateCreate:schema.string(),
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
