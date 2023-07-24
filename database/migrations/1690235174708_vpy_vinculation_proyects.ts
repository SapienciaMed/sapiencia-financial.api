import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'VPY_VINCULACIONES_PROYECTO'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que almacena los tipos presupuestos");
      table.increments("VPY_CODIGO")
      .primary()
      .comment("Llave primaria");
      table
      .integer("VPY_CODARF_AREA_FUNCIONAL")
      .notNullable()
      .references("ARF_CODIGO")
      .inTable("ARF_AREAS_FUNCIONALES")
      .comment("Codigo de la entidad (FK ARF_AREAS_FUNCIONALES)");
      table
      .string("VPY_CODIGO_PROYECTO",20)
      .notNullable()
      .comment("Codigo del proyecto (Direccion Estrategica)");
      table
      .string("VPY_NOMBRE",200)
      .notNullable()
      .comment("Nombre del Proyecto ");
      table
      .integer("VPY_VALOR_PLANIFICADO")
      .notNullable()
      .comment("Valor planificado desde Direccion Estrategica");
      table
      .integer("VPY_VALOR_PRESUPUESTADO")
      .notNullable()
      .comment("Presupuesto asignado");
      table
      .string("VPY_USUARIO_CREO", 15)
      .notNullable()
      .comment("Número del documento del usuario que creó el registro");
      table
      .timestamp("VPY_FECHA_CREO")
      .notNullable()
      .comment("Fecha y hora de creación del registro");
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
