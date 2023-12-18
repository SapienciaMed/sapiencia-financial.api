import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Component from "App/Models/Component";

export default class extends BaseSeeder {
  public async run() {
    await Component.createMany([
        { id:1, name:'Comunicaciones' },
        { id:2, name:'Gastos de personal' },
        { id:3, name:'Misional' },
        { id:4, name:'Soporte logístico y administrativo' },
    ])

  }

}