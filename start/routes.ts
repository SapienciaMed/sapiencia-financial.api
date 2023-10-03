/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return "Api de servicios Transversales de SAPIENCIA";
});

Route.group(() => {

  Route.get("/get-by-id/:id", "FundsController.getFundsById");
  Route.post("/get-paginated", "FundsController.getFundsPaginated");
  Route.post("/create", "FundsController.createFund");
  Route.put("/update/:id", "FundsController.updateFund");
  Route.get("/get-all", "FundsController.getAllFunds");

}).prefix("/api/v1/funds");
// .middleware("auth");

Route.group(() => {

  Route.get("/get-by-id/:id", "BudgetsController.getBudgetsById");
  Route.post("/get-paginated", "BudgetsController.getBudgetsPaginated");
  Route.post("/create", "BudgetsController.createBudgets");
  Route.put("/update/:id", "BudgetsController.updateBudgets");
  Route.get("/get-all", "BudgetsController.getAllBudgets");

}).prefix("/api/v1/budgets");
// .middleware("auth");

Route.group(() => {

  Route.get("/get-all", "EntitiesController.getEntities");

}).prefix("/api/v1/entities")
// .middleware("auth");

Route.group(() => {

  Route.post("/get-paginated", "PosPreSapienciaController.getPosPreSapienciaPaginated");
  Route.put("/update/:id", "PosPreSapienciaController.updatePosPreSapiencia");
  Route.get("/get-all", "PosPreSapienciaController.getAllPosPreSapiencia");
  Route.get("/get-posprevinculation-by-id/:id", "PosPreSapienciaController.getPosPreSapienciaById");
  Route.post("/get-list-pospresap-vinculation-paginated" , "PosPreSapienciaController.getListPosPreSapVinculationPaginated");
  Route.post("/create-pospresap-vinculation" , "PosPreSapienciaController.createPosPreSapVinculation");
  Route.post("/update-pospresap-vinculation/:id" , "PosPreSapienciaController.updatePosPreSapVinculation");

}).prefix("/api/v1/pospre-sapiencia");
// .middleware("auth");

Route.group(() => {

  Route.get("/get-by-id/:id", "VinculationMGAController.getVinculationMGAById");
  Route.post("/get-paginated", "VinculationMGAController.getVinculationMGAPaginated");
  Route.post("/get-detailed-activities-api-planning", "VinculationMGAController.getDetailedActivitiesV2");
  Route.post("/create-vinculation-api-planning", "VinculationMGAController.createVinculationWithPlanningV2");
  Route.post("/get-detailed-activities-api-planning-nouseonpospre/:pospreorgid", "VinculationMGAController.getDetailedActivitiesNoUseOnPosPre");
  Route.post("/get-detailed-activities-api-planning-yesuseonpospre/:pospreorgid", "VinculationMGAController.getDetailedActivitiesYesUseOnPosPre");
  Route.get("/get-detailed-activities-api-planning-by-id/:id", "VinculationMGAController.getVinculationDetailedActivitiesV2ById");
  Route.post("/update-vinculation-multiple", "VinculationMGAController.updateMultipleVinculation");

}).prefix("/api/v1/vinculation-mga");
// .middleware("auth");

Route.group(() => {

  Route.get("/get-by-id/:id", "FunctionalAreaController.getFunctionalAreaById");
  Route.post("/get-paginated", "FunctionalAreaController.getFunctionalAreaPaginated");
  Route.post("/create", "FunctionalAreaController.createFunctionalArea");
  Route.put("/update/:id", "FunctionalAreaController.updateFunctionalArea");
  Route.get("/get-all", "FunctionalAreaController.getAllFunctionalAreas");
  Route.post("/link/create", "FunctionalAreaController.createProjectFunctionalArea");
  Route.post("/link/update", "FunctionalAreaController.updateProjectFunctionalArea");
  Route.delete("/link/delete/:id", "FunctionalAreaController.deleteProjectFunctionalArea");
  Route.get("/link/get-all", "FunctionalAreaController.getAllProjectFunctionalArea");
  Route.post("/link/get-paginated", "FunctionalAreaController.getProjectFunctionalAreaPaginated");

}).prefix("/api/v1/functional-area");
// .middleware("auth");

