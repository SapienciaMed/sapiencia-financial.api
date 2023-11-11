import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CdpVinculateMGAValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        datos: schema.array().members(
            schema.object().members({
                activitieMga: schema.number(),
                activitieDetailMga: schema.number(),
                percentageAfected: schema.number(),
                cdpCode: schema.number(),
            })
        )
    });

    public messages: CustomMessages = {
        // Personaliza los mensajes de error aquí si es necesario
    };
}
