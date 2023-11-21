import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'VPY_VINCULACIONES_PROYECTO'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {

      table.comment("Tabla que contiene los proyectos (Vinculaciones)");

      table
        .increments("VPY_CODIGO")
        .primary()
        .comment("Llave primaria");

      table
        .integer("VPY_CODARF_AREA_FUNCIONAL")
        .notNullable()
        .unsigned()
        .references("ARF_CODIGO")
        .inTable("ARF_AREAS_FUNCIONALES")
        .comment("Codigo de la entidad (FK ARF_AREAS_FUNCIONALES)");

      table
        .string("VPY_CODIGO_PROYECTO",20)
        .notNullable()
        .comment("Codigo del proyecto (Direccion Estrategica)");

      table
        .string("VPY_CONCEPTO_PROYECTO",200)
        .notNullable()
        .comment("Nombre / Concepto del proyecto (Direccion Estrategica)");

      table
        .bigInteger("VPY_VALOR_PRESUPUESTADO")
        .notNullable()
        .comment("Valor presupuestado");

      table
        .bigInteger("VPY_VALOR_ASIGNADO")
        .notNullable()
        .comment("Valor asignado");

      table
        .boolean("VPY_VINCULADO")
        .notNullable()
        .comment("Indicador de que si la vinculacion esta vigente o no");

      table
        .string("VPY_TIPO",10)
        .notNullable()
        .comment("Indicador de que si la vinculacion esta vigente o no");

      table
        .integer("VPY_CODPFU_PROYECTO_FUNCIONAMIENTO")
        .nullable()
        .comment("Código PK del proyecto de funcionamiento si aplica");

      table
        .integer("VPY_CODINV_PROYECTO_INVERSION")
        .nullable()
        .comment("Código PK del proyecto de inversión si aplica (Ref Planeación)");

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
