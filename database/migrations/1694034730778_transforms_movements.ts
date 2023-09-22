import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {

  protected tableName = 'MTR_MOVIMIENTOS_TRASLADOS'

  public async up () {

    this.schema.createTable(this.tableName, (table) => {

      table.comment(
        "Tabla que almancena los movimientos del traslado."
      );

      table
        .increments("MTR_CODIGO")
        .primary()
        .comment("Llave primaria - autogenerado");

      table
        .integer("MTR_CODTRA_TRASLADO")
        .notNullable()
        .unsigned()
        .references("TRA_CODIGO")
        .inTable("TRA_TRASLADOS")
        .comment("Código del traslado (FK TRA_TRASLADOS)");

      table
        .string("MTR_TIPO", 15)
        .notNullable()
        .comment("Tipo de movimiento (Origen / Destino)");

      table
        .integer("MTR_CODRPP_RUTA_PRESUPUESTAL")
        .notNullable()
        .unsigned()
        .references("RPP_CODIGO")
        .inTable("RPP_RUTAS_PRESUPUESTALES")
        .comment("Codigo de la ruta presupuestal (FK RPP)");

      table
        .decimal("MTR_VALOR", 20,2)
        .notNullable()
        .comment("Valor - (Crédito o Contra Crédito segun el Tipo)");

    })

  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
