import AdditionsMovement from "App/Models/AdditionsMovement";
import AmountBudgetAvailability from "App/Models/AmountBudgetAvailability";
import LinkRpcdp from "App/Models/LinkRpcdp";
import Pac from "App/Models/Pac";
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

//Obtener Icds por la Ruta presupuestal, si esta activa y por el año
export async function getIcdsByRouteAndYear(routeId: number, year: number) {
  const queryAmountBudgetAvailability = await AmountBudgetAvailability.query()
    .where("idRppCode", routeId)
    .preload("budgetAvailability");

  const resAmountBudgetAvailability = queryAmountBudgetAvailability
    .map((i) => i.serialize())
    .filter((i) => i.isActive === 1 && i.budgetAvailability.exercise == year);

  return resAmountBudgetAvailability;
}

//Obtener Vrps por el codigo del Icd que no esten anulados
export async function getVrpByIcdNotAnnulled(icdId: number) {
  const queryLinkRpcdp = await LinkRpcdp.query().where("amountCdpId", icdId);
  const resLinkRpcdp = queryLinkRpcdp
    .map((i) => i.serialize())
    .filter((i) => i.isActive === 1);

  return resLinkRpcdp;
}

//Obtener porcentaje de 2 valores
export function percentValue(value1: number, value2: number) {
  //Si no hay valor en el primer parametro o es cero retorna 0%
  if (!value1 || value1 === 0) return 0;

  //Si no hay valor en el segundo parametro o es cero retorna 0%
  if (!value2 || value2 === 0) return 0;

  const result = ((value1 / value2) * 100).toFixed(2);
  return parseFloat(result);
}

//Obtener Valores causados y pagados por medio de el Id de Vrp
export async function getValuesPaidAndCausedByVrp(vrpId: number) {
  let values_caused = 0;
  let values_paid = 0;

  const queryPago = await Pago.query().where("vinculacionRpCode", vrpId);
  const resPago = queryPago.map((i) => i.serialize());

  if (resPago.length > 0) {
    values_caused = resPago.reduce(
      (total, i) => total + parseInt(i.valorCausado),
      0
    );

    values_paid = resPago.reduce(
      (total, i) => total + parseInt(i.valorPagado),
      0
    );
  }

  return {
    values_caused,
    values_paid,
  };
}

//Obtiene información sobre los créditos y contra créditos relacionados con un presupuesto.
export const getCreditAndAgainstCredits = async (
  rpp_credits: number
): Promise<any[]> => {
  const resTransfersMovement = await TransfersMovement.query();

  const result = resTransfersMovement.map((i) => i.serialize());

  const filterData = result.filter((i) => i.budgetRouteId === rpp_credits);

  return filterData;
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

  const resultIcds = await getIcdsByRouteAndYear(
    rpp_amount_budget_availability,
    year
  );

  if (resultIcds.length > 0) {
    for (const element of resultIcds) {
      const resLinkRpcdp = await getVrpByIcdNotAnnulled(element.id);

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
  const resultIcds = await getIcdsByRouteAndYear(rppId, year);

  if (resultIcds.length > 0) {
    for (const icd of resultIcds) {
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

export const getCollected = async (rppId: number, year: number) => {
  let result = 0;
  const queryPac = await Pac.query()
    .where("budgetRouteId", rppId)
    .where("exercise", year)
    .where("isActive", 1)
    .preload("pacAnnualizations", (subQuery) =>
      subQuery.where("type", "Recaudado")
    );
  const resPac = queryPac.map((i) => i.serialize());

  if (resPac.length > 0) {
    for (const pac of resPac) {
      const sumOfMonths = pac.pacAnnualizations.map((obj) => {
        const sum = Object.entries(obj)
          .filter(
            ([key, value]) =>
              typeof value === "number" && key !== "id" && key !== "pacId"
          )
          .reduce(
            (acc, [, value]) => acc + (typeof value === "number" ? +value : 0),
            0
          );

        return { ...obj, sumOfMonths: sum };
      });

      result += sumOfMonths[0].sumOfMonths;
    }
  }

  return result;
};
