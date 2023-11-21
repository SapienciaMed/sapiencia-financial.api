import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'APA_ANUALIZACION_PAC'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment('APA_ANUALIZACION_PAC')
      table.increments('APA_CODIGO').comment('llave primaria - autogenerado')
      //table.integer('APA_CODPAC').unsigned().references('PAC_CODIGO').inTable('PAC_PROGRAMACION_ANUAL_CAJA')/* .comment('Codigo del PAC (FK PAC)') */
      table
      .integer("APA_CODPAC")
      .notNullable()
      .unsigned()
      .references("PAC_CODIGO")
      .inTable("PAC_PROGRAMACION_ANUAL_CAJA")
      .comment("Codigo del PAC (FK PAC)");
      
      table.string('APA_TIPO', 15).nullable().comment('Tipo de anualizacion (Presupuestado / Recaudado)')
      table.float('APA_M1', 15.2).nullable().comment('valor del mes 1')
      table.float('APA_M2', 15.2).nullable().comment('valor del mes 2')
      table.float('APA_M3', 15.2).nullable().comment('valor del mes 3')
      table.float('APA_M4', 15.2).nullable().comment('valor del mes 4')
      table.float('APA_M5', 15.2).nullable().comment('valor del mes 5')
      table.float('APA_M6', 15.2).nullable().comment('valor del mes 6')
      table.float('APA_M7', 15.2).nullable().comment('valor del mes 7')
      table.float('APA_M8', 15.2).nullable().comment('valor del mes 8')
      table.float('APA_M9', 15.2).nullable().comment('valor del mes 9')
      table.float('APA_M10', 15.2).nullable().comment('valor del mes 10')
      table.float('APA_M11', 15.2).nullable().comment('valor del mes 11')
      table.float('APA_M12', 15.2).nullable().comment('valor del mes 12')
      table.string('APA_FECHA_MODIFICO').nullable()
      table.string('APA_FECHA_CREO').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      /* table
        .datetime("APA_FECHA_MODIFICO")
        .nullable()
        .comment("Fecha y hora de la última modificación");
      table
        .datetime("APA_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creación del registro"); */
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
