import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'PFU_PROYECTOS_FUNCIONAMIENTO'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table
        .comment("Tabla que almacena los proyectos de funcionamiento gestionados en presupuestos");

      table
        .increments("PFU_CODIGO")
        .primary()
        .comment("Llave primaria");

      table
        .integer("PFU_CODECP_ENTIDAD")
        .notNullable()
        .unsigned()
        .references("ECP_CODIGO")
        .inTable("ECP_ENTIDADES_CP")
        .comment("Codigo de la entidad CP(FK ECP_ENTIDADES_CP)");

      table
        .string("PFU_NUMERO",20)
        .notNullable()
        .comment("Numero del proyecto de funcionamiento");

      table
        .string("PFU_NOMBRE",200)
        .notNullable()
        .comment("Nombre del proyecto de funcionamiento");

      table
        .boolean("PFU_ACTIVO")
        .notNullable()
        .comment("Indicador de que si el proyecto esta activo o no");

      table
        .integer("PFU_EJERCICIO")
        .unique()
        .notNullable()
        .comment("Año de ejercicio del proyecto");

      table
        .string("PFU_VALIDEZ_DESDE")
        .nullable()
        .comment("Fecha de inicio de la validez");

      table
        .string("PFU_VALIDEZ_HASTA")
        .nullable()
        .comment("Fecha de finalizacion de la validez");

      table
        .decimal("PFU_VALOR_PRESUPUESTADO", 20,2)
        .nullable()
        .comment("Valor Presupuestado");

      table
        .decimal("PFU_VALOR_ASIGNADO", 20,2)
        .nullable()
        .comment("Valor Asignado");

      table
        .string("PFU_USUARIO_MODIFICO", 15)
        .nullable()
        .comment("Numero del documento del ultimo usuario que hizo una modificacion");

      table
        .string("PFU_FECHA_MODIFICO")
        .nullable()
        .comment("Fecha y hora de la última modificación");

      table
        .string("PFU_USUARIO_CREO", 15)
        .notNullable()
        .comment("Número del documento del usuario que creó el registro");
      
        table
        .string("PFU_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creación del registro");
       
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
