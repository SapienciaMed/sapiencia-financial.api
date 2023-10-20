declare module "@ioc:core.CdpsProvider" {
    import { ICdpsService } from "App/Services/CdpsService";

    const CdpsProvider: ICdpsService;
    export default CdpsProvider;
}
