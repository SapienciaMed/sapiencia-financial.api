import { IFunds } from "App/Interfaces/FundsInterfaces";
import { IFundsRepository } from "App/Repositories/FundsRepository";

export class FundsRepositoryFake implements IFundsRepository {
  getFundsById(_id: number): Promise<IFunds | null> {
    return new Promise((res) => {
      res(null);
    });
  }
}
