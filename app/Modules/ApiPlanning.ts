declare module "@ioc:core.PlanningProvider" {
  import { IStrategicDirectionService } from "App/Services/External/StrategicDirectionService";

  const PlanningProvider: IStrategicDirectionService;
  export default PlanningProvider;
}
