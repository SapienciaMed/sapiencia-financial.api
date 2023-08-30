// import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
// import { IAdditionsMovements } from "App/Interfaces/AdditionsInterfaces";
// import AdditionsMovement from "App/Models/AdditionsMovement";

export interface IMovementAdditionRepository {

  // createManyMovementsAddition(movements: IAdditionsMovements[],trx: TransactionClientContract): Promise<boolean>;
  // createMovementsAddition(movement: IAdditionsMovements, additionId: number): Promise<boolean>;

}

export default class MovementAdditionRepository implements IMovementAdditionRepository {

  constructor() {}

  // async createManyMovementsAddition(movements: IAdditionsMovements[],trx: TransactionClientContract): Promise<boolean> {

  //   console.log(movements);
  //   await AdditionsMovement.createMany(movements, { client: trx });
  //   return true;

  // }

  // async createMovementsAddition(movement: IAdditionsMovements, additionId: number): Promise<boolean>{

  //   console.log({movement , additionId})
  //   const toCreate = new AdditionsMovement();

  //   toCreate.fill({
  //     additionId,
  //     ...movement
  //   });

  //   await toCreate.save();
  //   return true;

  // }

}
