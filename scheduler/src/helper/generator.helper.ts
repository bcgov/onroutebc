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

import * as fs from 'fs';
import { join} from 'path';
import { CgiSftpService } from "src/modules/cgi-sftp/cgi-sftp.service";
import { Transaction } from "src/modules/transactions/transaction.entity";
import { Readable } from "typeorm/platform/PlatformTools";
import { CgiConstants } from "src/common/constants/cgi.constant";
import { randomBytes } from 'crypto';

const maxBatchId = '';

class BatchHeader {
  feederNumber: string;
  batchType: string;
  transactionType: string;
  fiscalYear: number;
  batchNumber: string;
  messageVersion: string;

  constructor() {
    this.feederNumber = process.env.FEEDER_NUMBER;
    this.batchType = CgiConstants.BATCH_TYPE;
    this.transactionType = CgiConstants.TRANSACTION_TYPE_BH;
    this.fiscalYear = getFiscalYear();
    this.batchNumber = getBatchNumber();
    this.messageVersion = CgiConstants.MESSAGE_VERSION;
  } 
}

  export function formatDateToCustomString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  
  export function getFiscalYear(): number {
    const currentYear = new Date().getFullYear();
    return currentYear + 1;
  }
  
  let batchCounter = 0;

  export function getBatchNumber(): string {
    batchCounter++;
    return batchCounter.toString().padStart(9, '0');
  }
  
  // Journal name: 10 characters
  let globalJournalName = '';
  
  export function getJournalName(): string {
    const prefix = CgiConstants.PREFIX;
    const randomChars = generateRandomChars(8); 
    const journalName: string = prefix + randomChars;
    return journalName;
  }
  
