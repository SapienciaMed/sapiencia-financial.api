import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'MAD_MOVIMIENTOS_ADICION'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {

      table.comment(
        "Tabla que almancena los movimientos de la adicion"
      );

      table.increments("MAD_CODIGO").primary().comment("Llave primaria - autogenerado");

      table
        .integer("MAD_CODADC_ADICION")
        .notNullable()
        .unsigned()
        .references("ADC_CODIGO")
        .inTable("ADC_ADICIONES")
        .comment("Código de la adición (FK ADC_ADICIONES)");

      table
        .string("MAD_TIPO", 15)
        .notNullable()
        .comment("Tipo de movimiento (Ingreso / Gasto)");

      table
        .integer("MAD_CODRPP_RUTA_PRESUPUESTAL")
        .notNullable()
        .unsigned()
        .references("RPP_CODIGO")
        .inTable("RPP_RUTAS_PRESUPUESTALES")
        .comment("Codigo de la ruta presupuestal (FK RPP)");

      table
        .decimal("MAD_VALOR", 20,2)
        .notNullable()
        .comment("Valor del movimiento");

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
