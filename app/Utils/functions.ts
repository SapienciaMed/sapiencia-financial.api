import { IDataCredits } from "App/Interfaces/ReportsInterfaces";
import AdditionsMovement from "App/Models/AdditionsMovement";
import AmountBudgetAvailability from "App/Models/AmountBudgetAvailability";
import LinkRpcdp from "App/Models/LinkRpcdp";
import Pago from "App/Models/PagPagos";
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
  // if (rpp_credits === "9232020200802") console.log({ rpp_credits, filterData });

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
  rpp_amount_budget_availability: number,
  year: number
): Promise<any> => {
  let availability = false;
  let availabilityValue = 0;
  let compromise = false;
  let compromiseValue = 0;

  const queryAmountBudgetAvailability = await AmountBudgetAvailability.query()
    .where("idRppCode", rpp_amount_budget_availability)
    .preload("budgetAvailability");

  const resAmountBudgetAvailability = queryAmountBudgetAvailability
    .map((i) => i.serialize())
    .filter((i) => i.isActive === 1 && i.budgetAvailability.exercise == year);

  if (resAmountBudgetAvailability.length > 0) {
    for (const element of resAmountBudgetAvailability) {
      const queryLinkRpcdp = await LinkRpcdp.query().where(
        "amountCdpId",
        element.id
      );
      const resLinkRpcdp = queryLinkRpcdp
        .map((i) => i.serialize())
        .filter((i) => i.isActive === 1);

      if (resLinkRpcdp.length > 0) {
        const sumCompromiseVrp = resLinkRpcdp
          .filter((i) => i.finalAmount)
          .map((obj) => parseFloat(obj.finalAmount))
          .reduce((total, value) => total + value, 0);

        compromise = true;
        compromiseValue += sumCompromiseVrp;
      }

      if (!resLinkRpcdp.length) {
        availability = true;
        availabilityValue += isFinite(element.idcFinalValue)
          ? +element.idcFinalValue
          : 0;
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

export const getCheckWhetherOrNotHaveRp = async (icdId: number) => {
  const queryLinkRpcdp = await LinkRpcdp.query().where("amountCdpId", icdId);

  const resLinkRpcdp = queryLinkRpcdp.map((i) => i.serialize());

  if (resLinkRpcdp.length > 0) return true;

  return false;
};

export const getInvoicesAndPaymentsVrp = async (
  rppId: number,
  year: number
): Promise<any> => {
  let invoiceSumn: number = 0;
  let paymentSumn: number = 0;
  const queryAmountBudgetAvailability = await AmountBudgetAvailability.query()
    .where("idRppCode", rppId)
    .preload("budgetAvailability");

  const resAmountBudgetAvailability = queryAmountBudgetAvailability
    .map((i) => i.serialize())
    .filter((i) => i.isActive === 1 && i.budgetAvailability.exercise == year);

  if (resAmountBudgetAvailability.length > 0) {
    for (const icd of resAmountBudgetAvailability) {
      const queryLinkRpcdp = await LinkRpcdp.query().where(
        "amountCdpId",
        icd.id
      );
      const resLinkRpcdp = queryLinkRpcdp.map((i) => i.serialize());
      if (resLinkRpcdp.length > 0) {
        for (const linkRpcdp of resLinkRpcdp) {
          const queryPago = await Pago.query().where(
            "vinculacionRpCode",
            linkRpcdp.id
          );
          const resPago = queryPago.map((i) => i.serialize());
          if (resPago.length > 0) {
            resPago.forEach((element) => {
              const resta: number =
                parseInt(element.valorCausado) - parseInt(element.valorPagado);
              if (resta > 0) {
                invoiceSumn += resta;
              }
            });

            paymentSumn = resPago.reduce(
              (total, i) => total + parseInt(i.valorPagado),
              0
            );
          }
        }
      }
    }
  }

  return {
    invoiceSumn: invoiceSumn,
    paymentSumn: paymentSumn,
  };
};

export const getlinksRpCdp = async (year: number, type: string) => {
  let result: any[] = [];
  const queryLinkRpcdp = await LinkRpcdp.query()
    .orderBy("id", "desc")
    .preload("amountBudgetAvailability", (subQuery) => {
      subQuery.preload("budgetRoute", (subSubQuery) => {
        subSubQuery.preload("funds");
        subSubQuery.preload("pospreSapiencia");
        subSubQuery.preload("projectVinculation");
      });
    })
    .preload("budgetRecord");

  const resLinkRpcdp = queryLinkRpcdp
    .map((i) => i.serialize())
    .filter(
      (i) =>
        i.amountBudgetAvailability.budgetRoute.pospreSapiencia.ejercise ===
          year && i.isActive === 1
    );
  for (const lrc of resLinkRpcdp) {
    const queryPago = await Pago.query().where("vinculacionRpCode", lrc.id);
    const resPago = queryPago.map((i) => i.serialize());

    if (type === "RpBalance") {
      const find = resPago.filter(
        (i) => parseInt(i.valorCausado) > 0 && parseInt(i.valorPagado) > 0
      );
      if (!find.length && !queryPago.length) {
        result.push(lrc);
      }
    }
    if (type === "AccountsPayable") {
      const find = resPago.filter(
        (i) =>
          parseInt(i.valorCausado) > 0 &&
          (!parseInt(i.valorPagado) || parseInt(i.valorPagado) === 0)
      );
      if (find.length > 0) {
        result.push(lrc);
      }
    }
  }

  return { result };
};
