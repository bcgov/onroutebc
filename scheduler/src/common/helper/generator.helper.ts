/**
 * This CGI file generator executes the process of generating and uploading CGI files using a cron job that configured in the transaction service.
 * The workflow involves generating CGI files based on transaction details and uploading them to an SFTP server.
 *
 * Workflow Steps
 *
 * 1. Cron Job Scheduling
 *    - A cron job is configured to run at 5:30 PM on workdays (Monday to Friday).
 *    - The cron job initiates the CGI file generation and uploading process.
 *
 * 2. Transaction Data Retrieval
 *    - The CGI file generator script is executed by the cron job.
 *    - The script queries the [ORBC_CFS_TRANSACTION_DETAIL] table in the database to retrieve transactions with a status marked as "READY".
 *
 * 3. CGI File Generation
 *    - For each "READY" transaction, the CGI file generator:
 *      - Populates the CGI file with the necessary transaction data (batch header, journal header and journal details) according to the predefined CGI file layout.
 *      - Creates a corresponding CGI trigger file to indicate that the transfer of INBOX file(s) is complete.
 *
 * 4. Temporary Storage
 *    - The generated CGI files and their associated trigger files are temporarily stored in a designated local directory.
 *
 * 5. Uploading to SFTP Server
 *    - The CGI file generator script establishes a connection to the SFTP server.
 *    - The script uploads the CGI files and trigger files to the appropriate directory on the SFTP server.
 *
 * 6. Completion
 *    - Once all files are uploaded, the script terminates.
 *    - The cron job completes its execution for the day.
 *
 * Future Enhancements
 *
 * The current workflow does not include file verification, error handling, or notifications. These features can be added in future iterations to improve reliability and transparency:
 *
 * - File Verification
 *   - Implement checks to ensure that generated CGI files match expected formats and data integrity is maintained before uploading.
 *
 * - Error Handling
 *   - Incorporate mechanisms to handle errors during file generation and upload processes.
 *   - Implement retry logic for transient errors.
 *
 * - Notifications
 *   - Set up notifications to alert relevant personnel in case of errors or successful completions.
 */

import { CgiSftpService } from 'src/modules/cgi-sftp/cgi-sftp.service';
import { CgiConstants } from 'src/common/constants/cgi.constant';
import dayjs from 'dayjs';
import { Transaction } from 'src/modules/common/entities/transaction.entity';
import { TransactionType } from 'src/common/enum/transaction-type.enum';
import { GlCodeType } from 'src/modules/common/entities/gl-code-type.entity';

export function formatDateToCustomString(date: Date): string {
  return dayjs(date).format('YYYYMMDDHHmmss');
}
let journalName;

export function getFiscalYear(): number {
  const currentYear = new Date().getFullYear();
  return currentYear + 1;
}

export function getBatchNumber(batchCounter: number): string {
  return batchCounter.toString().padStart(9, '0');
}

export const getJournalName = (): string => {
  const prefix = CgiConstants.PREFIX;
  const randomChars = generateRandomNum(8);
  const journalName: string = prefix + randomChars;
  return journalName;
};

export const generateRandomNum = (length: number): string => {
  const randoms = Array.from({ length: length }, () =>
    Math.floor(Math.random() * 10),
  );
  return randoms.join('');
};

export const getJournalBatchName = (): string => {
  // 25 characters
  const prefix = CgiConstants.PREFIX; // Ministry Alpha identifier prefix
  const randomChars = generateRandomNum(23); // Generate 23 random characters
  return prefix + randomChars;
};

export function getControlTotal(transaction: Transaction): string {
  // 15 characters
  const total = Number(transaction.totalTransactionAmount);
  let totalString: string = total.toFixed(2);
  const integerPartLength: number = totalString.length;
  const paddingLength: number = 15 - integerPartLength;
  if (paddingLength > 0) {
    totalString = totalString.padStart(totalString.length + paddingLength, ' ');
  }
  return totalString;
}

export function getExternalReferenceSource(): string {
  // 100 chars, optional
  // return `QP`;
  return ``;
}

export function getFlowThru(length: number): string {
  return ' '.repeat(length);
}

export function getJvLineNumber(jvLineNumberCounter: number): string {
  return String(jvLineNumberCounter).padStart(5, '0');
}

