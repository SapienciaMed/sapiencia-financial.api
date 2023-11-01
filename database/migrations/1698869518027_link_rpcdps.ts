import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'VRP_VINCULACION_RP_CDP'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment('Tabla que contiene la vinculación del CDP al RP')
      table.increments('VRP_CODIGO').comment('llave primaria - autogenerado')
      table.integer('VRP_CODIGO_RP').unsigned().references('RPP_CODIGO').inTable('RPP_REGISTRO_PRESUPUESTAL').notNullable().comment('Codigo del RP asociado')
      table.integer('VRP_CONSECUTIVO_AURORA').notNullable().comment('Codigo consecutivo aurora')
      table.integer('VRP_CONSECUTIVO_SAP').nullable().comment('Codigo consecutivo del sistema SAP')
      table.integer('VRP_CODRPP_RUTA_PRESUPUESTAL').unsigned().references('RPP_CODIGO').inTable('RPP_RUTAS_PRESUPUESTALES').comment('Codigo de la ruta presupuestal')
      table.integer('VRP_VALOR_INICIAL').comment('Valor inicial del cdp asociado')
      table.boolean('VRP_ACTIVO').defaultTo(true).notNullable().comment('Estado de anulación de la vinculación del CDP')
      table.string('VRP_MOTIVO_ANULACION').comment('Motivo de la anulación')
      table.string('VRP_USUARIO_CREO').nullable().comment('Numero del documento del usuario que creo el registro')
      table.string('VRP_USUARIO_MODIFICO').nullable().comment('Fecha y hora de la ultima modificacion')
    
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('VRP_FECHA_CREO', { useTz: true }).comment('Fecha y hora de creacion del registro')
      table.timestamp('VRP_FECHA_MODIFICO', { useTz: true }).nullable().comment('Numero del documento del ultimo usuario que hizo una modificacion')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
