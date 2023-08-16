declare module "@ioc:core.ManagementCenterProvider" {
    import { IManagementCenterService } from "App/Services/ManagementCenterService";
  
    const ManagementCenterService: IManagementCenterService;
    export default ManagementCenterService;
  }
  