import { schema,  CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class validateAllCdp {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        activitieId: schema.number(),
        valueFinal: schema.number(),
        activitieCost: schema.number()

    });

    public messages: CustomMessages = {
        // Personaliza los mensajes de error aquí si es necesario
    };
}
