import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'MGA_ACTIVDADES_DETALLADAS_MGA'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que contine el detalle de los MGA cargados desde SAP");
      table.increments("MGA_CODIGO")
      .primary()
      .comment("Llave primaria");
      table
      .string("MGA_DESCRIPCION",200)
      .notNullable()
      .comment("Descripcion del MGA");
      table
      .string("MGA_UNIDAD_MEDIDA",100)
      .notNullable()
      .comment("Unidad de medida");
      table
      .integer("MGA_CANTIDAD")
      .notNullable()
      .comment("Cantidad");
      table
      .integer("MGA_COSTO")
      .notNullable()
      .comment("Costo");
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
