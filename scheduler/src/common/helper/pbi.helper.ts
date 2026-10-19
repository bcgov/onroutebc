import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { PbiPaymentDetailRecord } from '@common/interface/pbi-payment-detail-record.interface';
import { PBIFile } from '@modules/pbi/entities/pbi-file.entity';
import { PrepaidAccountDeposit } from '@app/modules/pbi/entities/prepaid-account-deposit.entity';

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

export const parsePbiPaymentDetailRecord = (
  line: string,
): PbiPaymentDetailRecord => {
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
  record: PbiPaymentDetailRecord,
  pbiFileId: string,
): PrepaidAccountDeposit => {
  const detail = new PrepaidAccountDeposit();

  detail.pbiFile = new PBIFile();
  detail.pbiFile.id = pbiFileId;
  detail.accountNumber = record.accountNumber;
  detail.depositAmount = record.depositAmountCents;
  detail.effectivePaymentDate = record.effectivePaymentDate;
  detail.depositDate = record.depositDate;

  return detail;
};
