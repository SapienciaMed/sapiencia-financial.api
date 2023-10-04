declare module "@ioc:core.PlanningProvider" {
  import { IPlanningService } from "App/Services/External/StrategicDirectionService";

  const PlanningProvider: IPlanningService;
  export default PlanningProvider;
}
