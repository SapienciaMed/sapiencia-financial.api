import { IDataCredits } from "App/Interfaces/ReportsInterfaces";
import AdditionsMovement from "App/Models/AdditionsMovement";
import AmountBudgetAvailability from "App/Models/AmountBudgetAvailability";
import LinkRpcdp from "App/Models/LinkRpcdp";
import TransfersMovement from "App/Models/TransfersMovement";

export function getStringDate(date: Date): string {
  let day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  let strMonth = "";
  let strDay = "";

  if (month < 10) {
    strMonth = `0${month}`;
  } else {
    strMonth = month.toString();
  }
  if (day < 10) {
    strDay = `0${day}`;
  } else {
    strDay = day.toString();
  }
  return `${year}-${strMonth}-${strDay}`;
}

//Obtiene información sobre los créditos y contra créditos relacionados con un presupuesto.
export const getCreditAndAgainstCredits = async (
  rpp_credits: string
): Promise<IDataCredits | null> => {
  const resTransfersMovement = await TransfersMovement.query();

  const result = resTransfersMovement.map((i) => i.serialize());

  const filterData = result.find((i) => i.budgetRouteId === rpp_credits);

  return filterData
    ? {
        id: filterData.id,
        transferId: filterData.transferId,
        type: filterData.type,
        budgetRouteId: filterData.budgetRouteId,
        value: filterData.value,
      }
    : null;
};

//Obtiene movimientos de adición relacionados con un presupuesto.
export const getAdditionMovement = async (
  rpp_addition: string
): Promise<any[]> => {
  const queryAdditionMovement = await AdditionsMovement.query()
    .preload("addition")
    .preload("budgetRoute")
    .where("budgetRouteId", rpp_addition);

  const resAdditionMovement = queryAdditionMovement.map((i) => i.serialize());

  return resAdditionMovement;
};

//Obtiene información sobre la disponibilidad y compromiso presupuestario relacionados con un presupuesto.
export const getAmountBudgetAvailability = async (
  rpp_amount_budget_availability: string
): Promise<any> => {
  let availability = false;
  let availabilityValue = 0;
  let compromise = false;
  let compromiseValue = 0;
  const queryAmountBudgetAvailability =
    await AmountBudgetAvailability.query().where(
      "idRppCode",
      rpp_amount_budget_availability
    );

  const resAmountBudgetAvailability = queryAmountBudgetAvailability.map((i) =>
    i.serialize()
  );

  if (resAmountBudgetAvailability.length > 0) {
    let idcFinalValue: number = 0;
    for (const element of resAmountBudgetAvailability) {
      idcFinalValue += element.idcFinalValue ? +element.idcFinalValue : 0;
      const queryLinkRpcdp = await LinkRpcdp.query().where(
        "amountCdpId",
        element.cdpCode
      );

      const resLinkRpcdp = queryLinkRpcdp.map((i) => i.serialize());
      if (resLinkRpcdp.length > 0) {
        compromise = true;
        compromiseValue = idcFinalValue;
      } else {
        availability = true;
        availabilityValue = idcFinalValue;
      }
    }
  }
  return {
    availability: availability,
    availabilityValue: availabilityValue,
    compromise: compromise,
    compromiseValue: compromiseValue,
  };
};
