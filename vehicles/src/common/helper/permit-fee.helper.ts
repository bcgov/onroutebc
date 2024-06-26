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
  TROW_MAX_VALID_DURATION,
  TROW_MIN_VALID_DURATION,
  TROW_PRICE_PER_TERM,
  TROW_TERM,
} from '../constants/permit.constant';
import { differenceBetween } from './date-time.helper';
import * as dayjs from 'dayjs';
import { ApplicationStatus } from '../enum/application-status.enum';

/**
 * Calculates the permit fee based on the application and old amount.
 * @param application The permit application.
 * @param oldAmount The old amount of the permit.
 * @returns The calculated permit fee.
 * @throws {NotAcceptableException} If the duration is invalid for TROS permit type.
 * @throws {BadRequestException} If the permit type is not recognized.
 */
export const permitFee = (application: Permit, oldAmount?: number): number => {
  let duration = calculateDuration(application);
  switch (application.permitType) {
    case PermitType.TERM_OVERSIZE: {
      const validDuration = isValidDuration(
        duration,
        TROS_MIN_VALID_DURATION,
        TROS_MAX_VALID_DURATION,
      );
      if (!validDuration) {
        throw new BadRequestException(
          `Invalid duration (${duration} days) for ${application.permitType} permit type.`,
        );
      }
      // Adjusting duration for one year term permit
      if (yearlyPermit(duration)) duration = 360;
      if (
        leapYear(
          duration,
          application.permitData.startDate,
          application.permitData.expiryDate,
        )
      )
        duration = 360;
      return currentPermitFee(
        duration,
        TROS_PRICE_PER_TERM,
        TROS_TERM,
        oldAmount,
        application.permitStatus,
      );
    }
    case PermitType.TERM_OVERWEIGHT: {
      const validDuration = isValidDuration(
        duration,
        TROW_MIN_VALID_DURATION,
        TROW_MAX_VALID_DURATION,
      );
      if (!validDuration) {
        throw new BadRequestException(
          `Invalid duration (${duration} days) for ${application.permitType} permit type.`,
        );
      }
      // Adjusting duration for one year term permit
      if (yearlyPermit(duration)) duration = 360;
      if (
        leapYear(
          duration,
          application.permitData.startDate,
          application.permitData.expiryDate,
        )
      )
        duration = 360;
      return currentPermitFee(
        duration,
        TROW_PRICE_PER_TERM,
        TROW_TERM,
        oldAmount,
        application.permitStatus,
      );
    }
    default:
      throw new BadRequestException(
        `Invalid permit type: ${application.permitType}`,
      );
  }
};

export const yearlyPermit = (duration: number): boolean => {
  return duration <= 365 && duration >= 361;
};

export const calculateDuration = (application: Permit): number => {
  let startDate = application.permitData.startDate;
  const endDate = application.permitData.expiryDate;
  const today = dayjs(new Date()).format('YYYY-MM-DD');
  if (
    application.permitStatus === ApplicationStatus.VOIDED &&
    startDate < today
  )
    startDate = today;
  if (
    application.permitStatus === ApplicationStatus.VOIDED &&
    today === startDate
  )
    startDate = dayjs(today).add(1, 'day').format('YYYY-MM-DD');
  const duration = differenceBetween(startDate, endDate) + 1;
  return duration;
};

export const leapYear = (
  duration: number,
  startDate: string,
  expiryDate: string,
): boolean => {
  const start = dayjs(startDate, 'YYYY-MM-DD');
  const expiry = dayjs(expiryDate, 'YYYY-MM-DD');
  const isOneYear =
    start.add(1, 'year').subtract(1, 'day').toDate() === expiry.toDate();
  return duration === 366 && isOneYear;
};
export const isValidDuration = (
  duration: number,
  minDuration: number,
  maxDuration: number,
): boolean => {
  return duration >= minDuration && duration <= maxDuration;
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
  oldAmount?: number,
  permitStatus?: ApplicationStatus,
): number => {
  let permitTerms = Math.ceil(duration / allowedPermitTerm); // ex: if duraion is 40 days then charge for 60 days.
  if (permitStatus === ApplicationStatus.VOIDED) {
    permitTerms = Math.floor(duration / allowedPermitTerm); //ex: if duration is 40 days then refund only 30 days.
    return pricePerTerm * permitTerms * -1;
  }
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
