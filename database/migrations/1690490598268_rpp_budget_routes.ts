import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'RPP_RUTAS_PRESUPUESTALES'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que contiene las rutas prosupuestales");
      table.increments("RPP_CODIGO")
      .primary()
      .comment("Llave primaria");
      table
      .integer("RPP_CODVPY_PROYECTO")
      .notNullable()
      .references("VPY_CODIGO")
      .inTable("VPY_VINCULACIONES_PROYECTO")
      .comment("Codigo del Proyecto Vinculado (FK VPY_VINCULACIONES_PROYECTO)");
      table
      .string("RPP_CENTRO_GESTOR",20)
      .notNullable()
      .comment("Numero del centro gestor");
      table
      .string("RPP_DIV",20)
      .notNullable()
      .comment("Codigo identificador div");
      table
      .integer("RPP_CODPPR_POSPRE")
      .notNullable()
      .references("PPR_CODIGO")
      .inTable("PPR_POSICIONES_PRESUPUESTARIAS")
      .comment("Codigo de pospre (FK PPR_POSICIONES_PRESUPUESTARIAS)");
      table
      .integer("RPP_CODPPS_POSPRE_SAPIENCIA")
      .notNullable()
      .references("PPS_CODIGO")
      .inTable("PPS_POSICIONES_PRESUPUESTARIAS_SAPIENCIA")
      .comment("Codigo de pospre (FK PPR_POSICIONES_PRESUPUESTARIAS)");
      table
      .integer("RPP_CODFND_FONDO")
      .notNullable()
      .references("FND_CODIGO")
      .inTable("FND_FONDOS")
      .comment("Codigo del fondo (FK FND_FONDOS)");
      table
      .string("RPP_USUARIO_MODIFICO",15)
      .notNullable()
      .comment("Numero del documento del ultimo usuario que hizo una modificacion");
      table
      .timestamp("RPP_FECHA_MODIFICO")
      .notNullable()
      .comment("Fecha y hora de la ultima modificacion");
      table
      .string("RPP_USUARIO_CREO", 15)
      .notNullable()
      .comment("Número del documento del usuario que creó el registro");
      table
      .timestamp("RPP_FECHA_CREO")
      .notNullable()
      .comment("Fecha y hora de creación del registro");
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
