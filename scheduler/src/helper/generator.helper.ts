import { config as dotenvConfig } from "dotenv";
import * as fs from 'fs';
// import { ConnectionPool, connect} from 'mssql';
import { join, resolve } from 'path';
// import { CgiGenerator } from "./cgigenerator.helper";
// import { TransactionService } from "src/modules/transactions/transaction.service";
// import { Repository, getRepository } from "typeorm";

import { Transaction } from "src/modules/transactions/transaction.entity";
// import { MyService } from "./myservice";
// import { createConnections } from 'typeorm';

// const transactionRepository = getRepositoryForEntity();
// const transactionService = new TransactionService(transactionRepository);
// const cgiGenerator = new CgiGenerator(transactionService);


const envFilePath = resolve(__dirname, "../../../.env");
const result = dotenvConfig({ path: envFilePath });

if (result.error) {
  throw result.error;
}

const maxBatchId: string = '';
// let transactions: Promise<Transaction[]>;


class BatchHeader {
  feederNumber: string;
  batchType: string;
  transactionType: string;
  fiscalYear: number;
  batchNumber: string;
  messageVersion: string;

  constructor() {
    this.feederNumber = '3535';
    this.batchType = `GA`;
    this.transactionType = `BH`;
    this.fiscalYear = getFiscalYear();
    this.batchNumber = getBatchNumber();
    this.messageVersion = `4010`;
  } 
}




  function formatDateToCustomString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  
  function getFiscalYear(): number {
    return 2024;
  }
  
  function getBatchNumber(): string {
    // 9 characters
    return `000000001`;
  }
  
  // Journal name: 10 characters
  let globalJournalName: string = '';
  
  function getJournalName(): string {
    const prefix = 'MT'; // Ministry Alpha identifier prefix
    const randomChars = generateRandomChars(8); // Generate 8 random characters
    const journalName: string = prefix + randomChars;
    return journalName;
  }
  
  function generateRandomChars(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  function getJournalBatchName(): string {
    // 25 characters
    const prefix = 'MT'; // Ministry Alpha identifier prefix
    const randomChars = generateRandomChars(23); // Generate 23 random characters
    return prefix + randomChars;
  }
  
  function getControlTotal(transactions: Transaction[]): string {
    // 15 characters
    let total: number = 0.0;
    for (const transaction of transactions) {
      total += Number(transaction.TOTAL_TRANSACTION_AMOUNT);
    }
  
    let totalString: string = total.toFixed(2); // Ensure two decimal places
    const isNegative: boolean = totalString.startsWith('-');
    const integerPartLength: number = isNegative ? totalString.length - 1 : totalString.length;
    const paddingLength: number = 15 - integerPartLength;
  
    if (paddingLength > 0) {
      totalString = totalString.padStart(totalString.length + paddingLength, ' ');
    }
  
    return totalString;
  }
  
  function getExternalReferenceSource(): string {
    // 100 chars, optional
    // return `QP`;
    return ``;
  }
  
  function getFlowThru(): string {
    // 110 chars
    return `                                                                                                              `;
  }
  
  let jvLineNumberCounter: number = 0;
  
  function getJvLiineNumber(): string {
    // 5 chars
    jvLineNumberCounter++;
    return String(jvLineNumberCounter).padStart(5, '0');
  }
  
  function getGlEffectiveDate(): string {
    const currentDate: Date = new Date();
    const year: number = currentDate.getFullYear();
    const month: string = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day: string = currentDate.getDate().toString().padStart(2, '0');
  
    return `${year}${month}${day}`;
  }
  
  function getAck(): string {
    // 50 chars
    // Client - (3 Characters)
    // Responsibility - (5 Characters)
    // Service Line - (5 Characters)
    // STOB - (4 Characters)
    // Project - (7 Characters)
    // Location - (6 Characters)
    // Future - (4 Characters)
    // Unused Filler - (16 Characters)
    const client = 'abc';
    const responsibility = '12345';
    const serviceLine = 'abcde';
    const stob = 'defj';
    const project = 'proj123';
    const location = 'abc123';
    const future = 'abcd';
    const unusedFiller = '                ';//16 spaces
    let result = '';
    result = result + client + responsibility + serviceLine + stob + project + location + future + unusedFiller;
    return result;
  }
  
  function getClient(): string {
    // 3 chars
    return `034`;
  }
  
  function getResponsibility(): string {
    // 5 chars
    return `55331`;
  }
  
  function getServiceLine(): string {
    // 5 chars
    return `10435`;
  }
  
  function getStob(): string {
    // 4 chars
    return `1474`;
  }
  
  function getProject(): string {
    // 7 chars
    return `5500000`;
  }
  
  function getLocation(): string {
    // 6 chars
    return `000000`;
  }
  
  function getFuture(): string {
    // 4 chars
    return `0000`;
  }
  
  function getUnusedFiller(): string {
    // 16 chars
    return `0000000000000000`;
  }
  
  function getSupplierNumber(): string {
    // 9 chars
    return `abcdefghi`;
  }
  
  // function getAmountOfLine(): string {
  //   // 15 chars
  //   return `111112222233.33`;
  // }
  
  function getLineCode(): string {
    // 1 char, C or D
    return `C`;
  }
  
  function getLineDescription(): string {
    // 100 chars
    return `                                                                                                    `;
  }
  
  function getFeederNumberClientSystem(): string {
    // 4 chars
    return ``;
  }
  
  function getControlCount(transactions: Transaction[]): string {
    // 15 chars
    // return `123451234512.34`;
    const numberStr = transactions.length.toString();
    const desiredLength = 15;
    const paddedString = numberStr.padStart(desiredLength, '0');
    return paddedString;
    
  }
  
  function populateBatchHeader(filename: string, ackFilename: string): string {
    let batchHeader: string = ``;
    const feederNumber: string = `3535`;
    const batchType: string = `GA`;
    const transactionType: string = `BH`;
    // const delimiter: string = `1D`;
    const delimiterHex = 0x1D;
    const delimiter = String.fromCharCode(delimiterHex);
    const fiscalYear: number = getFiscalYear();
    const batchNumber: string = getBatchNumber();
    const messageVersion: string = `4010`;
    batchHeader = batchHeader + feederNumber + batchType + transactionType + delimiter + feederNumber + fiscalYear + batchNumber + messageVersion + delimiter + `\n`;
    const bt: BatchHeader = new BatchHeader();
    bt.feederNumber = feederNumber;
    bt.batchType = batchType;
    bt.transactionType = transactionType;
    bt.fiscalYear = fiscalYear;
    bt.batchNumber = batchNumber;
    bt.messageVersion = messageVersion;
    // const batchId: string = await insertBatchHeader(bt, filename, ackFilename);
    console.log(filename);
    console.log(ackFilename);
    return batchHeader;
  }



function populateJournalHeader(transactions: Transaction[]): string {
  let journalHeader: string = ``;
  const feederNumber: string = `3535`;
  const batchType: string = `GA`;
  const transactionType: string = `JH`;
  // const delimiter: string = `1D`;
  const delimiterHex = 0x1D;
  const delimiter = String.fromCharCode(delimiterHex);
  const journalName: string = globalJournalName;
  const journalBatchName: string = getJournalBatchName();
  const controlTotal: string = getControlTotal(transactions);
  const recordType: string = `A`;
  const countryCurrencyCode: string = `CAD`;
  const externalReferenceSource: string = getExternalReferenceSource();
  const flowThru: string = getFlowThru();
  journalHeader = journalHeader + feederNumber + batchType + transactionType + delimiter + journalName + journalBatchName + controlTotal
    + recordType + countryCurrencyCode + externalReferenceSource + flowThru + delimiter + `\n`;
  // await insertJournalHeader(maxBatchId);
  return journalHeader;
}

function populateJournalVoucherDetail(cgiFileName: string, transactions: Transaction[]): void {
  const feederNumber: string = `3535`;
  const batchType: string = `GA`;
  const transactionType: string = `JD`;
  // const delimiter: string = `1D`;
  const delimiterHex = 0x1D;
  const delimiter = String.fromCharCode(delimiterHex);
  const journalName: string = globalJournalName;
  const flowThru: string = getFlowThru();
  const jvLineNumber: string = getJvLiineNumber();
  const glEffectiveDate: string = getGlEffectiveDate();
  const ack: string = getAck();
  console.log(ack);
  const client: string = getClient();
  const responsibility: string = getResponsibility();
  const serviceLine: string = getServiceLine();
  const stob: string = getStob();
  const project: string = getProject();
  const location: string = getLocation();
  const future: string = getFuture();
  const unusedFiller: string = getUnusedFiller();
  const supplierNumber: string = getSupplierNumber();
  const lineCode: string = getLineCode();
  const lineDescription: string = getLineDescription();

  for (const transaction of transactions) {

    const lineTotal = getLineTotle(transaction.TOTAL_TRANSACTION_AMOUNT);

    let journalVoucher: string = `${feederNumber}`;
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
    // await insertJournalVoucher(maxJournalHeaderId, transaction);
  }
}

function getLineTotle(total: number) {
  let totalString: string = total.toFixed(2); // Ensure two decimal places
    const isNegative: boolean = totalString.startsWith('-');
    const integerPartLength: number = isNegative ? totalString.length - 1 : totalString.length;
    const paddingLength: number = 15 - integerPartLength;
  
    if (paddingLength > 0) {
      totalString = totalString.padStart(totalString.length + paddingLength, ' ');
    }
  
    return totalString;

}

function populateBatchTrailer(transactions: Transaction[]): string {
  let batchTrailer: string = ``;
  const feederNumber: string = `3535`;
  const batchType: string = `GA`;
  const transactionType: string = `BT`;
  // const delimiter: string = `1D`;
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

function generateCgiFile(transactions: Transaction[]): void {
  const now: Date = new Date();
  const cgiCustomString: string = formatDateToCustomString(now);
  const cgiFileName: string = `INBOX.F3535.${cgiCustomString}`;
  const batchHeader: string = populateBatchHeader('test_cgi_file', 'test_cgi_ack_file');
  fs.writeFileSync(cgiFileName, batchHeader);

  console.log(maxBatchId);

  const journalHeader: string = populateJournalHeader(transactions);
  fs.appendFileSync(cgiFileName, journalHeader);

  populateJournalVoucherDetail(cgiFileName, transactions);

  const batchTrailer: string = populateBatchTrailer(transactions);
  fs.appendFileSync(cgiFileName, batchTrailer);
  console.log(`${cgiFileName} generated.`);

  const cgiTrigerFileName: string = `INBOX.F3535.${cgiCustomString}.TRG`;
  fs.writeFileSync(cgiTrigerFileName, ``);
  console.log(`${cgiTrigerFileName} generated.`);
}

async function moveFile(): Promise<void> {
  const currentDir = process.cwd();
  const sourceDir = currentDir;
  // Destination directory
  const destinationDir = '/tmp';

  try {
    const files = await fs.promises.readdir(sourceDir);
    const inboxFiles = files.filter(file => file.startsWith('INBOX.'));
    // Move each file to the destination directory
    for (const file of inboxFiles) {
      const sourceFile = join(sourceDir, file);
      const destinationFile = join(destinationDir, file);

      await fs.promises.rename(sourceFile, destinationFile);
      console.log(`File ${sourceFile} moved to ${destinationFile}`);
    }
  } catch (err) {
    console.error('Error moving files:', err);
  }
}

export const generate = async (transactions: Transaction[]): Promise<void> => {


  // try {
  //   await cgiGenerator.getAllTransactions();
  // } catch (error) {
  //   // Handle error
  //   console.error('Error fetching transactions:', error);
  // }




  // transactions = getTransactions();
  globalJournalName = getJournalName();
  generateCgiFile(transactions);
  // generateCgiFile(await transactions);
  await moveFile();
}

// function getRepositoryForEntity(): Repository<Transaction> {
//   return getRepository(Transaction);
// }



