import {
  getPermitRowActionOptions,
  PermitActionPermissions,
} from "../getPermitActionOptions";
import { PERMIT_ACTION_TYPES } from "../../types/PermitActionType";
import { PERMIT_APPROVAL_SOURCES } from "../../types/PermitApprovalSource";
import { PERMIT_STATUSES } from "../../types/PermitStatus";

const allPermissions: PermitActionPermissions = {
  canResendPermit: true,
  canViewPermitReceipt: true,
  canViewExpiredPermitReceipt: true,
  canAmendPermit: true,
  canVoidPermit: true,
  canCopyPermit: true,
};

const getActionValues = (
  options: ReturnType<typeof getPermitRowActionOptions>,
) => options.map(({ value }) => value);

describe("getPermitRowActionOptions", () => {
  it("offers Amend and Void/Revoke for an eligible expired permit", () => {
    const options = getPermitRowActionOptions({
      isPermitInactiveOrExpired: true,
      permitStatus: PERMIT_STATUSES.ISSUED,
      permitApprovalSource: PERMIT_APPROVAL_SOURCES.PPC,
      permissions: allPermissions,
    });

    expect(getActionValues(options)).toContain(PERMIT_ACTION_TYPES.AMEND);
    expect(getActionValues(options)).toContain(PERMIT_ACTION_TYPES.VOID_REVOKE);
  });

  it.each([
    [PERMIT_STATUSES.REVOKED, PERMIT_APPROVAL_SOURCES.PPC],
    [PERMIT_STATUSES.VOIDED, PERMIT_APPROVAL_SOURCES.PPC],
    [PERMIT_STATUSES.SUPERSEDED, PERMIT_APPROVAL_SOURCES.PPC],
    [PERMIT_STATUSES.ISSUED, PERMIT_APPROVAL_SOURCES.TPS],
  ] as const)(
    "does not offer Amend or Void/Revoke for %s/%s permits",
    (permitStatus, permitApprovalSource) => {
      const options = getPermitRowActionOptions({
        isPermitInactiveOrExpired: true,
        permitStatus,
        permitApprovalSource,
        permissions: allPermissions,
      });
      const actionValues = getActionValues(options);

      expect(actionValues).not.toContain(PERMIT_ACTION_TYPES.AMEND);
      expect(actionValues).not.toContain(PERMIT_ACTION_TYPES.VOID_REVOKE);
    },
  );

  it("applies Amend and Void/Revoke permissions independently", () => {
    const options = getPermitRowActionOptions({
      isPermitInactiveOrExpired: true,
      permitStatus: PERMIT_STATUSES.ISSUED,
      permitApprovalSource: PERMIT_APPROVAL_SOURCES.AUTO,
      permissions: {
        ...allPermissions,
        canAmendPermit: false,
      },
    });
    const actionValues = getActionValues(options);

    expect(actionValues).not.toContain(PERMIT_ACTION_TYPES.AMEND);
    expect(actionValues).toContain(PERMIT_ACTION_TYPES.VOID_REVOKE);
  });

  it("uses the expired receipt permission for inactive or expired permits", () => {
    const options = getPermitRowActionOptions({
      isPermitInactiveOrExpired: true,
      permitStatus: PERMIT_STATUSES.REVOKED,
      permitApprovalSource: PERMIT_APPROVAL_SOURCES.PPC,
      permissions: {
        ...allPermissions,
        canViewPermitReceipt: false,
        canViewExpiredPermitReceipt: true,
      },
    });

    expect(getActionValues(options)).toContain(
      PERMIT_ACTION_TYPES.VIEW_RECEIPT,
    );
  });
});
