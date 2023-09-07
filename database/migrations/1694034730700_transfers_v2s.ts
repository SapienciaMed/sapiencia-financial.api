import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {

  protected tableName = 'TRA_TRASLADOS'

  public async up () {

    this.schema.createTable(this.tableName, (table) => {
      table
        .comment("Tabla que almacena las acciones de los traslados");
      table
        .increments("TRA_CODIGO")
        .primary()
        .comment("Llave primaria");
      table
        .integer("TRA_CODTTR_TIPO_TRASLADO")
        .notNullable()
        .unsigned()
        .references("TTR_CODIGO")
        .inTable("TTR_TIPOS_TRASLADOS")
        .comment("Codigo tipo traslado (FK TTR_TIPOS_TRASLADOS)");
      table
        .string("TRA_ACTO_ADMINISTRATIVO_DISTRITO",200)
        .notNullable()
        .comment("Numero del acto acto administrativo de distrito ");
      table
        .string("TRA_ACTO_ADMINISTRATIVO_SAPIENCIA",200)
        .notNullable()
        .comment("Numero del acto acto administrativo de sapiencia");
      table
        .decimal("TRA_VALOR", 20,2)
        .notNullable()
        .comment("Valor del traslado ");
      table
        .string("TRA_OBSERVACIONES",400)
        .notNullable()
        .comment("Observaciones adicionales del traslado");
      table
        .string("TRA_USUARIO_MODIFICO", 15)
        .nullable()
        .comment("Numero del documento del ultimo usuario que hizo una modificacion");
      table
        .datetime("TRA_FECHA_MODIFICO")
        .nullable()
        .comment("Fecha y hora de la última modificación");
      table
        .string("TRA_USUARIO_CREO", 15)
        .notNullable()
        .comment("Número del documento del usuario que creó el registro");
      table
        .timestamp("TRA_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creación del registro");
    })

  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
