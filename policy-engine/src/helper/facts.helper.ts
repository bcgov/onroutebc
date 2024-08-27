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

  /**
   * Add runtime fact for number of days in the permit year.
   * Will be either 365 or 366, for use when comparing against
   * duration for 1 year permits.
   */
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
      const daysInPermitYear = dateFrom.add(1, 'year').diff(dateFrom, 'day');
      return daysInPermitYear;
    },
  );

  /**
   * Add runtime fact for a fixed permit cost, the cost supplied
   * as a parameter.
   */
  engine.addFact(PolicyFacts.FixedCost.toString(), async function (params) {
    return params.cost;
  });

  /**
   * Add runtime fact for cost per month, where month is defined by
   * policy as a 30 day period or portion thereof, except in the
   * case of a full year in which case it is 12 months.
   */
  engine.addFact(
    PolicyFacts.CostPerMonth.toString(),
    async function (params, almanac) {
      const duration: number = await almanac.factValue(
        PermitAppInfo.PermitDuration.toString(),
      );
      const daysInPermitYear: number = await almanac.factValue(
        PolicyFacts.DaysInPermitYear.toString(),
      );

      let months: number = Math.floor(duration / 30);
      const extraDays: number = duration % 30;

      if (extraDays > 0 && duration !== daysInPermitYear) {
        // Add an extra month for a partial month unless it is
        // a full year. Note this does not handle the case where 2
        // or more years duration is specified, since that is not
        // a valid permit and does not warrant considetation.
        months++;
      }

      return months * params.cost;
    },
  );
}

/**
 * Flattens the permit application, using keys taken from the PermitFacts enum so
 * the facts can be used more easily within validation rules.
 * @param permitApplication Permit application object to flatten.
 * @returns Flattened permit application object for validation.
 */
export function transformPermitFacts(permitApplication: any): PermitFacts {
  // Flatten the permit application so all properties can be accessed
  // by key
  const permitFacts: PermitFacts = flattie(permitApplication);

  // Add the app itself as a fact to be used by more complex rules
  permitFacts.app = permitApplication;

  return permitFacts;
}
