import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ICD_IMPORTES_CDP'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('ICD_CODIGO').primary()
      // table.integer('ICD_CODCDP').unsigned().notNullable()
      table.integer('ICD_CODCDP').unsigned().references('CDP_CODIGO').inTable('CDP_CERTIFICADO_DISPONIBILIDAD_PRESUPUESTAL')
      // table.integer('ICD_CODRPP_RUTA_PRESUPUESTAL').unsigned().notNullable()
      table.integer('ICD_CODRPP_RUTA_PRESUPUESTAL').unsigned().references('RPP_CODIGO').inTable('RPP_RUTAS_PRESUPUESTALES')
      table.integer('ICD_POSICION').notNullable()
      table.decimal('ICD_VALOR', 15, 2).notNullable()

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
