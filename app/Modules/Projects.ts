declare module "@ioc:core.ProjectsProvider" {
    import { IProjectsService } from "App/Services/ProjectsService";
  
    const ProjectsProvider: IProjectsService;
    export default ProjectsProvider;
  }
  