export function getGlEffectiveDate(): string {
  const currentDate: Date = new Date();
  const year: number = currentDate.getFullYear();
  const month: string = (currentDate.getMonth() + 1)
    .toString()
    .padStart(2, '0'); // Month is zero-based
  const day: string = currentDate.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
}

export function getUnusedFiller(): string {
  // 16 chars
  return `0`.repeat(16);
}

export function getLineDescription(): string {
  // 100 chars
  return ` `.repeat(100);
}

export function getFeederNumberClientSystem(): string {
  // 4 chars
  return `0`.repeat(4);
}

export function getControlCount(transaction: Transaction): string {
  // 15 chars
  // Add 2 to the number of permit transactions to account for the
  // balancing journal detail line and the journal header line
  const numberStr = transaction.permitTransactions.length + 2;
  const desiredLength = 15;
  const paddedString = numberStr.toString().padStart(desiredLength, '0');
  return paddedString;
}

export const populateBatchHeader = (batchNumberCounter: number): string => {
  const feederNumber = '3535';
  const batchType: string = CgiConstants.BATCH_TYPE;
  const transactionType: string = CgiConstants.TRANSACTION_TYPE_BH;
  const delimiterHex = 0x1d;
  const delimiter = String.fromCharCode(delimiterHex);
  const fiscalYear: number = getFiscalYear();
  const batchNumber: string = getBatchNumber(batchNumberCounter);
  const messageVersion: string = CgiConstants.MESSAGE_VERSION;
  const batchHeader =
    feederNumber +
    batchType +
    transactionType +
    delimiter +
    feederNumber +
    fiscalYear +
    batchNumber +
    messageVersion +
    delimiter +
    `\n`;
  return batchHeader;
};

export const populateJournalHeader = (transaction: Transaction): string => {
  const feederNumber = '3535';
  const batchType: string = CgiConstants.BATCH_TYPE;
  const transactionType: string = CgiConstants.TRANSACTION_TYPE_JH;
  const delimiterHex = 0x1d;
  const delimiter = String.fromCharCode(delimiterHex);
  journalName = getJournalName();
  const journalBatchName: string = getJournalBatchName();
  const controlTotal: string = getControlTotal(transaction);
  const recordType: string = CgiConstants.RECORD_TYPE;
  const countryCurrencyCode: string = CgiConstants.COUNTRY_CURRENCY_CODE;
  const externalReferenceSource: string = getExternalReferenceSource();
  const flowThru: string = getFlowThru(110);
  const journalHeader =
    feederNumber +
    batchType +
    transactionType +
    delimiter +
    journalName +
    journalBatchName +
    controlTotal +
    recordType +
    countryCurrencyCode +
    externalReferenceSource +
    flowThru +
    delimiter +
    `\n`;
  return journalHeader;
};

