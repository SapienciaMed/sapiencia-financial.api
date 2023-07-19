import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "PPS_POSICIONES_PRESUPUESTARIAS_SAPIENCIA";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que almacena los tipos presupuestos");
      table.increments("PPS_CODIGO").primary().comment("Llave primaria");
      table
        .string("PPS_CODIGO_REFERENCIA", 20)
        .notNullable()
        .comment("Codigo de referencia ingresado");
      table
        .integer("PPS_CODPPR_POSICION_PRESUPUESTAL")
        .notNullable()
        .unsigned()
        .comment(
          "Codigo de la posion presupuestal (FK PPR_POSICIONES_PRESUPUESTARIAS)"
        );
      table.integer("PPS_EJERCICIO").notNullable().comment("Año del ejercicio");
      table.string("PPS_DESCRIPCION", 500).notNullable().comment("Descripcion");
      table
        .integer("PPS_CONSECUTIVO")
        .notNullable()
        .comment("Numero consecutivo");
      table
        .string("PPS_ASIGNADO_A", 20)
        .notNullable()
        .comment("Codigo donde se Asignara");
      table
        .string("PPS_USUARIO_MODIFICO", 15)
        .comment(
          "Número del documento del último usuario que hizo una modificación"
        );
      table
        .timestamp("PPS_FECHA_MODIFICO")
        .comment("Fecha y hora de la última modificación");
      table
        .string("PPS_USUARIO_CREO", 15)
        .notNullable()
        .comment("Número del documento del usuario que creó el registro");
      table
        .timestamp("PPS_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creación del registro");

      // Llaves foraneas
      table
        .foreign("PPS_CODPPR_POSICION_PRESUPUESTAL", "FK_CODPPS_CODPPR")
        .references("PPR_CODIGO")
        .inTable("PPR_POSICIONES_PRESUPUESTARIAS");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
