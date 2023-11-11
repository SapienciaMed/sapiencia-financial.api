import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'CDP_VINCULACION_MGA'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {

      table.comment('Tabla que contiene las vinculaciones MGA a un CDP')
      
      table.increments('CDP_CODIGO').notNullable().comment('llave primaria - autogenerado')
      table.integer('CDP_ACTIVIDAD_MGA').notNullable().comment('Codigo de la actividad MGA')
      table.integer('CDP_ACTIVIDAD_DETALLADA_MGA').notNullable().comment('Codigo de la actividad detallada MGA')
      table.integer('CDP_PORCENTAJE_AFECTACION').notNullable().comment('Porcentaje')      

      table.integer('CDP_CODCDP').notNullable().unsigned().references('CDP_CODIGO').inTable('CDP_CERTIFICADO_DISPONIBILIDAD_PRESUPUESTAL').comment('Codigo del CDP (FK CDP)')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
