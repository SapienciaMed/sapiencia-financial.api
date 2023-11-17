import { schema,  CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class validateVinculateMGA {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        cdpId: schema.number(),
        costMGA: schema.number(),

    });

    public messages: CustomMessages = {
        // Personaliza los mensajes de error aquí si es necesario
    };
}
