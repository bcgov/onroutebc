import Policy from '../../src/policy-engine';
import { trosOnly } from '../policy-config/tros-only.sample';
import { trosNoAllowedVehicles } from '../policy-config/tros-no-allowed-vehicles.sample';
import { validTros30Day } from '../permit-app/valid-tros-30day';
import { allEventTypes } from '../policy-config/all-event-types..sample';
import dayjs from 'dayjs';

describe('Permit Engine Constructor', () => {
  it('should construct without error', () => {
    expect(() => new Policy(trosOnly)).not.toThrow();
  });

  it('should assign policy definition correctly', () => {
    const policy: Policy = new Policy(trosOnly);
    expect(policy.policyDefinition).toBeTruthy();
  });
});

describe('Permit Engine Validator', () => {
  const policy: Policy = new Policy(trosOnly);

  it('should validate TROS successfully', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format('YYYY-MM-DD');

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should raise violation for start date in the past', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to yesterday
    permit.permitData.startDate = dayjs()
      .subtract(1, 'day')
      .format('YYYY-MM-DD');

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should raise violation for invalid permit type', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format('YYYY-MM-DD');
    permit.permitType = '__INVALID';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should raise violation for invalid vehicle type', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format('YYYY-MM-DD');
    // Set an invalid vehicle type
    permit.permitData.vehicleDetails.vehicleSubType = '__INVALID';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should raise violation if no allowed vehicles are specified', async () => {
    const policyNoVehicles: Policy = new Policy(trosNoAllowedVehicles);
    const permit = JSON.parse(JSON.stringify(validTros30Day));

    const validationResult = await policyNoVehicles.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });
});

describe('Permit Engine Validation Results Aggregator', () => {
  const policy: Policy = new Policy(allEventTypes);

  it('should process all event types', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));

    const validationResult = await policy.validate(permit);
    // Violation 1: expected structure
    // Violation 2: unknown event type (defaults to violation)
    expect(validationResult.violations).toHaveLength(2);
    expect(validationResult.requirements).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(1);
    // Message 1: expected structure
    // Message 2: params object, but no message property
    // Message 3: no params object in the event
    expect(validationResult.messages).toHaveLength(3);
  });
});
