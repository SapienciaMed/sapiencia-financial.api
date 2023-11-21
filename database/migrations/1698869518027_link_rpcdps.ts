import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'VRP_VINCULACION_RPR_ICD'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment('Tabla que contiene la vinculación del CDP al RP')
      table.increments('VRP_CODIGO').notNullable().comment('llave primaria - autogenerado')
      table.integer('VRP_CODRPR_REGISTRO_PRESUPUESTAL').notNullable().unsigned().references('RPR_CODIGO').inTable('RPR_REGISTRO_PRESUPUESTAL').comment('Codigo registro presupuestal (FK RPR)')
      table.integer('VRP_CODICD_IMPORTES_CDP').notNullable().unsigned().references('ICD_CODIGO').inTable('ICD_IMPORTES_CDP').comment('Codigo del importe de la ruta del cdp (FK ICD)')
      table.float('VRP_VALOR_INICIAL',20.2).nullable().comment('Valor inicial del cdp asociado')
      table.float('VRP_VALOR_MOD_CREDITO').nullable().comment('Valor modificado credito del cdp asociado')
      table.float('VRP_VALOR_MOD_CONTRACREDITO').nullable().comment('Valor modificado contracredito del cdp asociado')
      table.float('VRP_VALOR_FIJADO_CONCLUIDO').nullable().comment('Valor fijado concluido del cdp asociado')
      table.float('VRP_VALOR_FINAL',20.2).nullable().comment('Valor final del cdp asociado')
      table.boolean('VRP_ACTIVO').defaultTo(true).notNullable().comment('Estado de anulación de la vinculación del CDP')
      table.string('VRP_MOTIVO_ANULACION',500).nullable().comment('Motivo de la anulación')
      table.integer('VRP_POSICION').nullable().comment('Posicion')
      table.string('VRP_OBSERVACION',500).nullable().comment('Observacion de la vinculacion del RP')
      
      
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
