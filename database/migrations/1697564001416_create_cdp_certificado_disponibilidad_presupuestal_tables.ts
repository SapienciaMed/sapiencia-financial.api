import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'CDP_CERTIFICADO_DISPONIBILIDAD_PRESUPUESTAL'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('CDP_CODIGO').primary()
      table.string('CDP_EJERCICIO',50).notNullable();
      table.date('CDP_FECHA').notNullable()
      table.string('CDP_OBJETO_CONTRACTUAL', 5000).notNullable()
      table.integer('CDP_CONSECUTIVO').notNullable()
      table.integer('CDP_CONSECUTIVO_SAP').unique().nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}