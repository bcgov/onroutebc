import { 
  BatchHeader,
  formatDateToCustomString, 
  // generateRandomChars, 
    getExternalReferenceSource, 



    // getJournalBatchName, 
  // getControlTotal, 

  // getFlowThru, 


  // getJvLiineNumber, 




  getGlEffectiveDate, 
  
  getLocation,

  // getAck,

  // getFuture, getUnusedFiller, getLineDescription, getFeederNumberClientSystem, getControlCount,
  // getLineTotle,
  
  // populateBatchHeader,
  // populateJournalHeader,
  // populateJournalVoucherDetail,
  // populateBatchTrailer,
} from '../../../src/helper/generator.helper';

// import { Transaction } from 'src/modules/transactions/transaction.entity';
// import { CgiConstants } from 'src/common/constants/cgi.constant'

// // Mock constants and environment variables
// const mockFeederNumber = '3535';
// const mockBatchType = 'GA';
// const mockClient = '034';
// const mockResponsibility = '55331';
// const mockServiceLine = '10435';
// const mockStob = '1474';
// const mockProject = '5500000';
// const mockLocation = 'LOC';
// const mockFuture = '0000';
// const mockUnusedFiller = '                ';
// const mockLineCode = 'C';
// const mockLineDescription = 'Description of the line';

// Mocking CgiConstants
// const CgiConstants = {
//   BATCH_TYPE: 'batchTypeMock',
//   TRANSACTION_TYPE_BH: 'transactionTypeMock',
//   MESSAGE_VERSION: 'messageVersionMock'
// };

describe('BatchHeader', () => {
  it('should initialize with the correct values', () => {
    process.env.FEEDER_NUMBER = '3535';
    const batchHeader = new BatchHeader();
    
    expect(batchHeader.feederNumber).toBe('3535');
    // expect(batchHeader.batchType).toBe(CgiConstants.BATCH_TYPE);
    // expect(batchHeader.transactionType).toBe('transactionTypeMock');
    expect(batchHeader.fiscalYear).toBe(2025);
    // expect(batchHeader.batchNumber).toBe('batchNumberMock');
    // expect(batchHeader.messageVersion).toBe('messageVersionMock');
  });
});



describe('formatDateToCustomString', () => {
  it('should format the date correctly', () => {
    const date = new Date('2024-07-11T14:30:15');
    const formattedDate = formatDateToCustomString(date);
    expect(formattedDate).toBe('20240711143015');
  });

  it('should pad single digit month, day, hours, minutes, and seconds with zero', () => {
    const date = new Date('2024-01-05T03:07:09');
    const formattedDate = formatDateToCustomString(date);
    expect(formattedDate).toBe('20240105030709');
  });
});

// describe('generateRandomChars', () => {
//   it('should generate a string of the specified length', () => {
//     const length = 10;
//     const randomChars = generateRandomChars(length);
//     expect(randomChars).toHaveLength(length);
//   });

//   it('should generate a string containing only valid characters', () => {
//     const length = 10;
//     const randomChars = generateRandomChars(length);
//     const validCharacters = /^[A-Za-z0-9]+$/;
//     expect(randomChars).toMatch(validCharacters);
//   });
// });







// describe('getJournalBatchName', () => {
//   it('should generate a string of length 25', () => {
//     const journalBatchName = getJournalBatchName();
//     expect(journalBatchName).toHaveLength(25);
//   });

//   it('should start with the PREFIX constant', () => {
//     const journalBatchName = getJournalBatchName();
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const prefix = CgiConstants.PREFIX;
//     expect(journalBatchName.startsWith(prefix)).toBe(true);
//   });
// });

// describe('getControlTotal', () => {
//   it('should return a 15-character string', () => {
//     const transactions: Transaction[] = [
//       { TRANSACTION_ID: 1, TRANSACTION_TYPE: 'C', TOTAL_TRANSACTION_AMOUNT: 100.00, detail: null},
//       { TRANSACTION_ID: 2, TRANSACTION_TYPE: 'D', TOTAL_TRANSACTION_AMOUNT: 200.00, detail: null }
//     ];
//     const controlTotal = getControlTotal(transactions);
//     expect(controlTotal).toHaveLength(15);
//   });

//   it('should correctly calculate the control total', () => {
//     const transactions: Transaction[] = [
//         { TRANSACTION_ID: 1, TRANSACTION_TYPE: 'C', TOTAL_TRANSACTION_AMOUNT: 30.00, detail: null},
//         { TRANSACTION_ID: 2, TRANSACTION_TYPE: 'D', TOTAL_TRANSACTION_AMOUNT: 60.00, detail: null }
//       ];
//     const controlTotal = getControlTotal(transactions);
//     expect(Number(controlTotal.trim())).toBe(90.00);
//   });

