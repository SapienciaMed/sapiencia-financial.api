import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'RPR_REGISTRO_PRESUPUESTAL'
  
  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment('Tabla que contiene el registro presupuestal')
      table.increments('RPR_CODIGO').notNullable().comment('llave primaria - autogenerado')
      table.string('RPR_TIPO_PROVEEDOR',15).notNullable().comment('Identifica si es un Contratista o Acreedor (Listado Generico)')
      table.integer('RPR_CODACR_ACREEDOR').nullable().unsigned().references('ACR_CODIGO').inTable('ACR_ACREEDORES').comment('Codigo del Acreedor (FK ACR)')
      table.string('RPR_DOCUMENTO_CONTRATISTA',20).notNullable().comment('Numero de documento del contratista  (db Nomina)')
      table.date('RPR_FECHA_DOCUMENTO').notNullable().comment('Fecha de documento RP')
      table.date('RPR_FECHA_VALIDEZ').notNullable().comment('Fecha de validez del registro presupuestal')
      table.integer('RPR_CODIGO_DEPENDENCIA').notNullable().comment('Codigo de la dependencia (db Nomina)')
      table.string('RPR_OBJETO_CONTRACTUAL').notNullable().comment('Descripción del acuerdo contractual')
      table.integer('RPR_CODCRP_COMPONENTE').notNullable().unsigned().references('CRP_CODIGO').inTable('CRP_COMPONENTES_REGISTRO_PRESUPUESTAL').comment('codigo Componente (FK CRP)')
      table.integer('RPR_CONSECUTIVO_SAP').unique().nullable().comment("Numero consecutivo SAP")
      table.string('RPR_NUMERO_CONTRATO').nullable().comment("Numero contrato del proveedor")
      table.string('RPR_DOCUMENTO_RESPONSABLE').nullable().comment("Documento del lider responsable")
      table.string('RPR_DOCUMENTO_SUPERVISOR').nullable().comment("Documento del supervisor asignado")
      table.string('RPR_USUARIO_MODIFICO').nullable().comment('Numero del documento del ultimo usuario que hizo una modificacion')
      table.string('RPR_USUARIO_CREO').nullable().comment('Numero del documento del usuario que creo el registro')
      
      table
        .timestamp("RPR_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creación del registro");
        
        table
        .string("RPR_FECHA_MODIFICO")
        .comment("Fecha y hora de la última modificación");
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
