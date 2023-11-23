import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "PPR_POSICIONES_PRESUPUESTARIAS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que almacena los tipos presupuestos");
      table
        .increments("PPR_CODIGO")
        .primary()
        .comment("Llave primaria");
      table
        .string("PPR_NUMERO", 30)
        .notNullable()
        .comment("Número de la posición presupuestaria");
      table
        .integer("PPR_EJERCICIO")
        .notNullable()
        .comment("Año del ejercicio");
      table
        .integer("PPR_CODECP_ENTIDAD")
        .notNullable()
        .unsigned()
        .references("ECP_CODIGO")
        .inTable("ECP_ENTIDADES_CP")
        .comment("Código de la entidad CP (FK ECP_ENTIDADES_CP)");
      table
        .string("PPR_DENOMINACION", 100)
        .notNullable()
        .comment("Denominación");
      table
        .string("PPR_DESCRIPCION", 500)
        .notNullable()
        .comment("Descripción");
      table
        .string("PPR_USUARIO_MODIFICO", 15)
        .comment(
          "Número del documento del último usuario que hizo una modificación"
        );
      table
        .datetime("PPR_FECHA_MODIFICO")
        .comment("Fecha y hora de la última modificación");
      table
        .string("PPR_USUARIO_CREO", 15)
        .notNullable()
        .comment("Número del documento del usuario que creó el registro");
      table
        .datetime("PPR_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creación del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
