declare module "@ioc:core.AdditionsProvider" {
  import { IAdditionsService } from "App/Services/AdditionsService";

  const AdditionsProvider: IAdditionsService;
  export default AdditionsProvider;
}
