import {
  IFunctionalArea,
  IFunctionalAreaFilters,
} from "App/Interfaces/FunctionalAreaInterfaces";
import FunctionalArea from "App/Models/FunctionalArea";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IFunctionalAreaRepository {
  getFunctionalAreaById(id: number): Promise<IFunctionalArea | null>;
  getFunctionalAreaPaginated(
    filters: IFunctionalAreaFilters
  ): Promise<IPagingData<IFunctionalArea>>;
}

export default class FunctionalAreaRepository
  implements IFunctionalAreaRepository
{
  constructor() {}

  async getFunctionalAreaById(id: number): Promise<IFunctionalArea | null> {
    const res = await FunctionalArea.find(id);
    return res ? (res.serialize() as IFunctionalArea) : null;
  }

  async getFunctionalAreaPaginated(filters: IFunctionalAreaFilters): Promise<IPagingData<IFunctionalArea>> {
        const query = FunctionalArea.query();
        if(filters.number){
            await query.where("number",filters.number);
        }

        const res = await query.paginate(filters.page, filters.perPage);
        const { data, meta } = res.serialize();

        return {
            array: data as IFunctionalArea[],
            meta,
        };
    }
}
