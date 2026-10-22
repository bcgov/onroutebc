import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { BpiPaymentDetailRecord } from '@app/common/interface/bpi-payment-detail-record.interface';
import { BPIFile } from '@app/modules/bpi/entities/bpi-file.entity';
import { PrepaidAccountDeposit } from '@app/modules/bpi/entities/prepaid-account-deposit.entity';

dayjs.extend(customParseFormat);

export const parseFixedWidthDate = (value: string): string => {
  const parsedDate = dayjs(value, 'YYYYMMDD', true);

  if (!parsedDate.isValid()) {
    throw new Error(`Invalid date ${value}`);
  }

  return parsedDate.format('YYYY-MM-DD');
};

export const extractFixedWidthField = (
  line: string,
  startPosition: number,
  length: number,
): string => {
  return line.slice(startPosition - 1, startPosition - 1 + length).trimEnd();
};

export const parseBpiPaymentDetailRecord = (
  line: string,
): BpiPaymentDetailRecord => {
  return {
    accountNumber: extractFixedWidthField(line, 45, 20),
    depositAmountCents: Number(extractFixedWidthField(line, 65, 11)) / 100,
    effectivePaymentDate: parseFixedWidthDate(
      extractFixedWidthField(line, 81, 8),
    ),
    depositDate: parseFixedWidthDate(extractFixedWidthField(line, 97, 8)),
  };
};

export const mapToPrepaidAccountDetail = (
  record: BpiPaymentDetailRecord,
  bpiFileId: string,
): PrepaidAccountDeposit => {
  const detail = new PrepaidAccountDeposit();

  detail.bpiFile = new BPIFile();
  detail.bpiFile.id = bpiFileId;
  detail.accountNumber = record.accountNumber;
  detail.depositAmount = record.depositAmountCents;
  detail.effectivePaymentDate = record.effectivePaymentDate;
  detail.depositDate = record.depositDate;

  return detail;
};
