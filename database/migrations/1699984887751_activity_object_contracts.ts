import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'AOC_ACTIVIDAD_OBJETO_CONTRACTUAL'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment('Contiene un lista de actividades de objeto contractual')
      table.increments('AOC_CODIGO').comment('Llave primaria')
      table.string('AOC_DESCRIPCION').comment('Descripción de la actividad')
      table.boolean('AOC_ESTADO').defaultTo('true').comment('Identifica si se encuentra activa la actividad')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