Route.group(() => {

  Route.post("/get-paginated", "ProjectsController.getProjectsPaginated");
  Route.get("/get-all", "ProjectsController.getAllProjects");
  Route.post("/get-unrelated-projects", "ProjectsController.getUnrelatedProjects");

  
  //New
  //TODO: Lo nuevo para ajustar todo el tema de proyectos de inversión
  Route.post("/get-projects-api-planning", "ProjectsController.getProjectsUpdateV2");
  Route.post("/get-projects-api-planning-no-functionalarea", "ProjectsController.getProjectsNoUseOnFunctionalArea");

}).prefix("/api/v1/projects");
// .middleware("auth");



Route.group(() => {
  Route.get("/get-by-id/:id", "ManagementCenterController.getManagementCenterById");
  Route.post("/get-paginated", "ManagementCenterController.getManagementCenterPaginated");
}).prefix("/api/v1/management-center");
// .middleware("auth");

Route.group(() => {

  Route.get("/get-all", "TypesTransfersController.getTypeTransfers");

}).prefix("/api/v1/type-transfers")
// .middleware("auth");

Route.group(() => {

  Route.get("/get-by-id/:id", "BudgetsRoutesController.getBudgetsRoutesById");
  Route.post("/get-paginated", "BudgetsRoutesController.getBudgetsRoutesPaginated");
  Route.post("/create", "BudgetsRoutesController.createBudgetsRoutes");
  Route.put("/update/:id", "BudgetsRoutesController.updateBudgetsRoutes");

}).prefix("/api/v1/budget-routes")
  // .middleware("auth");

Route.group(() => {

  Route.post("/get-paginated", "AdditionsController.getAdditionsPaginated");
  Route.post("/get-funds", "AdditionsController.getFundsList");
  Route.post("/get-pospre", "AdditionsController.getPosPreList");
  Route.post("/get-pospre-sapiencia", "AdditionsController.getPosPreSapienciaList");
  Route.post("/save-data", "AdditionsController.executeCreateAdditions"); //Como acción de guardado
  Route.post("/create", "AdditionsController.createAdditions"); //Como acción validación
  Route.get("/get-actadmin-district", "AdditionsController.getAllAdditionsByDistrict");
  Route.get("/get-actadmin-sapiencia", "AdditionsController.getAllAdditionsBySapiencia");
  Route.get("/get-by-id/:id", "AdditionsController.getAdditionById");
  Route.post("/update/:id", "AdditionsController.updateAdditionWithMov"); //Como acción de validación
  Route.post("/update-save/:id", "AdditionsController.executeUpdateAdditionWithMov"); //Como acción de guardado/actualizado

}).prefix("/api/v1/additions")
  // .middleware("auth");

Route.group(() => {

  Route.post("/get-paginated", "TransfersController.getTransfersPaginated");
  Route.post("/get-projects", "TransfersController.getProjectsList");
  Route.post("/get-funds", "TransfersController.getFundsList");
  Route.post("/get-pospre", "TransfersController.getPosPreList");
  Route.post("/get-pospre-sapiencia", "TransfersController.getPosPreSapienciaList");
  Route.post("/save-data", "TransfersController.executeCreateTransfers"); //Como acción de guardado
  Route.post("/create", "TransfersController.createTransfers"); //Como acción validación
  Route.get("/get-actadmin-district", "TransfersController.getAllTransfersByDistrict");
  Route.get("/get-actadmin-sapiencia", "TransfersController.getAllTransfersBySapiencia");
  Route.get("/get-by-id/:id", "TransfersController.getTransferById");
  Route.post("/update/:id", "TransfersController.updateTransferWithMov"); //Como acción de validación
  Route.post("/update-save/:id", "TransfersController.executeUpdateTransferWithMov"); //Como acción de guardado/actualizado

}).prefix("/api/v1/transfers")
  // .middleware("auth");

  Route.group(() => {
    Route.get("/get-by-id/:id", "FunctionalProjectsController.getFunctionalProjectById");
    Route.post("/get-paginated", "FunctionalProjectsController.getFunctionalProjectPaginated");
    Route.post("/create", "FunctionalProjectsController.createFunctionalProject");
    Route.post("/update-save/:id", "FunctionalProjectsController.updateFunctionalProject");
  }).prefix("/api/v1/projectOperation")