export const populateJournalVoucherDetail = (
  transaction: Transaction,
  glCode: GlCodeType,
  lastJVDline?: boolean,
  lastJVDCounter?: number,
): string => {
  const feederNumber = '3535';
  const batchType: string = CgiConstants.BATCH_TYPE;
  const delimiterHex = 0x1d;
  const delimiter = String.fromCharCode(delimiterHex);;
  const flowThru: string = getFlowThru(110);
  const glEffectiveDate: string = getGlEffectiveDate();
  const client: string = glCode.client;
  const responsibility: string = glCode.responsibility; //getResponsibility();
  const serviceLine: string = glCode.serviceLine; //getServiceLine();
  const stob: string = glCode.stob; //getStob();
  const project: string = glCode.project;
  const location: string = glCode.location;
  const future: string = glCode.future;
  const unusedFiller: string = getUnusedFiller();
  const supplierNumber = 'abcdefghi';
  const isRefund = transaction.transactionTypeId === TransactionType.REFUND;
  const lineCode: string =
    isRefund === !!lastJVDCounter
      ? CgiConstants.LINE_CODE_CREDIT
      : CgiConstants.LINE_CODE_DEBIT;
  const lineDescription: string = getLineDescription();
  const transactionType = CgiConstants.TRANSACTION_TYPE_JD;
  let journalVoucher = '';
  let jvLineNumberCounter = 0;
  const lineTotal = getControlTotal(transaction);
  if (lastJVDline) {
    const jvLineNumber = getJvLineNumber(lastJVDCounter);
    journalVoucher += `${feederNumber}`;
    journalVoucher += `${batchType}`;
    journalVoucher += `${transactionType}`;
    journalVoucher += `${delimiter}`;
    journalVoucher += `${journalName}`;
    journalVoucher += `${jvLineNumber}`;
    journalVoucher += `${glEffectiveDate}`;
    journalVoucher += `${client}`;
    journalVoucher += `${responsibility}`;
    journalVoucher += `${serviceLine}`;
    journalVoucher += `${stob}`;
    journalVoucher += `${project}`;
    journalVoucher += `${location}`;
    journalVoucher += `${future}`;
    journalVoucher += `${unusedFiller}`;
    journalVoucher += `${supplierNumber}`;
    journalVoucher += `${lineTotal}`;
    journalVoucher += `${lineCode}`;
    journalVoucher += `${lineDescription}`;
    journalVoucher += `${flowThru}`;
    journalVoucher += `${delimiter}`;
    journalVoucher += `\n`;
  } else {
    for (const permitTransaction of transaction.permitTransactions) {
      const jvLineNumber = getJvLineNumber(++jvLineNumberCounter);
      const lineTotal = getLineTotal(permitTransaction.transactionAmount);
      journalVoucher += `${feederNumber}`;
      journalVoucher += `${batchType}`;
      journalVoucher += `${transactionType}`;
      journalVoucher += `${delimiter}`;
      journalVoucher += `${journalName}`;
      journalVoucher += `${jvLineNumber}`;
      journalVoucher += `${glEffectiveDate}`;
      journalVoucher += `${client}`;
      journalVoucher += `${responsibility}`;
      journalVoucher += `${serviceLine}`;
      journalVoucher += `${stob}`;
      journalVoucher += `${project}`;
      journalVoucher += `${location}`;
      journalVoucher += `${future}`;
      journalVoucher += `${unusedFiller}`;
      journalVoucher += `${supplierNumber}`;
      journalVoucher += `${lineTotal}`;
      journalVoucher += `${lineCode}`;
      journalVoucher += `${lineDescription}`;
      journalVoucher += `${flowThru}`;
      journalVoucher += `${delimiter}`;
      journalVoucher += `\n`;
      // fs.appendFileSync(cgiFileName, journalVoucher);
    }
  }
  return journalVoucher;
};

export function getLineTotal(total: number) {
  let totalString: string = total.toFixed(2); // Ensure two decimal places
  const integerPartLength: number = totalString.length;
  const paddingLength: number = 15 - integerPartLength;

  if (paddingLength > 0) {
    totalString = totalString.padStart(totalString.length + paddingLength, ' ');
  }
  return totalString;
}

export function populateBatchTrailer(
  transaction: Transaction,
  batchNumberCounter: number,
): string {
  const feederNumber = '3535';
  const batchType: string = CgiConstants.BATCH_TYPE;
  const transactionType: string = CgiConstants.TRANSACTION_TYPE_BT;
  const delimiterHex = 0x1d;
  const delimiter = String.fromCharCode(delimiterHex);;
  const fiscalYear: number = getFiscalYear();
  const batchNumber: string = getBatchNumber(batchNumberCounter);
  const controlTotal: string = getControlTotal(transaction);
  const feederNumberClientSystem: string = getFeederNumberClientSystem();
  const controlCount: string = getControlCount(transaction);

  const batchTrailer =
    feederNumber +
    batchType +
    transactionType +
    delimiter +
    feederNumber +
    fiscalYear +
    batchNumber +
    controlCount +
    controlTotal +
    feederNumberClientSystem +
    delimiter +
    `\n`;
  return batchTrailer;
}

export async function uploadFile(
  file: string,
  fileData: Buffer,
): Promise<string[]> {
  const uploadedFiles: string[] = [];
  try {
    const cgiSftpService: CgiSftpService = new CgiSftpService();
    await cgiSftpService.upload(fileData, file);
    uploadedFiles.push(file); // Collect the uploaded file names
  } catch (err) {
    console.error('Error uploading files:', err);
  }

  return uploadedFiles; // Return the list of uploaded files
}
