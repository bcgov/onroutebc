import { Policy } from "../../policy-engine";
import { stosPolicyConfig } from "../policy-config/stos-vehicle-config.sample";

describe('Permit Engine Size Dimension Functions', () => {
  const policy: Policy = new Policy(stosPolicyConfig);

  it('should assume all regions if none are supplied', async () => {
    // This configuration has minimum values pulled from multiple regions
    const sizeDimension = policy.getSizeDimension('STOS', 'EMPTYXX', ['PICKRTT', 'JEEPSRG', 'HIBOEXP']);
    expect(sizeDimension?.height).toBe(4.0);
    expect(sizeDimension?.width).toBe(2.5);
    expect(sizeDimension?.length).toBe(24);
  });

  it('should retrieve correct values for a single specified region', async () => {
    const sizeDimension = policy.getSizeDimension('STOS', 'EMPTYXX', ['PICKRTT', 'JEEPSRG', 'HIBOEXP'], ['PCE']);
    expect(sizeDimension?.height).toBe(5.33);
    expect(sizeDimension?.width).toBe(2.8);
    expect(sizeDimension?.length).toBe(27.5);
  });

  it('should retrieve correct values for a configuration with modifier', async () => {
    const sizeDimension = policy.getSizeDimension('STOS', 'EMPTYXX', ['TRKTRAC', 'JEEPSRG', 'HIBOEXP']);
    expect(sizeDimension?.height).toBe(4.4);
    expect(sizeDimension?.width).toBe(2.6);
    expect(sizeDimension?.length).toBe(31);
  });

  it('should revert to global defaults if no specific values configured', async () => {
    const sizeDimension = policy.getSizeDimension('STOS', 'EMPTYXX', ['TRKTRAC', 'LOGOWBK']);
    expect(sizeDimension?.frontProjection).toBe(3);
    expect(sizeDimension?.rearProjection).toBe(6.5);
    expect(sizeDimension?.height).toBe(4.15);
    expect(sizeDimension?.width).toBe(2.6);
    expect(sizeDimension?.length).toBe(31);
  });

  it('should return default values if an unconfigured region is specified', async () => {
    const sizeDimension = policy.getSizeDimension('STOS', 'EMPTYXX', ['TRKTRAC', 'JEEPSRG', 'STWHELR'], ['LMN']);
    expect(sizeDimension?.height).toBe(4.88);
    expect(sizeDimension?.width).toBe(3.2);
    expect(sizeDimension?.length).toBe(27.5);
  });

  it('should return default values if an invalid region is specified', async () => {
    const sizeDimension = policy.getSizeDimension('STOS', 'EMPTYXX', ['TRKTRAC', 'JEEPSRG', 'STWHELR'], ['_INVALID']);
    expect(sizeDimension?.height).toBe(4.88);
    expect(sizeDimension?.width).toBe(3.2);
    expect(sizeDimension?.length).toBe(27.5);
  });

  it('should return null if an invalid permit type is specified', async () => {
    const sizeDimension = policy.getSizeDimension('_INVALID', 'EMPTYXX', ['TRKTRAC', 'JEEPSRG', 'STWHELR']);
    expect(sizeDimension).toBeNull();
  });

  it('should return null if an invalid configuration is specified', async () => {
    const sizeDimension = policy.getSizeDimension('STOS', 'EMPTYXX', ['_INVALID', 'JEEPSRG', 'STWHELR']);
    expect(sizeDimension).toBeNull();
  });

  it('should return null if no dimensionable trailer is specified', async () => {
    const sizeDimension = policy.getSizeDimension('STOS', 'EMPTYXX', ['TRKTRAC', 'JEEPSRG']);
    expect(sizeDimension).toBeNull();
  });

  it('should return null if an invalid commodity is specified', async () => {
    const sizeDimension = policy.getSizeDimension('STOS', '_INVALID', ['TRKTRAC', 'JEEPSRG']);
    expect(sizeDimension).toBeNull();
  });
});