import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CreatePagosTable extends BaseSchema {
  protected tableName = 'PAG_PAGOS';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment('Tabla que contiene el registro de los pagos efectuados al CDP');

      table.increments('PAG_CODIGO').primary().comment('Llave primaria - autogenerado');
      table
        .integer('PAG_CODVRP_VINCULACION_RP')
        .notNullable()
        .unsigned()
        .references('VRP_CODIGO')
        .inTable('VRP_VINCULACION_RPR_ICD')
        .comment('Codigo del importe de la ruta del cdp (FK VRP)');

      table.decimal('PAG_VALOR_CAUSADO', 15, 2).notNullable().comment('Valor Causado');
      table.decimal('PAG_VALOR_PAGADO', 15, 2).notNullable().comment('Valor pagado');

      table.string('PAG_USUARIO_CREO', 15).notNullable().comment('Numero del documento del usuario que creo el registro');
      table.timestamp('PAG_FECHA_CREO').notNullable().comment('Fecha y hora de creacion del registro');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