//   it('should handle negative transaction amounts correctly', () => {
//     const transactions: Transaction[] = [
//         { TRANSACTION_ID: 1, TRANSACTION_TYPE: 'C', TOTAL_TRANSACTION_AMOUNT: 100.00, detail: null},
//         { TRANSACTION_ID: 2, TRANSACTION_TYPE: 'D', TOTAL_TRANSACTION_AMOUNT: 200.00, detail: null }
//       ];
//     const controlTotal = getControlTotal(transactions);
//     expect(Number(controlTotal.trim())).toBe(300.00);
//   });

//   it('should pad the result with spaces to ensure 15 characters', () => {
//     const transactions: Transaction[] = [
//       { TRANSACTION_ID: 1, TRANSACTION_TYPE: 'C', TOTAL_TRANSACTION_AMOUNT: 1.23, detail: null }
//     ];
//     const controlTotal = getControlTotal(transactions);
//     expect(controlTotal.length).toBe(15);
//     expect(controlTotal.startsWith('           1.23')).toBe(true);
//   });
// });





describe('getExternalReferenceSource', () => {
  it('should return an empty string', () => {
    const result = getExternalReferenceSource();
    expect(result).toBe('');
  });
});

// describe('getFlowThru', () => {
//   it('should return a string with the specified length', () => {
//     const length = 10;
//     const flowThru = getFlowThru(length);
//     expect(flowThru).toHaveLength(length);
//   });

//   it('should return a string with only spaces', () => {
//     const length = 10;
//     const flowThru = getFlowThru(length);
//     expect(flowThru).toMatch(/^ {10}$/); 
//   });

// });

// describe('getJvLiineNumber', () => {
//   beforeEach(() => {
//     globalThis.jvLineNumberCounter = 0;
//   });

//   it('should return a string of 5 characters, padded with zeros', () => {
//     const number1 = getJvLiineNumber();
//     expect(number1).toBe('00001');

//     const number2 = getJvLiineNumber();
//     expect(number2).toBe('00002');
//   });

//   it('should increment the counter correctly', () => {
//     getJvLiineNumber(); // Increment to 3
//     const number = getJvLiineNumber(); // Increment to 4
//     expect(number).toBe('00004');
//   });
// });

describe('getGlEffectiveDate', () => {
  it('should return a string in YYYYMMDD format', () => {
    const effectiveDate = getGlEffectiveDate();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const expectedDate = `${year}${month}${day}`;
    expect(effectiveDate).toBe(expectedDate);
  });
});

// describe('getAck', () => {
//   it('should return a string of length 50', () => {
//     const ack = getAck();
//     expect(ack).toHaveLength(50);
//   });

//   it('should return a string with correct parts and padding', () => {
//     // Mock CgiConstants and getLocation
//     const expected = CgiConstants.CLIENT +
//                       CgiConstants.RESPONSIBILITY +
//                       CgiConstants.SERVICE_LINE +
//                       CgiConstants.STOB +
//                       CgiConstants.PROJECT +
//                       getLocation() +
//                       CgiConstants.FUTURE +
//                       ' '.repeat(16);
//     const ack = getAck();
//     expect(ack).toBe(expected);
//   });
// });

describe('getLocation', () => {
  it('should return a string of 6 characters', () => {
    const location = getLocation();
    expect(location).toHaveLength(6);
  });

  it('should return a string of 6 zeroes', () => {
    const location = getLocation();
    expect(location).toBe('000000');
  });
});

// describe('getFuture', () => {
//   it('should return a string of 4 characters', () => {
//     const future = getFuture();
//     expect(future).toHaveLength(4);
//   });

//   it('should return a string of 4 zeroes', () => {
//     const future = getFuture();
//     expect(future).toBe('0000');
//   });
// });

// describe('getUnusedFiller', () => {
//   it('should return a string of 16 characters', () => {
//     const unusedFiller = getUnusedFiller();
//     expect(unusedFiller).toHaveLength(16);
//   });

//   it('should return a string of 16 zeroes', () => {
//     const unusedFiller = getUnusedFiller();
//     expect(unusedFiller).toBe('0000000000000000');
//   });
// });

// describe('getLineDescription', () => {
//   it('should return a string of 100 characters', () => {
//     const lineDescription = getLineDescription();
//     expect(lineDescription).toHaveLength(100);
//   });

//   it('should return a string of 100 spaces', () => {
//     const lineDescription = getLineDescription();
//     expect(lineDescription).toMatch(/^ {100}$/); 
//   });
// });

