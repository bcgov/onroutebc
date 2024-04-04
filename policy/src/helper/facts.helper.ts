import dayjs from "dayjs";
import { Engine } from "json-rules-engine"

export const addRuntimeFacts = (engine: Engine) => {
  const today: string = dayjs().format('YYYY-MM-DD');
  engine.addFact('validation-date', today);

  engine.addFact('days-in-current-year', async function (params, almanac) {
    const startDate: string = await almanac.factValue('permitData', {}, '$.startDate');
    const dateFrom = dayjs(startDate, 'YYYY-MM-DD');
    return dateFrom.diff(dateFrom.add(1, 'year'), 'day');
  });
};