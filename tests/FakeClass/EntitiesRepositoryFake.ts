import { IEntities } from "App/Interfaces/EntitiesInterfaces";
import { IEntitiesRepository } from "App/Repositories/EntitiesRepository";

const entitiesFake: IEntities[] = [
  {
    id: 1,
    name: "Testing1"
  },
  {
    id: 2,
    name: "Testing2"
  }
];

export class EntitiesRepositoryFake implements IEntitiesRepository {

  getEntities(): Promise<IEntities[]> {
    return new Promise((res) => {
      res(entitiesFake);
    });
  }
}
