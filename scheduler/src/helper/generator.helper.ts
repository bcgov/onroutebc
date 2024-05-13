import { config as dotenvConfig } from "dotenv";
import * as fs from 'fs';
import { ConnectionPool, connect} from 'mssql';
import { join, resolve } from 'path';

const envFilePath = resolve(__dirname, "../../../.env");
const result = dotenvConfig({ path: envFilePath });

if (result.error) {
  throw result.error;
}

const maxBatchId: string = '';
let transactions: Promise<Transaction[]>;

interface DbConfig {
  user: string;
  password: string;
  server: string;
  database: string;
  options?: {
    encrypt?: boolean;
  };
}

const dbConfig: DbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false, // Use encryption if needed
  },
};

class Transaction {
  transactionId: string;
  transactionAmount: number;

  constructor(transactionId: string, transactionAmount: number) {
    this.transactionId = transactionId;
    this.transactionAmount = transactionAmount;
  } 
}

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

async function getTransactions(): Promise<Transaction[]> {

  let pool: ConnectionPool | null = null;
  try {
    pool = await connect(dbConfig);

    // Execute the SQL query to retrieve transaction data
    const result = await pool.query('SELECT TRANSACTION_ID, TOTAL_TRANSACTION_AMOUNT FROM permit.ORBC_TRANSACTION');

    // Process the result set and populate Transaction objects
    const transactions: Transaction[] = result.recordset.map((record: { TRANSACTION_ID: string, TOTAL_TRANSACTION_AMOUNT: number }) => {
      return new Transaction(record.TRANSACTION_ID, record.TOTAL_TRANSACTION_AMOUNT);
    });

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  } finally {
    // Close the database connection
    if (pool) {
      try {
        await pool.close();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
  
}



  // async function getTransactions(): Promise<Transaction[]> {
  //   try {
  //     // Connect to the database
  //     const pool = new ConnectionPool(dbConfig);
  //     await pool.connect();
  
  //     // Execute the SQL query to retrieve transaction data
  //     const result = await pool.query('SELECT TRANSACTION_ID, TOTAL_TRANSACTION_AMOUNT FROM permit.ORBC_TRANSACTION');
  
  //     // Process the result set and populate Transaction objects
  //     const transactions: Transaction[] = result.recordset.map((record: any) => {
  //       return new Transaction(record.TRANSACTION_ID, record.TOTAL_TRANSACTION_AMOUNT);
  //     });
  
  //     return transactions;
  //   } catch (error) {
  //     console.error('Error fetching transactions:', error);
  //     throw error;
  //   } finally {
  //     // Close the database connection
  //     await pool.close();
  //   }
  // }
  
  // async function insertBatchHeader(batchHeader: BatchHeader, filename: string, ackFilename: string): Promise<void> {
  //   try {
  //     await sql.connect(dbConfig);
  //     const result = await sql.query`
  //       BEGIN TRANSACTION
  //       SET ANSI_NULLS ON
  //       SET QUOTED_IDENTIFIER ON
  //       INSERT INTO cgi.ORBC_CGI_FILE_LOG (FILE_NAME, ACK_FILE) VALUES (${filename}, ${ackFilename})
  //       COMMIT
  //     `;
  //     console.log('Record inserted into ORBC_CGI_FILE_LOG successfully:', result);
  
  //     const result1 = await sql.query("SELECT MAX(ID) AS ID FROM cgi.ORBC_CGI_FILE_LOG");
  //     const maxID = result1.recordset[0].ID;
  //     console.log(maxID);
  
  //     const result2 = await sql.query`
  //       BEGIN TRANSACTION
  //       SET ANSI_NULLS ON
  //       SET QUOTED_IDENTIFIER ON
  //       INSERT INTO cgi.ORBC_CGI_BATCH_HEADER (CGI_FILE_ID, BATCH_NUMBER) VALUES (${maxID}, ${batchHeader.batchNumber})
  //       COMMIT
  //     `;
  //     console.log('Record inserted into ORBC_CGI_BATCH_HEADER successfully:', result2);
  
  //     const result3 = await sql.query("SELECT MAX(BATCH_ID) AS BATCH_ID FROM cgi.ORBC_CGI_BATCH_HEADER");
  //     maxBatchId = result3.recordset[0].BATCH_ID;
  //     console.log(maxBatchId);
  //   } catch (error) {
  //     console.error('Error inserting data:', error);
  //   } finally {
  //   //   sql.close();
  //   }
  // }
  
  // async function insertJournalHeader(batchId: string): Promise<void> {
  //   try {
  //     await sql.connect(dbConfig);
  //     const result = await sql.query`
  //       BEGIN TRANSACTION
  //       SET ANSI_NULLS ON
  //       SET QUOTED_IDENTIFIER ON
  //       INSERT INTO cgi.ORBC_CGI_JOURNAL_HEADER (BATCH_ID, JOURNAL_BATCH_NAME, FLOW_THROUGH) VALUES (${batchId}, 'j_b_name_001', 'flow_thru_001')
  //       COMMIT
  //     `;
  //     console.log('Record inserted into ORBC_CGI_JOURNAL_HEADER successfully:', result);
  
  //     const result1 = await sql.query("SELECT MAX(JOURNAL_HEADER_ID) AS ID FROM cgi.ORBC_CGI_JOURNAL_HEADER");
  //     maxJournalHeaderId = result1.recordset[0].ID;
  //     console.log(maxJournalHeaderId);
  //   } catch (error) {
  //     console.error('Error inserting data:', error);
  //   } finally {
  //   //   sql.close();
  //   }
  // }
  
  // async function insertJournalVoucher(journalHeaderId: string, transaction: Transaction): Promise<void> {
  //   try {
  //     await sql.connect(dbConfig);
  //     const result = await sql.query`
  //       BEGIN TRANSACTION
  //       SET ANSI_NULLS ON
  //       SET QUOTED_IDENTIFIER ON
  //       INSERT INTO cgi.ORBC_CGI_JOURNAL_VOUCHER (JOURNAL_HEADER_ID, JV_LINE_NUMBER, TRANSACTION_ID) VALUES (${journalHeaderId}, ${transaction.transactionAmount}, ${transaction.transactionId})
  //       COMMIT
  //     `;
  //     console.log('Record inserted into ORBC_CGI_JOURNAL_VOUCHER successfully:', result);
  //   } catch (error) {
  //     console.error('Error inserting data:', error);
  //   } finally {
  //   //   sql.close();
  //   }
  // }
  
  // async function callSqlFunction(companyId: string): Promise<void> {
  //   try {
  //     await sql.connect(dbConfig);
  //     const result = await sql.query`SELECT dbo.CalculateTotalAmount(${companyId}) AS totalAmount`;
  //     console.log("Total Amount:", result.recordset[0].totalAmount);
  //   } catch (error) {
  //     console.error("Error calling function:", error);
  //   } finally {
  //   //   await sql.close();
  //   }
  // }


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
  
  let globalJournalName: string = '';
  
  function getJournalName(): string {
    const prefix = 'MT-'; // Ministry Alpha identifier prefix
    const randomChars = generateRandomChars(7); // Generate 7 random characters
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
    const prefix = 'MT-'; // Ministry Alpha identifier prefix
    const randomChars = generateRandomChars(22); // Generate 22 random characters
    return prefix + randomChars;
  }
  
  function getControlTotal(transactions: Transaction[]): string {
    // 15 characters
    let total: number = 0.0;
    for (const transaction of transactions) {
      total += Number(transaction.transactionAmount);
    }
  
    let totalString: string = total.toFixed(2); // Ensure two decimal places
    const isNegative: boolean = totalString.startsWith('-');
    const integerPartLength: number = isNegative ? totalString.length - 1 : totalString.length;
    const paddingLength: number = 15 - integerPartLength;
  
    if (paddingLength > 0) {
      totalString = totalString.padStart(totalString.length + paddingLength, '0');
    }
  
    return totalString;
  }
  
  function getExternalReferenceSource(): string {
    // 100 chars, optional
    return `QP`;
  }
  
  function getFlowThru(): string {
    // 110 chars
    return ``;
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
    return `0000`;
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
    return `aaaaaaaaaa`;
  }
  
  function getFeederNumberClientSystem(): string {
    // 4 chars
    return `abcd`;
  }
  
  function getControlCount(): string {
    // 15 chars
    return `123451234512.34`;
  }
  
  function populateBatchHeader(filename: string, ackFilename: string): string {
    let batchHeader: string = ``;
    const feederNumber: string = `3535`;
    const batchType: string = `GA`;
    const transactionType: string = `BH`;
    const delimiter: string = `1D`;
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
  const delimiter: string = `1D`;
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
  const delimiter: string = `1D`;
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
    journalVoucher += `${transaction.transactionAmount}`;
    journalVoucher += `${lineCode}`;
    journalVoucher += `${lineDescription}`;
    journalVoucher += `${flowThru}`;
    journalVoucher += `${delimiter}`;
    journalVoucher += `\n`;

    fs.appendFileSync(cgiFileName, journalVoucher);
    // await insertJournalVoucher(maxJournalHeaderId, transaction);
  }
}

function populateBatchTrailer(transactions: Transaction[]): string {
  let batchTrailer: string = ``;
  const feederNumber: string = `3535`;
  const batchType: string = `GA`;
  const transactionType: string = `BT`;
  const delimiter: string = `1D`;
  const fiscalYear: number = getFiscalYear();

  const batchNumber: string = getBatchNumber();
  const controlTotal: string = getControlTotal(transactions);
  const feederNumberClientSystem: string = getFeederNumberClientSystem();
  const controlCount: string = getControlCount();

  batchTrailer = batchTrailer + feederNumber + batchType + transactionType + delimiter + feederNumber
    + fiscalYear + batchNumber + controlCount + controlTotal + feederNumberClientSystem + delimiter + `\n`;
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

export const generate = async (): Promise<void> => {
  transactions = getTransactions();
  globalJournalName = getJournalName();
  generateCgiFile(await transactions);
  await moveFile();
}