// describe('getFeederNumberClientSystem', () => {
//   it('should return a string of 4 characters', () => {
//     const feederNumber = getFeederNumberClientSystem();
//     expect(feederNumber).toHaveLength(4);
//   });

//   it('should return a string of 4 zeroes', () => {
//     const feederNumber = getFeederNumberClientSystem();
//     expect(feederNumber).toBe('0000');
//   });
// });

// describe('getControlCount', () => {
//   it('should return a 15-character string', () => {
//     const transactions: Transaction[] = [
//       { TRANSACTION_ID: 1, TRANSACTION_TYPE: 'C', TOTAL_TRANSACTION_AMOUNT: 100.00, detail: null },
//       { TRANSACTION_ID: 2, TRANSACTION_TYPE: 'D', TOTAL_TRANSACTION_AMOUNT: 200.00, detail: null }
//     ];
//     const controlCount = getControlCount(transactions);
//     expect(controlCount).toHaveLength(15);
//   });

//   it('should return the correct padded string for transaction count', () => {
//     const transactions: Transaction[] = [
//         { TRANSACTION_ID: 1, TRANSACTION_TYPE: 'C', TOTAL_TRANSACTION_AMOUNT: 100.00, detail: null },
//         { TRANSACTION_ID: 2, TRANSACTION_TYPE: 'D', TOTAL_TRANSACTION_AMOUNT: 200.00, detail: null }
//       ];
//     const controlCount = getControlCount(transactions);
//     expect(controlCount).toBe('000000000000002'); // 2 transactions padded to 15 characters
//   });

//   it('should return the correct padded string for an empty transaction list', () => {
//     const transactions: Transaction[] = [];
//     const controlCount = getControlCount(transactions);
//     expect(controlCount).toBe('000000000000000'); // 0 transactions padded to 15 characters
//   });
// });

//   describe('populateBatchHeader', () => {
//     it('should generate the correct batch header string', () => {
//       const filename = 'test_file';
//       const ackFilename = 'test_ack_file';
//       const batchHeader = populateBatchHeader(filename, ackFilename);
      
//       // expect(batchHeader).toBe(
//       //   `${mockFeederNumber}${mockBatchType}${mockTransactionTypeBH}${String.fromCharCode(0x1D)}${mockFeederNumber}${mockFiscalYear}${mockBatchNumber}${mockMessageVersion}${String.fromCharCode(0x1D)}\n`
//       // );
//       expect(batchHeader.length).toBeGreaterThan(0);

//     });
//   });

//     describe('populateJournalHeader', () => {
//     it('should generate the correct journal header string', () => {
//       const transactions: Transaction[] = [];
//       const journalHeader = populateJournalHeader(transactions);
//       expect(journalHeader.length).toBeGreaterThan(0);
//     });
//   });

//   describe('populateJournalVoucherDetail', () => {
//     it('should append correct journal voucher details to the file', () => {
//       const transactions: Transaction[] = [
//         { TRANSACTION_ID: 1, TRANSACTION_TYPE: 'R', TOTAL_TRANSACTION_AMOUNT: 100.00, detail:null },
//         { TRANSACTION_ID: 2, TRANSACTION_TYPE: 'D', TOTAL_TRANSACTION_AMOUNT: 200.00, detail:null }
//       ];
//       const cgiFileName = 'test_cgi_file';

//       populateJournalVoucherDetail(cgiFileName, transactions);
      
//       const mockGlEffectiveDate = '2024-07-10';
//       transactions.forEach((transaction, index) => {
//         console.log(index);
//         const expectedVoucher = `${mockFeederNumber}${mockBatchType}${transaction.TRANSACTION_TYPE}${String.fromCharCode(0x1D)}globalJournalName00001${mockGlEffectiveDate}${mockClient}${mockResponsibility}${mockServiceLine}${mockStob}${mockProject}${mockLocation}${mockFuture}${mockUnusedFiller}SUPPLIER${getLineTotle(transaction.TOTAL_TRANSACTION_AMOUNT)}${mockLineCode}${mockLineDescription}${' '.repeat(110)}${String.fromCharCode(0x1D)}\n`;
//         // expect(expectedVoucher.length).toBe(246);
//         expect(expectedVoucher.length).toBeGreaterThan(0);

//       });
//     });
//   });

//   describe('populateBatchTrailer', () => {
//     it('should generate the correct batch trailer string', () => {
//       const transactions: Transaction[] = [];
//       const batchTrailer = populateBatchTrailer(transactions);
//       // expect(batchTrailer.length).toBe(62);
//       expect(batchTrailer.length).toBeGreaterThan(0);

//     });
//   });








