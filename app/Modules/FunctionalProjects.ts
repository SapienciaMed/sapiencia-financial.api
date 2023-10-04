declare module "@ioc:core.FunctionalProjectProvider" {
  import { IFunctionalProjectService } from "App/Services/FunctionalProjectService";

  const FunctionalProjectProvider: IFunctionalProjectService;
  export default FunctionalProjectProvider;
}