export function generateRandomChars(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  const maxByteValue = 256; // 8 bits, since randomBytes returns bytes with values 0-255
  const threshold = Math.floor(maxByteValue / charactersLength) * charactersLength;

  let result = '';

  // Generate random values
  const randomValues = randomBytes(length);

  for (let i = 0; i < length; i++) {
    let randomValue;
    do {
      randomValue = randomValues[i];
    } while (randomValue >= threshold);
    
    result += characters[randomValue % charactersLength];
  }

  return result;
}
  
  export function getJournalBatchName(): string {
    // 25 characters
    const prefix = CgiConstants.PREFIX; // Ministry Alpha identifier prefix
    const randomChars = generateRandomChars(23); // Generate 23 random characters
    return prefix + randomChars;
  }
  
  export function getControlTotal(transactions: Transaction[]): string {
    // 15 characters
    let total = 0.0;
    for (const transaction of transactions) {
      if(transaction.TRANSACTION_TYPE === `R`)
        if(transaction.TOTAL_TRANSACTION_AMOUNT > 0.0)
          transaction.TOTAL_TRANSACTION_AMOUNT = 0.0 - transaction.TOTAL_TRANSACTION_AMOUNT;
      total += Number(transaction.TOTAL_TRANSACTION_AMOUNT);
    }
  
    let totalString: string = total.toFixed(2); 
    const isNegative: boolean = totalString.startsWith('-');
    const integerPartLength: number = isNegative ? totalString.length - 1 : totalString.length;
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
  
  let jvLineNumberCounter = 0;
  
  export function getJvLiineNumber(): string {
    // 5 chars
    jvLineNumberCounter++;
    return String(jvLineNumberCounter).padStart(5, '0');
  }
  
  export function getGlEffectiveDate(): string {
    const currentDate: Date = new Date();
    const year: number = currentDate.getFullYear();
    const month: string = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day: string = currentDate.getDate().toString().padStart(2, '0');
  
    return `${year}${month}${day}`;
  }
  
  export function getAck(): string {
    // 50 chars
    // Client - (3 Characters)
    // Responsibility - (5 Characters)
    // Service Line - (5 Characters)
    // STOB - (4 Characters)
    // Project - (7 Characters)
    // Location - (6 Characters)
    // Future - (4 Characters)
    // Unused Filler - (16 Characters)
    const client = CgiConstants.CLIENT;
    const responsibility = CgiConstants.RESPONSIBILITY;
    const serviceLine = CgiConstants.SERVICE_LINE;
    const stob = CgiConstants.STOB;
    const project = CgiConstants.PROJECT;
    const location = getLocation();
    const future = CgiConstants.FUTURE;
    const unusedFiller = ' '.repeat(16);
    let result = '';
    result = result + client + responsibility + serviceLine + stob + project + location + future + unusedFiller;
    return result;
  }
  
  export function getLocation(): string {
    // 6 chars
    return `0`.repeat(6);
  }
  
  export function getFuture(): string {
    // 4 chars
    return `0`.repeat(4);
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
  
  export function getControlCount(transactions: Transaction[]): string {
    // 15 chars
    const numberStr = transactions.length.toString();
    const desiredLength = 15;
    const paddedString = numberStr.padStart(desiredLength, '0');
    return paddedString;
    
  }
  
  export function populateBatchHeader(): string {
    let batchHeader = ``;
    const feederNumber: string = process.env.FEEDER_NUMBER;
    const batchType: string = CgiConstants.BATCH_TYPE;
    const transactionType: string = CgiConstants.TRANSACTION_TYPE_BH;
    const delimiterHex = 0x1D;
    const delimiter = String.fromCharCode(delimiterHex);
    const fiscalYear: number = getFiscalYear();
    const batchNumber: string = getBatchNumber();
    const messageVersion: string = CgiConstants.MESSAGE_VERSION;
    batchHeader = batchHeader + feederNumber + batchType + transactionType + delimiter + feederNumber + fiscalYear + batchNumber + messageVersion + delimiter + `\n`;
    const bt: BatchHeader = new BatchHeader();
    bt.feederNumber = feederNumber;
    bt.batchType = batchType;
    bt.transactionType = transactionType;
    bt.fiscalYear = fiscalYear;
    bt.batchNumber = batchNumber;
    bt.messageVersion = messageVersion;
    return batchHeader;
  }

  export function populateJournalHeader(transactions: Transaction[]): string {
  let journalHeader = ``;
  const feederNumber: string = process.env.FEEDER_NUMBER;
  const batchType: string = CgiConstants.BATCH_TYPE;
  const transactionType: string = CgiConstants.TRANSACTION_TYPE_JH;
  const delimiterHex = 0x1D;
  const delimiter = String.fromCharCode(delimiterHex);
  const journalName: string = globalJournalName;
  const journalBatchName: string = getJournalBatchName();
  const controlTotal: string = getControlTotal(transactions);
  const recordType: string = CgiConstants.RECORD_TYPE;
  const countryCurrencyCode: string = CgiConstants.COUNTRY_CURRENCY_CODE;
  const externalReferenceSource: string = getExternalReferenceSource();
  const flowThru: string = getFlowThru(110);
  journalHeader = journalHeader + feederNumber + batchType + transactionType + delimiter + journalName + journalBatchName + controlTotal
    + recordType + countryCurrencyCode + externalReferenceSource + flowThru + delimiter + `\n`;
  return journalHeader;
}

export function populateJournalVoucherDetail(cgiFileName: string, transactions: Transaction[]): void {
  const feederNumber: string = process.env.FEEDER_NUMBER;
  const batchType: string = CgiConstants.BATCH_TYPE;
  const delimiterHex = 0x1D;
  const delimiter = String.fromCharCode(delimiterHex);
  const journalName: string = globalJournalName;
  const flowThru: string = getFlowThru(110);
  const jvLineNumber: string = getJvLiineNumber();
  const glEffectiveDate: string = getGlEffectiveDate();
  const ack: string = getAck();
  console.log(ack);
  const client: string = CgiConstants.CLIENT;
  const responsibility: string = CgiConstants.RESPONSIBILITY;//getResponsibility();
  const serviceLine: string = CgiConstants.SERVICE_LINE;//getServiceLine();
  const stob: string = CgiConstants.STOB;//getStob();
  const project: string = CgiConstants.PROJECT;
  const location: string = getLocation();
  const future: string = getFuture();
  const unusedFiller: string = getUnusedFiller();
  const supplierNumber: string = process.env.SUPPLIER_NUMBER;
  const lineCode: string = CgiConstants.LINE_CODE;//getLineCode();
  const lineDescription: string = getLineDescription();

  for (const transaction of transactions) {
    const transactionType = transaction.TRANSACTION_TYPE;
    let lineTotal = '';    
    lineTotal = getLineTotle(transaction.TOTAL_TRANSACTION_AMOUNT);
    let journalVoucher = `${feederNumber}`;
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

    fs.appendFileSync(cgiFileName, journalVoucher);
  }
}

export function getLineTotle(total: number) {
  let totalString: string = total.toFixed(2); // Ensure two decimal places
    const isNegative: boolean = totalString.startsWith('-');
    const integerPartLength: number = isNegative ? totalString.length - 1 : totalString.length;
    const paddingLength: number = 15 - integerPartLength;
  
    if (paddingLength > 0) {
      totalString = totalString.padStart(totalString.length + paddingLength, ' ');
    }
  
    return totalString;

}

export function populateBatchTrailer(transactions: Transaction[]): string {
  let batchTrailer = ``;
  const feederNumber: string = process.env.FEEDER_NUMBER;
  const batchType: string = CgiConstants.BATCH_TYPE;
  const transactionType: string = CgiConstants.TRANSACTION_TYPE_BT;
  const delimiterHex = 0x1D;
  const delimiter = String.fromCharCode(delimiterHex);
  const fiscalYear: number = getFiscalYear();
  const batchNumber: string = getBatchNumber();
  const controlTotal: string = getControlTotal(transactions);
  const feederNumberClientSystem: string = getFeederNumberClientSystem();
  const controlCount: string = getControlCount(transactions);

  batchTrailer = batchTrailer + feederNumber + batchType + transactionType + delimiter + feederNumber
    + fiscalYear + batchNumber + controlCount + controlTotal + feederNumberClientSystem + delimiter  + `\n`;
  return batchTrailer;
}

export function generateCgiFile(transactions: Transaction[]): void {
  const now: Date = new Date();
  const cgiCustomString: string = formatDateToCustomString(now);
  const cgiFileName = `F` + process.env.FEEDER_NUMBER + `.${cgiCustomString}`;
  const batchHeader: string = populateBatchHeader();
  fs.writeFileSync(cgiFileName, batchHeader);
  console.log(maxBatchId);
  const journalHeader: string = populateJournalHeader(transactions);
  fs.appendFileSync(cgiFileName, journalHeader);
  populateJournalVoucherDetail(cgiFileName, transactions);
  const batchTrailer: string = populateBatchTrailer(transactions);
  fs.appendFileSync(cgiFileName, batchTrailer);
  console.log(`${cgiFileName} generated.`);
  const cgiTrigerFileName = `F` + process.env.FEEDER_NUMBER + `.${cgiCustomString}.TRG`;
  fs.writeFileSync(cgiTrigerFileName, ``);
  console.log(`${cgiTrigerFileName} generated.`);
}

async function uploadFile(): Promise<string[]> {
  const currentDir = process.cwd();
  const sourceDir = currentDir;
  const destinationDir = currentDir;
  const uploadedFiles: string[] = [];

  try {
    const files = await fs.promises.readdir(sourceDir);
    const inboxFiles = files.filter(file => file.startsWith(`F` + process.env.FEEDER_NUMBER +'.'));
    if (inboxFiles.length === 0) {
      console.log('No files can be uploaded');
      return uploadedFiles; // Return an empty array
    }

    for (const file of inboxFiles) {
      const sourceFile = join(sourceDir, file);
      const destinationFile = join(destinationDir, file);

      // Read the file's data
      const fileData = await fs.promises.readFile(sourceFile);

      // Create a readable stream from the buffer
      const fileStream = new Readable();
      fileStream.push(fileData);
      fileStream.push(null); // Indicate the end of the stream

      // Construct the file object
      const multerFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: file,
        encoding: '7bit',
        mimetype: 'application/octet-stream',
        size: fileData.length,
        destination: destinationDir,
        filename: file,
        path: destinationFile,
        buffer: fileData,
        stream: fileStream,
      };

      const cgiSftpService: CgiSftpService = new CgiSftpService();
      cgiSftpService.upload(multerFile, file);
      uploadedFiles.push(file); // Collect the uploaded file names
    }
  } catch (err) {
    console.error('Error uploading files:', err);
  }

  return uploadedFiles; // Return the list of uploaded files
}


export const generate = async (transactions: Transaction[]): Promise<string[]> => {
  globalJournalName = getJournalName();
  generateCgiFile(transactions);
  return await uploadFile();
}