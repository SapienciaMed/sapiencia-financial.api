import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {

  protected tableName = 'TTR_TIPOS_TRASLADOS'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que contiene los tipo de traslados");
      table.increments("TTR_CODIGO")
      .primary()
      .comment("Llave primaria");
      table
      .string("TTR_NOMBRE",200)
      .notNullable()
      .comment("Nombre del tipo de traslado");
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
