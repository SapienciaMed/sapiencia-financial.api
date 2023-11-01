import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'RPC_COMPONENTE'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment('Tabla que contiene la lista de componentes')
      table.increments('RPC_CODIGO').comment('llave primaria - autogenerado')
      table.string('RPC_NOMBRE').notNullable().comment('Nombre del componente')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
