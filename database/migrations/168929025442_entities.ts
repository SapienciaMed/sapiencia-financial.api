import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ECP_ENTIDADES_CP'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que almacena las entidades de los fondos");
      table.increments("ECP_CODIGO")
      .primary()
      .comment("Llave primaria");
      table
      .string("ECP_NOMBRE", 100)
      .notNullable()
      .comment("Nombre de entidad CP");
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
