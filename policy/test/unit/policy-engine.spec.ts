import Policy from "../../src/policy-engine"
import { trosOnly } from "../policy-config/tros-only.sample"
import { validTros30Day } from "../permit-app/valid-tros-30day"
import dayjs from "dayjs"

describe("Permit Engine Constructor", () => {
  it("should construct without error", () => {
    let policy: Policy;
    expect(() => {
      policy = new Policy(trosOnly);
    }).not.toThrow()

  })

  it("should assign policy definition correctly", () => {
    const policy: Policy = new Policy(trosOnly);
    expect(policy.policyDefinition).toBeTruthy();
  })
})

describe("Permit Engine Validator", () => {
  const policy: Policy = new Policy(trosOnly);

  it("should validate TROS successfully", async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format('YYYY-MM-DD');

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should raise violation for start date in the past', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to yesterday
    permit.permitData.startDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

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
})