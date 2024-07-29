import { Policy } from 'onroute-policy-engine';
import { PermitAppInfo } from 'onroute-policy-engine/enum';
import { masterPolicyConfig } from '../_test/policy-config/master.sample';
import { validTros30Day } from '../_test/permit-app/valid-tros-30day';
import dayjs from 'dayjs';

async function start() {
  const policy: Policy = new Policy(masterPolicyConfig);
  const today = dayjs();

  // Set startDate to today
  validTros30Day.permitData.startDate = today.format(
    PermitAppInfo.PermitDateFormat.toString(),
  );
  // Set duration to full year (365 or 366 depending on leap year)
  const oneYearDuration: number = today.add(1, 'year').diff(today, 'day');
  console.log('Setting TROS permit duration to ' + oneYearDuration);
  validTros30Day.permitData.permitDuration = oneYearDuration;

  const validationResult2 = await policy.validate(validTros30Day);
  console.log(JSON.stringify(validationResult2, null, '   '));
}

start();
