import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "VMG_VINCULACIONES_MGA";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que asocia las actividades MGA con la posicion presupuestaria origen"
      );
      table
        .increments("VMG_CODIGO")
        .primary()
        .comment("Llave primaria");
      table
        .integer("VMG_CODPPR_POSICION_PRESUPUESTAL")
        .notNullable()
        .unsigned()
        .references("PPR_CODIGO")
        .inTable("PPR_POSICIONES_PRESUPUESTARIAS")
        .comment("Codigo de la posion presupuestal (FK PPR_POSICIONES_PRESUPUESTARIAS)");
      table
        .integer("VMG_CODIGO_ACTIVIDAD")
        .notNullable()
        .comment("Código General de la Actividad (PK Planeación - Tabla Actividades)");
      table
        .string("VMG_CONSECUTIVO_ACTIVIDAD_DETALLADA",30)
        .notNullable()
        .comment("Consecutivo Actividad Detallada (Consecutivo - Tabla Actividades Detalladas)");
      table
        .integer("VMG_CODIGO_ACTIVIDAD_DETALLADA")
        .notNullable()
        .comment("Código General Actividad Detallada  (PK Planeación - Tabla Actividades Detalladas)");
      table
        .string("VMG_USUARIO_CREO", 15)
        .notNullable()
        .comment("Numero del documento del usuario que creo el registro");
      table
        .datetime("VMG_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creación del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
