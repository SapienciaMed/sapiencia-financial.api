import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'FND_FONDOS'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que contiene los fondos que se pueden asignar a usuarios del sistema");
      table.increments("FND_CODIGO").primary().comment("Llave primaria");
      table
      .integer("FND_CODECP_ENTIDAD")
      .notNullable()
      .references("ECP_CODIGO")
      .inTable("ECP_ENTIDADES_CP")
      .comment("Codigo de la entidad CP(FK ECP_ENTIDADES_CP)");
      table
      .integer("FND_NUMERO")
      .notNullable()
      .comment("Numero del fondo");
      table
      .string("FND_DENOMINACION", 100)
      .notNullable()
      .comment("Denominación");
      table
      .string("FND_DESCRIPCION", 500)
      .notNullable()
      .comment("Descripción");
      table
      .timestamp("FND_VIGENTE_DESDE")
      .notNullable()
      .comment("Fecha de inicio de la vigencia");
      table
      .timestamp("FND_VIGENTE_HASTA")
      .notNullable()
      .comment("Fecha de finalizacion de la vigencia");
      table
      .string("FND_USUARIO_MODIFICO", 15)
      .nullable()
      .comment("Número del documento del último usuario que hizo una modificación");
      table
      .datetime("FND_FECHA_MODIFICO")
      .nullable()
      .comment("Fecha y hora de la última modificación");
      table
      .string("FND_USUARIO_CREO", 15)
      .notNullable()
      .comment("Número del documento del usuario que creó el registro");
      table
      .datetime("FND_FECHA_CREO")
      .notNullable()
      .comment("Fecha y hora de creación del registro");
    })
  }
  public async down () {
    this.schema.dropTable(this.tableName)
  }
}