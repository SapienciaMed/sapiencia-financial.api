import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ARF_AREAS_FUNCIONALES'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que contiene las areas funcionales");
      table.increments("ARF_CODIGO")
      .primary()
      .comment("Llave primaria");
      table
      .string("ARF_CODIGO_REFERENCIA",20)
      .notNullable()
      .comment("Codigo de referencia unico ingresado por el usuario");
      table
      .string("ARF_DENOMINACION",100)
      .notNullable()
      .comment("Denominacion");
      table
      .string("ARF_DESCRIPCION",500)
      .notNullable()
      .comment("Descripcion");
      table
      .string("ARF_USUARIO_CREO", 15)
      .notNullable()
      .comment("Número del documento del usuario que creó el registro");
      table
      .datetime("ARF_FECHA_CREO")
      .notNullable()
      .comment("Fecha y hora de creación del registro");
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

