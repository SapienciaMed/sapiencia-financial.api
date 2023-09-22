import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ADC_ADICIONES'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {

      table.comment(
        "Tabla que almacena las acciones de los traslados"
      );

      table.increments("ADC_CODIGO").primary().comment("Llave primaria - autogenerado");

      table
        .string("ADC_ACTO_ADMINISTRATIVO_DISTRITO", 200)
        .notNullable()
        .comment("Número del acto administrativo de distrito");

      table
        .string("ADC_ACTO_ADMINISTRATIVO_SAPIENCIA", 200)
        .notNullable()
        .comment("Número del acto administrativo de sapiencia");

      table
        .string("ADC_USUARIO_MODIFICO", 15)
        .nullable()
        .comment("Numero del documento del ultimo usuario que hizo una modificacion");

      table
        .datetime("ADC_FECHA_MODIFICO")
        .nullable()
        .comment("Fecha y hora de la última modificación");
      table
        .string("ADC_USUARIO_CREO", 15)
        .notNullable()
        .comment("Número del documento del usuario que creó el registro");
      table
        .timestamp("ADC_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creación del registro");

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
