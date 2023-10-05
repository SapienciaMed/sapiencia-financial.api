declare module "@ioc:core.PacProvider" {
    import IPacService from "App/Services/PacService";
  
    const PacService: IPacService;
    export default PacService;
  }