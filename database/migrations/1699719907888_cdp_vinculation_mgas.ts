import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'VCM_VINCULACION_CDP_MGA'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {

      table.comment('Tabla que contiene las vinculaciones MGA a un CDP')
      
      table.increments('VCM_CODIGO').notNullable().comment('llave primaria - autogenerado')
      table.integer('VCM_ACTIVIDAD_MGA').notNullable().comment('Codigo de la actividad MGA')
      table.integer('VCM_ACTIVIDAD_DETALLADA_MGA').notNullable().comment('Codigo de la actividad detallada MGA')
      table.integer('VCM_PORCENTAJE_AFECTACION').notNullable().comment('Porcentaje')      

      table.integer('VCM_CODCDP').notNullable().unsigned().references('CDP_CODIGO').inTable('CDP_CERTIFICADO_DISPONIBILIDAD_PRESUPUESTAL').comment('Codigo del CDP (FK CDP)')
      table.integer('VCM_CODCPC_CLASIFICADOR_PRODUCTOS').notNullable().unsigned().references('CPC_CODIGO').inTable('CPC_CLASIFICACION_CENTRAL_PRODUCTOS').comment('codigo cpc (FK CPC)')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
