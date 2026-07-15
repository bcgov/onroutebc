import { isPermitEligibleForAmendOrRevokeActions } from "../isPermitEligibleForAmendOrRevokeActions";
import { PERMIT_APPROVAL_SOURCES } from "../../types/PermitApprovalSource";
import { PERMIT_STATUSES } from "../../types/PermitStatus";

describe("isPermitEligibleForAmendOrRevokeActions", () => {
  it.each([PERMIT_APPROVAL_SOURCES.AUTO, PERMIT_APPROVAL_SOURCES.PPC] as const)(
    "allows issued %s permits",
    (permitApprovalSource) => {
      expect(
        isPermitEligibleForAmendOrRevokeActions(
          PERMIT_STATUSES.ISSUED,
          permitApprovalSource,
        ),
      ).toBe(true);
    },
  );

  it("rejects issued TPS permits", () => {
    expect(
      isPermitEligibleForAmendOrRevokeActions(
        PERMIT_STATUSES.ISSUED,
        PERMIT_APPROVAL_SOURCES.TPS,
      ),
    ).toBe(false);
  });

  it.each([
    PERMIT_STATUSES.REVOKED,
    PERMIT_STATUSES.VOIDED,
    PERMIT_STATUSES.SUPERSEDED,
  ] as const)("rejects %s permits", (permitStatus) => {
    expect(
      isPermitEligibleForAmendOrRevokeActions(
        permitStatus,
        PERMIT_APPROVAL_SOURCES.PPC,
      ),
    ).toBe(false);
  });
});
