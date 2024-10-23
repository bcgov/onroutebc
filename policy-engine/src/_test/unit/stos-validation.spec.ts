import { Policy } from 'onroute-policy-engine';
import { completePolicyConfig } from '../policy-config/complete-in-progress.sample';
import { testStos } from '../permit-app/test-stos';
import dayjs from 'dayjs';
import { PermitAppInfo } from '../../enum/permit-app-info';

describe('Single Trip Oversize Policy Configuration Validator', () => {
  const policy: Policy = new Policy(completePolicyConfig);

  it('should validate STOS successfully', async () => {
    const permit = JSON.parse(JSON.stringify(testStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should validate STOS successfully with 6 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(testStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set duration to 6
    permit.permitData.permitDuration = 6;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should validate STOS successfully with 7 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(testStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set duration to 7
    permit.permitData.permitDuration = 7;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation for STOS with 8 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(testStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set duration to 8
    permit.permitData.permitDuration = 8;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for STOS with 0 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(testStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set duration to 0
    permit.permitData.permitDuration = 0;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should pass validation for STOS with multiple boosters', async () => {
    const permit = JSON.parse(JSON.stringify(testStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Add two boosters to the configuration list
    // Note that this configuration allows boosters.
    permit.permitData.vehicleConfiguration.trailers.push({
      vehicleSubType: 'BOOSTER',
    });
    permit.permitData.vehicleConfiguration.trailers.push({
      vehicleSubType: 'BOOSTER',
    });

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for STOS with multiple jeeps', async () => {
    const permit = JSON.parse(JSON.stringify(testStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Add two jeeps to the configuration list
    // Note that this configuration allows jeeps.
    permit.permitData.vehicleConfiguration.trailers.splice(1, 0, {
      vehicleSubType: 'JEEPSRG',
    },{
      vehicleSubType: 'JEEPSRG',
    });

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation for STOS with jeep after the trailer', async () => {
    const permit = JSON.parse(JSON.stringify(testStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Add jeep to the end of the configuration.
    // Note that this configuration allows jeeps.
    permit.permitData.vehicleConfiguration.trailers.push({
      vehicleSubType: 'JEEPSRG',
    });

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for STOS with invalid configuration', async () => {
    const permit = JSON.parse(JSON.stringify(testStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Add an invalid trailer to the configuration list
    permit.permitData.vehicleConfiguration.trailers.push({
      vehicleSubType: '_INVALID',
    });

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });
});

