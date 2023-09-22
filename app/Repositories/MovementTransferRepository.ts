// import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { IPagingData } from "App/Utils/ApiResponses";
import { ITransfersWithMovements } from '../Interfaces/TransfersInterfaces';
import TransfersMovement from '../Models/TransfersMovement';

export interface IMovementTransferRepository {

  getMovementById(id: number): Promise<IPagingData<ITransfersWithMovements>>;
  deleteMovementById(id: number): Promise<Boolean>;

}

export default class MovementTransferRepository implements IMovementTransferRepository {

  async getMovementById(id: number): Promise<IPagingData<ITransfersWithMovements> | any> {

    const movements = TransfersMovement.query().where("transferId" , id);

    const page = 1;
    const perPage = 1000000;

    const res = await movements.paginate(page, perPage);
    const { data, meta } = res.serialize();

    return {
      array: data as ITransfersWithMovements[],
      meta,
    };

  }

  async deleteMovementById(id: number): Promise<Boolean> {

    const movements = TransfersMovement.query().where("transferId" , id).delete();
    await movements;

    return true;

  }

}
