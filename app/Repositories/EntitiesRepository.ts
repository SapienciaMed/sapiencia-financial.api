import { IEntities } from "App/Interfaces/EntitiesInterfaces";
import Entities from "../Models/Entities";

export interface IEntitiesRepository {
  getEntities(): Promise<IEntities[]>;
}

export default class EntitiesRepository implements IEntitiesRepository {
  constructor() {}

  async getEntities(): Promise<IEntities[]> {
    const res = await Entities.query();

    return res.map((i) => i.serialize() as IEntities);
  }
}
