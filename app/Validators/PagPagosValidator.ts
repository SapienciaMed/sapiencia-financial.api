import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import { IPago } from "App/Interfaces/PagPagosInterfaces";

export default class PagPagosValidator {
  public schema = schema.create({
    id: schema.number.optional(),
    vinculacionRpCode: schema.number(),
    valorCausado: schema.number(),
    valorPagado: schema.number(),
    usuarioCreo: schema.string(),
    fechaCreo: schema.date(),
  });

  public messages: CustomMessages = {};
}
