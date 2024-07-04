import dayjs from 'dayjs';
import { Engine } from 'json-rules-engine';
import { flattie } from 'flattie';
import { PermitFacts } from 'onroute-policy-engine/types';
import { PermitAppInfo, PolicyFacts } from 'onroute-policy-engine/enum';

/**
 * Adds runtime facts for the validation. For example, adds the
 * validation date for comparison against startDate of the permit.
 * @param engine json-rules-engine Engine instance to add facts to.
 */
export function addRuntimeFacts(engine: Engine): void {
  const today: string = dayjs().format(
    PermitAppInfo.PermitDateFormat.toString(),
  );
  engine.addFact(PolicyFacts.ValidationDate.toString(), today);

  // Will be either 365 or 366, for use when comparing against
  // duration for 1 year permits.
  engine.addFact(
    PolicyFacts.DaysInPermitYear.toString(),
    async function (params, almanac) {
      const startDate: string = await almanac.factValue(
        PermitAppInfo.PermitStartDate.toString(),
      );
      const dateFrom = dayjs(
        startDate,
        PermitAppInfo.PermitDateFormat.toString(),
      );
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
  permitApplication: any,
): PermitFacts {
  // Flatten the permit application so all properties can be accessed
  // by key
  const permitFacts: PermitFacts = flattie(permitApplication);

  // Add the app itself as a fact to be used by more complex rules
  permitFacts.app = permitApplication;

  return permitFacts;
}
