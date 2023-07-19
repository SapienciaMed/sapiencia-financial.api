import test from "japa";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import FundsService from "App/Services/FundsService";
import { FundsRepositoryFake } from "./FakeClass/FundsRepositoryFake";
import { ApiResponse } from "App/Utils/ApiResponses";
import { IFunds, IFundsFilters } from "App/Interfaces/FundsInterfaces";
import { DateTime } from "luxon";

const service = new FundsService(new FundsRepositoryFake());

test.group("FundsService TEST for getFundsById", () => {
  const fundId = 1;
  test("class service must have a method getFundsById with a return", async (assert) => {
    const result = service.getFundsById(fundId);
    assert.isNotNull(result);
  });

  test("the method getFundsById must be a promise", async (assert) => {
    const result = service.getFundsById(fundId);
    assert.typeOf(result, "Promise");
  });

  test("the method getFundsById must return a ApiResponse", async (assert) => {
    const result = await service.getFundsById(fundId);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getFundsById must return a WARN code, if fund is not located ", async (assert) => {
    const result = await service.getFundsById(20);
    assert.isTrue(result.operation.code === EResponseCodes.WARN);
  });

  test("the method getFundsById must return a OK code ", async (assert) => {
    const result = await service.getFundsById(fundId);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });

  test("the method getFundsById must return a instance of IFunds", async (assert) => {
    const result = await service.getFundsById(fundId);

    const expectedItems: IFunds = {
      id: 1,
      number: 12,
      entityId: 1,
      denomination: "Denominacion",
      description: "Descripcion",
      dateFrom: DateTime.now(),
      dateTo: DateTime.now()
    };

    assert.containsAllKeys(expectedItems, result.data || {});
  });
});

test.group("FundsService TEST for getFundsPaginated", () => {
  const filter: IFundsFilters = {
    page: 1,
    perPage: 1
  };

  test("class service must have a method getFundsPaginated with a return", async (assert) => {
    const result = service.getFundsPaginated(filter);
    assert.isNotNull(result);
  });

  test("the method getFundsPaginated must be a promise", async (assert) => {
    const result = service.getFundsPaginated(filter);
    assert.typeOf(result, "Promise");
  });

  test("the method getFundsPaginated must return a ApiResponse", async (assert) => {
    const result = await service.getFundsPaginated(filter);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getFundsPaginated must return a OK code ", async (assert) => {
    const result = await service.getFundsPaginated(filter);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });

  test("the method getFundsPaginated must return a array", async (assert) => {
    const result = await service.getFundsPaginated(filter);

    assert.isArray(result.data.array);
  });

  test("the method getFundsPaginated must return a instance of IFunds", async (assert) => {
    const result = await service.getFundsPaginated(filter);

    const expectedItems: IFunds = {
      id: 1,
      number: 12,
      entityId: 1,
      denomination: "Denominacion",
      description: "Descripcion",
      dateFrom: DateTime.now(),
      dateTo: DateTime.now()
    };

    assert.containsAllKeys(expectedItems, result.data.array[0] || {});
  });
});

test.group("FundsService TEST for createFund", () =>{
  const fund: IFunds = {
    id: 2,
    number: 12,
    entityId: 1,
    denomination: "Denominacion",
    description: "Descripcion",
    dateFrom: DateTime.now(),
    dateTo: DateTime.now()
  };

  test("the method createFund must be a promise", async (assert) => {
    const result = service.createFund(fund);
    assert.typeOf(result, "Promise");
  });

  test("the method createFund must return a ApiResponse", async (assert) => {
    const result = await service.createFund(fund);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method createFund must return a OK code ", async (assert) => {
    const result = await service.createFund(fund);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });

  test("the method createFund must return a instance of IFunds", async (assert) => {
    const result = await service.createFund(fund);

    const expectedItems: IFunds = {
      id: 1,
      number: 12,
      entityId: 1,
      denomination: "Denominacion",
      description: "Descripcion",
      dateFrom: DateTime.now(),
      dateTo: DateTime.now()
    };

    assert.containsAllKeys(expectedItems, result.data || {});
  });
});

test.group("FundsService TEST for updateFund", () =>{
  const fund: IFunds = {
    number: 12,
    entityId: 1,
    denomination: "Denominacion",
    description: "Descripcion",
    dateFrom: DateTime.now(),
    dateTo: DateTime.now()
  };
  const fundId:number = 1;

  test("the method updateFund must be a promise", async (assert) => {
    const result = service.updateFund(fund, fundId);
    assert.typeOf(result, "Promise");
  });

  test("the method updateFund must return a ApiResponse", async (assert) => {
    const result = await service.updateFund(fund, fundId);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method updateFund must return a FAIL code, if fund is not located ", async (assert) => {
    const result = await service.updateFund(fund, 999);
    assert.isTrue(result.operation.code === EResponseCodes.FAIL);
  });

  test("the method updateFund must return a OK code ", async (assert) => {
    const result = await service.updateFund(fund, fundId);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });

  test("the method updateFund must return a instance of IFunds", async (assert) => {
    const result = await service.updateFund(fund, 1);

    const expectedItems: IFunds = {
      id: 1,
      number: 12,
      entityId: 1,
      denomination: "Denominacion",
      description: "Descripcion",
      dateFrom: DateTime.now(),
      dateTo: DateTime.now()
    };

    assert.containsAllKeys(expectedItems, result.data || {});
  });
});