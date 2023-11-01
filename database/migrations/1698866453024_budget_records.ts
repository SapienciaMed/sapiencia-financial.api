import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'RPP_REGISTRO_PRESUPUESTAL'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment('Tabla que contiene el registro presupuestal')
      table.increments('RPP_CODIGO').comment('llave primaria - autogenerado')
      table.integer('RPP_CODIGO_RP').nullable().comment('Codigo consecutivo del RP')
      table.string('RPP_TIPO_CONTRATISTAS').notNullable().comment('Identifica si es un contratista empresa ó persona natural')
      table.integer('RPP_CODIGO_CONTRATISTA').notNullable().comment('Codigo del contratista')
      table.date('RPP_FECHA_DOCUMENTO').notNullable().comment('Fecha de documento RP')
      table.date('RPP_FECHA_VALIDEZ').notNullable().comment('Fecha de validez del registro presupuestal')
      table.integer('RPP_CODIGO_DEPENDENCIA').notNullable().comment('Codigo de la dependencia')
      table.string('RPP_OBJETO_CONTRACTUAL').notNullable().comment('Descripción del acuerdo contractual')
      table.integer('RPP_CODIGO_COMPONENTE').unsigned().references('RPC_CODIGO').inTable('RPC_COMPONENTE').notNullable().comment('Codigo componente responsable')
      table.string('RPP_USUARIO_MODIFICO').nullable().comment('Numero del documento del ultimo usuario que hizo una modificacion')
      table.string('RPP_USUARIO_CREO').nullable().comment('Numero del documento del usuario que creo el registro')
      
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('RPP_FECHA_CREO', { useTz: true }).comment('Fecha y hora de creacion del registro')
      table.timestamp('RPP_FECHA_MODIFICO', { useTz: true }).comment('Fecha y hora de la ultima modificacion')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
