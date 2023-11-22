import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'PAC_PROGRAMACION_ANUAL_CAJA'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment('Tabla que almacena las promaciones de caja')
      table.increments('PAC_CODIGO').notNullable().comment('llave primaria - autogenerado')
      table.string('PAC_TIPO_RECURSO', 15).notNullable().comment('Tipo de Recurso (Propio / Distrital)')
      table
        .integer("PAC_CODRPP_RUTA_PRESUPUESTAL")
        .notNullable()
        .unsigned()
        .references("RPP_CODIGO")
        .inTable("RPP_RUTAS_PRESUPUESTALES")
        .comment("Codigo de la ruta presupuestal (FK RPP)");

      table.integer('PAC_VERSION').notNullable().comment('Numero de la version cargada')
      table.integer('PAC_VIGENCIA').notNullable().comment('Año de vigencia del PAC')
      table.boolean('PAC_ACTIVO').defaultTo(true).notNullable().comment('Version vigente del presupupuesto')


      table
        .string("PAC_USUARIO_CREO", 15)
        .notNullable()
        .comment("Número del documento del usuario que creó el registro");

      table
        .string("PAC_USUARIO_MODIFICO", 15)
        .nullable()
        .comment("Numero del documento del ultimo usuario que hizo una modificacion");


      /* table
        .datetime("PAC_FECHA_MODIFICO")
        .nullable()
        .comment("Fecha y hora de la última modificación");
      table
        .datetime("PAC_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creación del registro");
 */
      table.string('PAC_FECHA_MODIFICO').nullable()
      table.string('PAC_FECHA_CREO').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
