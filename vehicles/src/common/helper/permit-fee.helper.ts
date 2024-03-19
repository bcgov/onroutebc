import { TransactionType } from '../enum/transaction-type.enum';
import { PermitHistoryDto } from 'src/modules/permit-application-payment/permit/dto/response/permit-history.dto';
import { BadRequestException, NotAcceptableException } from '@nestjs/common';
import { Permit } from 'src/modules/permit-application-payment/permit/entities/permit.entity';
import { PermitType } from '../enum/permit-type.enum';
import {
  TROS_MAX_VALID_DURATION,
  TROS_MIN_VALID_DURATION,
  TROS_PRICE_PER_TERM,
  TROS_TERM,
} from '../constants/permit.constant';
import { differenceBetween } from './date-time.helper';

/**
 * Calculates the permit fee based on the application and old amount.
 * @param application The permit application.
 * @param oldAmount The old amount of the permit.
 * @returns The calculated permit fee.
 * @throws {NotAcceptableException} If the duration is invalid for TROS permit type.
 * @throws {BadRequestException} If the permit type is not recognized.
 */
export const permitFee = (application: Permit, oldAmount: number): number => {
  let duration =
    differenceBetween(
      application.permitData.startDate,
      application.permitData.expiryDate,
    ) + 1;

  switch (application.permitType) {
    case PermitType.TERM_OVERSIZE:
      if (
        duration < TROS_MIN_VALID_DURATION ||
        duration >= TROS_MAX_VALID_DURATION
      ) {
        throw new NotAcceptableException(
          `Invalid duration (${duration} days) for TROS permit type.`,
        );
      }
      // Adjusting duration for one year term permit
      if (duration <= 365 && duration >= 361) duration = 360;
      return currentPermitFee(
        duration,
        TROS_PRICE_PER_TERM,
        TROS_TERM,
        oldAmount,
      );
    case PermitType.TERM_OVERWEIGHT:
      // Handle TERM_OVERWEIGHT case
      break;
    default:
      throw new BadRequestException(
        `Invalid permit type: ${application.permitType}`,
      );
  }
};

/**
 * Calculates the permit fee based on the provided duration, price per term, permit type term, and old amount.
 *
 * @param {number} duration The duration for which the permit is required.
 * @param {number} pricePerTerm The price per term of the permit.
 * @param {number} allowedPermitTerm The term of the permit type.
 * @param {number} oldAmount The old amount (if any) for the permit.
 * @returns {number} The calculated permit fee.
 */
export const currentPermitFee = (
  duration: number,
  pricePerTerm: number,
  allowedPermitTerm: number,
  oldAmount: number,
): number => {
  const permitTerms = Math.ceil(duration / allowedPermitTerm);
  return oldAmount > 0
    ? pricePerTerm * permitTerms - oldAmount
    : pricePerTerm * permitTerms + oldAmount;
};

export const calculatePermitAmount = (
  permitPaymentHistory: PermitHistoryDto[],
): number => {
  let amount = 0;
  for (const payment of permitPaymentHistory) {
    switch (payment.transactionTypeId) {
      case TransactionType.REFUND:
        amount -= payment.transactionAmount;
        break;
      case TransactionType.PURCHASE:
        amount += payment.transactionAmount;
        break;
      case TransactionType.VOID_PURHCASE:
      case TransactionType.VOID_REFUND:
        throw new NotAcceptableException();
      default:
        throw new NotAcceptableException();
    }
  }

  return amount;
};
