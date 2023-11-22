import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ACR_ACREEDORES'
  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment('Tabla que contine los acreedores que no son contratistas en nomina')
      table.increments('ACR_CODIGO').comment('llave primaria - autogenerado')
      table.string('ACR_TIPO_DOCUMENTO',4).notNullable().comment('codigo del tipo de documento (Listados Generico)')
      table.string('ACR_NUMERO_DOCUMENTO',20).notNullable().unique().comment('numero del documento')
      table.string('ACR_IDENTIFICACION_FISCAL',20).notNullable().comment('Numero de identificacion fiscal')
      table.string('ACR_NOMBRE',200).notNullable().comment('Nombre / Razon social')
      table.string('ACR_CIUDAD',50).notNullable().comment('nombre de la ciudad')
      table.string('ACR_DIRECCION',50).notNullable().comment('direccion')
      table.integer('ACR_TELEFONO').notNullable().comment('numero de telefono')
      table.string('ACR_CORREO_ELECTRONICO',50).notNullable().comment('Correo electronico')
      table.string('ACR_USUARIO_MODIFICO',15).nullable().comment('Numero del documento del ultimo usuario que hizo una modificacion')
      table.string('ACR_USUARIO_CREO',15).nullable().comment('Numero del documento del usuario que creo el registro')
      table
        .datetime("ACR_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creación del registro");
        
        table
        .string("ACR_FECHA_MODIFICO")
        .comment("Fecha y hora de la última modificación");
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
