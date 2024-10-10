import { Policy } from 'onroute-policy-engine';
import { completePolicyConfig } from '../policy-config/complete-in-progress.sample';
import { multipleCostRules } from '../policy-config/tros-multiple-cost-rules.sample';
import { validTros30Day } from '../permit-app/valid-tros-30day';
import { validTrow120Day } from '../permit-app/valid-trow-120day';
import { testStos } from '../permit-app/test-stos';
import dayjs from 'dayjs';
import { PermitAppInfo } from '../../enum/permit-app-info';

describe('Policy Engine Cost Calculator', () => {
  const policy: Policy = new Policy(completePolicyConfig);
  const multipleCostRulesPolicy = new Policy(multipleCostRules);

  it('should calculate 30 day TROS cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).toHaveLength(1);
    expect(validationResult.cost[0].cost).toBe(30);
  });

  it('should calculate 31 day TROS cost as 2 months', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set duration to 31
    permit.permitData.permitDuration = 31;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).toHaveLength(1);
    expect(validationResult.cost[0].cost).toBe(60);
  });

  it('should calculate 1 year TROS cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    const today = dayjs();
    // Set startDate to today
    permit.permitData.startDate = today.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set duration to full year (365 or 366 depending on leap year)
    const oneYearDuration: number = today.add(1, 'year').diff(today, 'day');
    permit.permitData.permitDuration = oneYearDuration;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).toHaveLength(1);
    expect(validationResult.cost[0].cost).toBe(360);
  });

  it('should calculate 120 day TROW cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validTrow120Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).toHaveLength(1);
    expect(validationResult.cost[0].cost).toBe(400);
  });

  it('should calculate STOS cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(testStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).toHaveLength(1);
    expect(validationResult.cost[0].cost).toBe(15);
  });

  it('should calculate valid TROS with multiple cost rules correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await multipleCostRulesPolicy.validate(permit);
    expect(validationResult.cost).toHaveLength(2);
    const cost1: number = validationResult.cost[0]?.cost || 0;
    const cost2: number = validationResult.cost[1]?.cost || 0;
    expect(cost1 + cost2).toBe(45);
  });

  it('should calculate 31 day TROS with multiple cost rules correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set duration to 31
    permit.permitData.permitDuration = 31;

    const validationResult = await multipleCostRulesPolicy.validate(permit);
    expect(validationResult.cost).toHaveLength(2);
    const cost1: number = validationResult.cost[0]?.cost || 0;
    const cost2: number = validationResult.cost[1]?.cost || 0;
    expect(cost1 + cost2).toBe(75);
  });
});
