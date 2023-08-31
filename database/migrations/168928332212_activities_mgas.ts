import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'MGA_ACTIVDADES_DETALLADAS_MGA'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {

      table.comment("Tabla que contine el detalle de los MGA cargados desde SAP");

      table
      .increments("MGA_CODIGO")
      .primary()
      .comment("Llave primaria");
      table
      .string("MGA_CODIGO_PRODUCTO",50)
      .notNullable()
      .comment("Código MGA del producto");
      table
      .string("MGA_NOMBRE_PRODUCTO",200)
      .notNullable()
      .comment("Nombre MGA del producto");
      table
      .string("MGA_DESCRIPCION",500)
      .notNullable()
      .comment("Descripcion del MGA");
      table
      .string("MGA_UNIDAD_MEDIDA",100)
      .notNullable()
      .comment("Unidad de medida");
      table
      .integer("MGA_COSTO_UNITARIO")
      .notNullable()
      .comment("Costo unitario MGA del producto");
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
