import PermitType from "../../src/interface/permit-type.interface";
import Policy from "../../src/policy-engine"
import { fiveTypes } from "../policy-config/five-types.sample"

describe("Permit Engine Utility Functions", () => {
  const policy: Policy = new Policy(fiveTypes);

  it("should return the correct number of permit types", async () => {
    const permitTypes: Map<string, string> = policy.getPermitTypes();
    expect(permitTypes.size).toBe(5);
  });

  it("should return the correct number of geographic regions", async () => {
    const geographicRegions: Map<string, string> = policy.getGeographicRegions();
    expect(geographicRegions.size).toBe(3);
  });

  it("should return the correct number of commodities", async () => {
    const commodities: Map<string, string> = policy.getCommodities();
    expect(commodities.size).toBe(12);
  });

  it("should return the correct number of power unit types", async () => {
    const powerUnitTypes: Map<string, string> = policy.getPowerUnitTypes();
    expect(powerUnitTypes.size).toBe(3);
  });

  it("should return the correct number of trailer types", async () => {
    const trailerTypes: Map<string, string> = policy.getTrailerTypes();
    expect(trailerTypes.size).toBe(17);
  });

  it("should return a TROS permit type", async () => {
    const permitType: PermitType | null = policy.getPermitTypeDefinition('TROS');
    expect(permitType).not.toBeNull();
  });

  it("should return null for an unknown permit type", async () => {
    const permitType: PermitType | null = policy.getPermitTypeDefinition('__INVALID');
    expect(permitType).toBeNull();
  });
})