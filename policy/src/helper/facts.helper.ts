import dayjs from 'dayjs';
import { Engine } from 'json-rules-engine';
import PermitApplication from '../type/permit-application.type';
import { PermitFacts } from '../interface/facts.interface';
import { PolicyFacts } from '../enum/facts.enum';

/**
 * Adds runtime facts for the validation. For example, adds the
 * validation date for comparison against startDate of the permit.
 * @param engine json-rules-engine Engine instance to add facts to.
 */
export function addRuntimeFacts(engine: Engine): void {
  const today: string = dayjs().format('YYYY-MM-DD');
  engine.addFact(PolicyFacts.ValidationDate.toString(), today);

  // Will be either 365 or 366, for use when comparing against
  // duration for 1 year permits.
  engine.addFact(
    PolicyFacts.DaysInPermitYear.toString(),
    async function (params, almanac) {
      const startDate: string = await almanac.factValue('startDate');
      const dateFrom = dayjs(startDate, 'YYYY-MM-DD');
      return dateFrom.diff(dateFrom.add(1, 'year'), 'day');
    },
  );
}

/**
 * Flattens the permit application, using keys taken from the PermitFacts enum so
 * the facts can be used more easily within validation rules.
 * @param permitApplication Permit application object to flatten.
 * @returns Flattened permit application object for validation.
 */
export function transformPermitFacts(
  permitApplication: PermitApplication,
): PermitFacts {
  const permitFacts: PermitFacts = {};
  permitFacts.companyName = permitApplication?.permitData?.companyName;
  permitFacts.duration = permitApplication?.permitData?.permitDuration;
  permitFacts.permitType = permitApplication?.permitType;
  permitFacts.startDate = permitApplication?.permitData?.startDate;
  permitFacts.vehicleIdentificationNumber =
    permitApplication?.permitData?.vehicleDetails?.vin;
  permitFacts.vehiclePlate =
    permitApplication?.permitData?.vehicleDetails?.plate;
  permitFacts.vehicleType =
    permitApplication?.permitData?.vehicleDetails?.vehicleSubType;

  return permitFacts;
}
