import { PAYMENT_METHOD_TYPE_CODE } from "../../../../common/types/paymentMethods";
import { calculateAmountForVoid, calculateNetAmount } from "../feeSummary";
import { PermitHistory } from "../../types/PermitHistory";
import { TRANSACTION_TYPES } from "../../types/payment";

const getPermitHistory = (
  overrides: Partial<PermitHistory> = {},
): PermitHistory => ({
  permitNumber: "P2-00000001-001",
  comment: null,
  commentUsername: "Test User",
  transactionAmount: 15,
  transactionOrderNumber: "TEST-ORDER",
  pgTransactionId: "12345",
  pgPaymentMethod: "CC",
  paymentCardTypeCode: "VI",
  paymentMethodTypeCode: PAYMENT_METHOD_TYPE_CODE.WEB,
  transactionTypeId: TRANSACTION_TYPES.P,
  permitId: 1,
  transactionSubmitDate: "2026-07-01T00:00:00.000Z",
  pgApproved: 1,
  creditAccountMismatch: false,
  creditAccountStatusType: null,
  egarmsReturnCode: null,
  ...overrides,
});

describe("feeSummary", () => {
  describe("calculateAmountForVoid", () => {
    it("refunds the full current permit value when voiding", () => {
      const transactionHistory = [getPermitHistory()];

      const currentPermitValue = calculateNetAmount(transactionHistory);
      const amountToRefund = -calculateAmountForVoid(transactionHistory);
      const newPermitValue = currentPermitValue + amountToRefund;

      expect(currentPermitValue).toBe(15);
      expect(newPermitValue).toBe(0);
      expect(amountToRefund).toBe(-15);
    });

    it("ignores failed web payment attempts", () => {
      const transactionHistory = [
        getPermitHistory({ pgApproved: 0, transactionAmount: 30 }),
        getPermitHistory(),
      ];

      expect(calculateAmountForVoid(transactionHistory)).toBe(15);
    });

    it("refunds the remaining net value after a previous refund", () => {
      const transactionHistory = [
        getPermitHistory({ transactionAmount: 20 }),
        getPermitHistory({
          transactionAmount: 5,
          transactionTypeId: TRANSACTION_TYPES.R,
        }),
      ];

      expect(calculateAmountForVoid(transactionHistory)).toBe(15);
    });

    it("returns zero for a no-fee or fully refunded permit", () => {
      const noFeeHistory = [getPermitHistory({ transactionAmount: 0 })];
      const fullyRefundedHistory = [
        getPermitHistory(),
        getPermitHistory({ transactionTypeId: TRANSACTION_TYPES.R }),
      ];

      expect(calculateAmountForVoid(noFeeHistory)).toBe(0);
      expect(calculateAmountForVoid(fullyRefundedHistory)).toBe(0);
    });
  });
});
