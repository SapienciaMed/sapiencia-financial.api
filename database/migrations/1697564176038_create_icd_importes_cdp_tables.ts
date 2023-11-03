import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ICD_IMPORTES_CDP'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('ICD_CODIGO').primary()
      table.integer('ICD_CODCDP').unsigned().references('CDP_CODIGO').inTable('CDP_CERTIFICADO_DISPONIBILIDAD_PRESUPUESTAL')
      table.integer('ICD_CODRPP_RUTA_PRESUPUESTAL').unsigned().references('RPP_CODIGO').inTable('RPP_RUTAS_PRESUPUESTALES')
      table.integer('ICD_POSICION').notNullable()
      table.decimal('ICD_VALOR', 15, 2).notNullable()
      table.boolean('ICD_ACTIVO').defaultTo(true)
      table.string('ICD_MOTIVO_ANULACION',500).nullable()
      table.decimal('IDC_MODIFICADO_CONTRACREDITO', 15, 2).nullable()
      table.decimal('IDC_MOFICICADO_CREDITO ', 15, 2).nullable()
      table.decimal('IDC_FIJADO_CONCLUIDO', 15, 2).nullable()
      table.decimal('IDC_VALOR_FINAL', 15, 2).nullable()

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
