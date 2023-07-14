import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'VMG_VINCULACIONES_MGA'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
        table.comment("Tabla que asocia las actividades MGA con la posicion presupuestaria origen");
        table.increments("VMG_CODIGO")
        .primary()
        .comment("Llave primaria");
        table
        .integer("VMG_CODPPR_POSICION_PRESUPUESTAL")
        .notNullable()
        .references("PPR_CODIGO")
        .inTable("PPR_POSICIONES_PRESUPUESTARIAS")
        .comment("Codigo de la posion presupuestal (FK PPR_POSICIONES_PRESUPUESTARIAS)");
        table
        .integer("VMG_CODMGA_METODOLOGIA_GENERAL")
        .notNullable()
        .references("MGA_CODIGO")
        .inTable("MGA_ACTIVDADES_DETALLADAS_MGA")
        .comment("Codigo de la metodologia ajustada (FK MGA_ACTIVDAD_DETALLADA_MGA)");
        table
        .integer("VMG_USUARIO_CREO",15)
        .notNullable()
        .comment("Numero del documento del usuario que creo el registro");
        table
        .timestamp("VMG_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creación del registro");
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
