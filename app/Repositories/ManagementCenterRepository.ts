import { IManagementCenterFilters, IManagementCenter } from "App/Interfaces/ManagementCenterInterfaces";
import ManagementCenter from "../Models/ManagementCenter";
import { IPagingData } from "App/Utils/ApiResponses";


export interface IManagementCenterRepository {
  getManagementCenterById(id: number): Promise<IManagementCenter | null>;
  getManagementCenterPaginated(filters: IManagementCenterFilters): Promise<IPagingData<IManagementCenter>>;
}

export default class ManagementCenterRepository implements IManagementCenterRepository {
  constructor() {}

  async getManagementCenterById(id: number): Promise<IManagementCenter | null> {
    const res = await ManagementCenter.find(id);
    await res?.load('transfers');
    return res ? (res.serialize() as IManagementCenter) : null;
  }

  async getManagementCenterPaginated(filters: IManagementCenterFilters): Promise<IPagingData<IManagementCenter>> {
    const query = ManagementCenter.query();

    if (filters.actDistrict) {
      query.where("actDistrict", filters.actDistrict);
    }

    if (filters.transfers) {
      query.where("number", filters.transfers.id);
    }

    if (filters.actSapiencia) {
        query.where("actSapiencia", filters.actSapiencia);
    }

    await query.preload('transfers');

    const res = await query.paginate(filters.page, filters.perPage);

    const { data, meta } = res.serialize();

    return {
      array: data as IManagementCenter[],
      meta,
    };
  }

}
