declare module "@ioc:core.EntitiesProvider" {
    import { IEntitiesService } from "App/Services/EntitiesService";
  
    const EntitiesProvider: IEntitiesService;
    export default EntitiesProvider;
  }
  