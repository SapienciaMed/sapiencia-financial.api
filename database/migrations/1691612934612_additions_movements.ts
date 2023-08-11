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
        .string("MAD_CENTRO_GESTOR", 20)
        .notNullable()
        .comment("Código del centro gestor");

      table
        .integer("MAD_CODVPY_PROYECTO")
        .notNullable()
        .unsigned()
        .references("VPY_CODIGO")
        .inTable("VPY_VINCULACIONES_PROYECTO")
        .comment("Código del proyecto (FK VPY_VINCULACIONES_PROYECTO)");

      table
        .integer("MAD_CODFND_FONDO")
        .notNullable()
        .unsigned()
        .references("FND_CODIGO")
        .inTable("FND_FONDOS")
        .comment("Código del fondo (FK FND_FONDOS)");

      table
        .string("MAD_POSICION_PRESUPUESTARIA", 50)
        .notNullable()
        .comment("Codigo de referencia de la posicion presupuestaria (origen / sapiencia )");

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
