import { IFunds } from "App/Interfaces/FundsInterfaces";
import Funds from "../Models/Funds";

export interface IFundsRepository {
  getFundsById(id: number): Promise<IFunds | null>;
}

export default class FundsRepository implements IFundsRepository {
  constructor() {}

  async getFundsById(id: number): Promise<IFunds | null> {
    const res = await Funds.find(id);
    return res ? (res.serialize() as IFunds) : null;
  }
}
