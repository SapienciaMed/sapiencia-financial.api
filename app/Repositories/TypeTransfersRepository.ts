import { ITypeTransfers } from "App/Interfaces/TypesTranfersInterfaces";
import TypeTransfers from "../Models/TypesTransfers";

export interface ITypeTransfersRepository {
  getTypeTransfers(): Promise<ITypeTransfers[]>;
}

export default class TypeTransfersRepository implements ITypeTransfersRepository {
  constructor() {}

  async getTypeTransfers(): Promise<ITypeTransfers[]> {
    const res = await TypeTransfers.query();

    return res.map((i) => i.serialize() as ITypeTransfers);
  }
}
