import test from "japa";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import EntitiesService from "App/Services/EntitiesService";
import { EntitiesRepositoryFake } from "./FakeClass/EntitiesRepositoryFake";
import { ApiResponse } from "App/Utils/ApiResponses";
import { IEntities } from "App/Interfaces/EntitiesInterfaces";


const service = new EntitiesService(new EntitiesRepositoryFake());

test.group("EntitiesService TEST for getEntities", () => {
  test("class service must have a method getEntities with a return", async (assert) => {
    const result = service.getEntities();
    assert.isNotNull(result);
  });

  test("the method getEntities must be a promise", async (assert) => {
    const result = service.getEntities();
    assert.typeOf(result, "Promise");
  });

  test("the method getEntities must return a ApiResponse", async (assert) => {
    const result = await service.getEntities();
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getEntities must return a OK code ", async (assert) => {
    const result = await service.getEntities();
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });

  test("the method getEntities must return a instance of IEntities[]", async (assert) => {
    const result = await service.getEntities();

    const expectedItems: IEntities = {
      id: 1,
      name: "Testing1"
    };

    assert.containsAllKeys(expectedItems, result.data[0] || {});
  });
});