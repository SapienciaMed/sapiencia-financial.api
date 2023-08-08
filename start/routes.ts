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

Route.group(() => {
  Route.get("/get-all", "EntitiesController.getEntities")
}).prefix("/api/v1/entities")

Route.group(() => {
  Route.get("/get-by-id/:id", "PosPreSapienciaController.getPosPreSapienciaById");
  Route.post("/get-paginated", "PosPreSapienciaController.getPosPreSapienciaPaginated");
  Route.post("/create", "PosPreSapienciaController.createPosPreSapiencia");
  Route.put("/update/:id", "PosPreSapienciaController.updatePosPreSapiencia");
  Route.get("/get-all", "PosPreSapienciaController.getAllPosPreSapiencia");
}).prefix("/api/v1/pospre-sapiencia");

Route.group(() => {
  Route.get("/get-by-id/:id", "VinculationMGAController.getVinculationMGAById");
  Route.post("/get-paginated", "VinculationMGAController.getVinculationMGAPaginated");
  Route.post("/create", "VinculationMGAController.createVinculationMGA");
  Route.post("/delete", "VinculationMGAController.deleteVinculationMGA");
}).prefix("/api/v1/vinculation-mga");

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

Route.group(() => {
  Route.post("/get-paginated", "ProjectsController.getProjectsPaginated");
  Route.get("/get-all", "ProjectsController.getAllProjects");
}).prefix("/api/v1/projects");


Route.group(() => {
  Route.get("/get-by-id/:id", "ManagementCenterController.getManagementCenterById");
  Route.post("/get-paginated", "ManagementCenterController.getManagementCenterPaginated");
}).prefix("/api/v1/management-center");

Route.group(() => {
  Route.get("/get-all", "TypesTransfersController.getTypeTransfers")
}).prefix("/api/v1/type-transfers")

Route.group(() => {
  Route.get("/get-by-id/:id", "BudgetsRoutesController.getBudgetsRoutesById");
  Route.post("/get-paginated", "BudgetsRoutesController.getBudgetsRoutesPaginated");
  Route.post("/create", "BudgetsRoutesController.createBudgetsRoutes");
  Route.put("/update/:id", "BudgetsRoutesController.updateBudgetsRoutes");
}).prefix("/api/v1/budgets-routes")
// .middleware("auth");
