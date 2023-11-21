import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'CRP_COMPONENTES_REGISTRO_PRESUPUESTAL'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment('Tabla que contiene la lista de componentes')
      table.increments('CRP_CODIGO').comment('llave primaria - autogenerado')
      table.string('CRP_NOMBRE',100).notNullable().comment('Nombre del componente')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
