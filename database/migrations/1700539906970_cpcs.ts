import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "CPC_CLASIFICACION_CENTRAL_PRODUCTOS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que almacena los CPCs");
      table
        .increments("CPC_CODIGO")
        .primary()
        .comment("Llave primaria");
      table
        .string("CPC_NUMERO", 30)
        .notNullable()
        .comment("Número deL CPC");
      table
        .string("CPC_DESCRIPCION", 500)
        .notNullable()
        .comment("Descripción");
      table
        .integer("CPC_CODPPR_POSPRE")
        .notNullable()
        .unsigned()
        .references("PPR_CODIGO")
        .inTable("PPR_POSICIONES_PRESUPUESTARIAS")
        .comment("Código del POSPRE");
      table
        .string("CPC_USUARIO_MODIFICO", 15)
        .comment(
          "Número del documento del último usuario que hizo una modificación"
        );
      table
        .datetime("CPC_FECHA_MODIFICO")
        .comment("Fecha y hora de la última modificación");
      table
        .string("CPC_USUARIO_CREO", 15)
        .notNullable()
        .comment("Número del documento del usuario que creó el registro");
      table
        .datetime("CPC_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creación del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
