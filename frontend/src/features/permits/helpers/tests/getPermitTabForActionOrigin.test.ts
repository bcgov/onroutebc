import { getPermitTabForActionOrigin } from "../getPermitTabForActionOrigin";
import { PERMIT_ACTION_ORIGINS } from "../../types/PermitActionOrigin";
import { PERMIT_TABS } from "../../types/PermitTabs";

describe("getPermitTabForActionOrigin", () => {
  it("maps the Active Permits origin to the Active Permits tab", () => {
    expect(
      getPermitTabForActionOrigin(PERMIT_ACTION_ORIGINS.ACTIVE_PERMITS),
    ).toBe(PERMIT_TABS.ACTIVE_PERMITS);
  });

  it("maps the Expired Permits origin to the Expired Permits tab", () => {
    expect(
      getPermitTabForActionOrigin(PERMIT_ACTION_ORIGINS.EXPIRED_PERMITS),
    ).toBe(PERMIT_TABS.EXPIRED_PERMITS);
  });

  it.each([PERMIT_ACTION_ORIGINS.GLOBAL_SEARCH, PERMIT_ACTION_ORIGINS.AIP])(
    "does not map the %s origin to a permit-list tab",
    (origin) => {
      expect(getPermitTabForActionOrigin(origin)).toBeUndefined();
    },
  );
});
