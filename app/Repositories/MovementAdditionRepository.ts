// import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import AdditionsMovement from '../Models/AdditionsMovement';
import { IPagingData } from "App/Utils/ApiResponses";
import { IAdditionsWithMovements } from '../Interfaces/AdditionsInterfaces';

export interface IMovementAdditionRepository {

  getMovementById(id: number): Promise<IPagingData<IAdditionsWithMovements>>;
  deleteMovementById(id: number): Promise<Boolean>;

}

export default class MovementAdditionRepository implements IMovementAdditionRepository {

  async getMovementById(id: number): Promise<IPagingData<IAdditionsWithMovements> | any> {

    const movements = AdditionsMovement.query().where("additionId" , id);

    const page = 1;
    const perPage = 1000000;

    const res = await movements.paginate(page, perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as IAdditionsWithMovements[],
      meta,
    };

  }

  async deleteMovementById(id: number): Promise<Boolean> {

    const movements = AdditionsMovement.query().where("additionId" , id).delete();
    await movements;

    return true;

  }

}
