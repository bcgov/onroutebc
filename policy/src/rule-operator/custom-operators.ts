import { Operator } from 'json-rules-engine';
import dayjs from 'dayjs';

function stringValidator(a: any): boolean {
  return typeof a === 'string';
}

function dateStringValidator(a: any): boolean {
  const d = dayjs(a, 'YYYY-MM-DD');
  return d.isValid();
}

const CustomOperators: Array<Operator> = [];

CustomOperators.push(
  new Operator(
    'stringMinimumLength',
    (a: string, b: number) => a.trim().length >= b,
    stringValidator,
  ),
);

CustomOperators.push(
  new Operator(
    'dateLessThan',
    (a: string, b: string) => {
      const firstDate = dayjs(a, 'YYYY-MM-DD');
      const secondDate = dayjs(b, 'YYYY-MM-DD');
      return firstDate.diff(secondDate) < 0;
    },
    dateStringValidator,
  ),
);

CustomOperators.push(
  new Operator(
    'regex',
    (a: string, b: string) => a.match(b) !== null,
    stringValidator,
  ),
);

export default CustomOperators;
