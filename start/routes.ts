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
}).prefix("/api/v1/funds");
// .middleware("auth");

Route.group(() => {
  Route.get("/get-by-id/:id", "BudgetsController.getBudgetsById");
  Route.post("/get-paginated", "BudgetsController.getBudgetsPaginated");
  Route.post("/create", "BudgetsController.createBudgets");
  Route.put("/update/:id", "BudgetsController.updateBudgets");
}).prefix("/api/v1/budgets");

Route.group(() => {
  Route.get("/get-all", "EntitiesController.getEntities")
}).prefix("/api/v1/entities")

Route.group(() => {
  Route.get("/get-by-id/:id", "PosPreSapienciaController.getPosPreSapienciaById");
  Route.post("/get-paginated", "PosPreSapienciaController.getPosPreSapienciaPaginated");
  Route.post("/create", "PosPreSapienciaController.createPosPreSapiencia");
  Route.put("/update/:id", "PosPreSapienciaController.updatePosPreSapiencia");
}).prefix("/api/v1/pospre-sapiencia");
// .middleware("auth");
