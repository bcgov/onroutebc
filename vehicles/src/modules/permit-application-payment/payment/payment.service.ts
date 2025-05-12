import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import { ReadTransactionDto } from './dto/response/read-transaction.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, QueryRunner, Repository, UpdateResult } from 'typeorm';
import { PermitTransaction } from './entities/permit-transaction.entity';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import {
  callDatabaseSequence,
  setBaseEntityProperties,
} from 'src/common/helper/database.helper';
import { Permit } from '../permit/entities/permit.entity';
import { ApplicationStatus } from '../../../common/enum/application-status.enum';
import { PaymentMethodType as PaymentMethodTypeEnum } from '../../../common/enum/payment-method-type.enum';
import { TransactionType } from '../../../common/enum/transaction-type.enum';

import { ReadPaymentGatewayTransactionDto } from './dto/response/read-payment-gateway-transaction.dto';
import { Receipt } from './entities/receipt.entity';
import {
  PAYMENT_DESCRIPTION,
  PAYBC_PAYMENT_METHOD,
  PAYMENT_CURRENCY,
  CRYPTO_ALGORITHM_MD5,
  GL_PROJ_CODE_PLACEHOLDER,
  PPC_FULL_TEXT,
} from '../../../common/constants/api.constant';
import { convertToHash } from 'src/common/helper/crypto.helper';
import { UpdatePaymentGatewayTransactionDto } from './dto/request/update-payment-gateway-transaction.dto';
import { PaymentCardType } from './entities/payment-card-type.entity';
import { PaymentMethodType } from './entities/payment-method-type.entity';
import { LogAsyncMethodExecution } from '../../../common/decorator/log-async-method-execution.decorator';
import { CfsTransactionDetail } from './entities/cfs-transaction.entity';
import { CfsFileStatus } from 'src/common/enum/cfs-file-status.enum';
import {
  isAmendmentApplication,
  isApplicationInCart,
  isVoidorRevoked,
} from '../../../common/helper/permit-application.helper';
import {
  isCfsPaymentMethodType,
  isTransactionPurchase,
  isWebTransactionPurchase,
} from 'src/common/helper/payment.helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKey } from 'src/common/enum/cache-key.enum';
import {
  getFromCache,
  getMapFromCache,
} from '../../../common/helper/cache.helper';
import { doesUserHaveRole } from '../../../common/helper/auth.helper';
import { IDIR_USER_ROLE_LIST } from '../../../common/enum/user-role.enum';
import {
  throwBadRequestException,
  throwUnprocessableEntityException,
} from '../../../common/helper/exception.helper';
import { isFeatureEnabled } from '../../../common/helper/common.helper';
import { PaymentTransactionDto } from './dto/common/payment-transaction.dto';
import { Nullable } from '../../../common/types/common';
import { FeatureFlagValue } from '../../../common/enum/feature-flag-value.enum';
import { PolicyService } from '../../policy/policy.service';
import { validatePaymentReceived } from '../../../common/helper/permit-fee.helper';
import { ReadPolicyValidationDto } from '../../policy/dto/Response/read-policy-validation.dto';
import { evaluatePolicyViolations } from 'src/common/helper/policy.helper';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
    @InjectRepository(PaymentMethodType)
    private readonly paymentMethodTypeRepository: Repository<PaymentMethodType>,
    @InjectRepository(PaymentCardType)
    private readonly paymentCardTypeRepository: Repository<PaymentCardType>,
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly policyService: PolicyService,
  ) {}

  private generateHashExpiry = (currDate?: Date) => {
    const curr = currDate ?? new Date();

    // Giving our hash expiry a value of current date plus 10 minutes which is sufficient
    const hashExpiryDt = new Date(curr.getTime() + 10 * 60000);

    // Extract the year, month, day, hours, and minutes from the hash expiry date
    const year = hashExpiryDt.getFullYear();
    const monthPadded = ('00' + (hashExpiryDt.getMonth() + 1).toString()).slice(
      -2,
    );
    const dayPadded = ('00' + hashExpiryDt.getDate().toString()).slice(-2);
    const hoursPadded = ('00' + hashExpiryDt.getHours().toString()).slice(-2);
    const minutesPadded = ('00' + hashExpiryDt.getMinutes().toString()).slice(
      -2,
    );

    // Create the hash expiry string in the format "YYYYMMDDHHmm"
    return `${year}${monthPadded}${dayPadded}${hoursPadded}${minutesPadded}`;
  };

  private queryHash = async (transaction: Transaction) => {
    const redirectUrl = process.env.PAYBC_REDIRECT;
    const date = new Date().toISOString().split('T')[0];
    const glProjCode = await getFromCache(
      this.cacheManager,
      CacheKey.PAYMENT_METHOD_TYPE_GL_PROJ_CODE,
      transaction.paymentMethodTypeCode,
    );

    const glCodeDetails = await Promise.all(
      transaction.permitTransactions.map(
        async ({ permit: { permitType }, transactionAmount }) => ({
          glCode: (
            await getFromCache(
              this.cacheManager,
              CacheKey.PERMIT_TYPE_GL_CODE,
              permitType,
            )
          )
            ?.replace(GL_PROJ_CODE_PLACEHOLDER, glProjCode)
            ?.trim(),
          amount: transactionAmount,
        }),
      ),
    );

    const groupedGlCodes = glCodeDetails.reduce((acc, { glCode, amount }) => {
      acc.set(glCode, (acc.get(glCode) || 0) + amount);
      return acc;
    }, new Map<string, number>());

    // Format the output string as <<index>>:<<gl code>>:<<transaction amount>> where index starts from 1
    const revenue = Array.from(groupedGlCodes.entries())
      .map(([glCode, amount], index) => `${index + 1}:${glCode}:${amount}`)
      .join('|');

    // There should be a better way of doing this which is not as rigid - something like
    // dynamically removing the hashValue param from the actual query string instead of building
    // it up manually below, but this is sufficient for now.
    const queryString =
      `pbcRefNumber=${process.env.PAYBC_REF_NUMBER}` +
      `&description=${PAYMENT_DESCRIPTION}` +
      `&trnNumber=${transaction.transactionOrderNumber}` +
      `&trnAmount=${transaction.totalTransactionAmount}` +
      `&redirectUri=${redirectUrl}` +
      `&trnDate=${date}` +
      `&glDate=${date}` +
      `&paymentMethod=${PAYBC_PAYMENT_METHOD}` +
      `&currency=${PAYMENT_CURRENCY}` +
      `&revenue=${revenue}` +
      `&ref2=${transaction.transactionId}`;

    // Generate the hash using the query string and the MD5 algorithm
    const payBCHash: string = convertToHash(
      `${queryString}${process.env.PAYBC_API_KEY}`,
      CRYPTO_ALGORITHM_MD5,
    );

    const hashExpiry = this.generateHashExpiry();

    return { queryString, payBCHash, hashExpiry };
  };

  @LogAsyncMethodExecution()
  async generateUrl(transaction: Transaction): Promise<string> {
    // Construct the URL with the transaction details for the payment gateway
    const { queryString, payBCHash } = await this.queryHash(transaction);
    const url =
      `${process.env.PAYBC_BASE_URL}?` +
      `${queryString}` +
      `&hashValue=${payBCHash}`;
    return url;
  }

  /**
   * Generates a transaction Order Number for ORBC and for forwarding to the payment gateway.
   *
   * @returns {string} The Transaction Order Number.
   */
  @LogAsyncMethodExecution()
  async generateTransactionOrderNumber(): Promise<string> {
    const seq: number = parseInt(
      await callDatabaseSequence(
        'permit.ORBC_TRANSACTION_NUMBER_SEQ',
        this.dataSource,
      ),
    );
    //Current epoch is 13 digit. using 2000000000000 in mod to result into 12 digit. will not generate duplicate value till year 2087. and will result into 8 character base36 string.
    //Using mod 35 with sequence number to get 35 unique values for each same timestamp mod evaluated earlier. decimal till digit 35 result into single base36 character.
    //Transaction number can not be more than 10 character hence the mod, to limit the character upto length of 10 character.
    //Done to minimize duplicate transaction number in dev and test.
    const trnNum =
      (Date.now() % 2000000000000).toString(36) + (seq % 35).toString(36);
    const transactionOrderNumber = 'T' + trnNum.padStart(9, '0').toUpperCase();

    return transactionOrderNumber;
  }

  /**
   * Generate Receipt Number
   */
  @LogAsyncMethodExecution()
  async generateReceiptNumber(): Promise<string> {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    const source = dateString;
    const seq = await callDatabaseSequence(
      'permit.ORBC_RECEIPT_NUMBER_SEQ',
      this.dataSource,
    );
    const receiptNumber = String(String(source) + '-' + String(seq));

    return receiptNumber;
  }

  /**
   * Creates a Refund Transaction in ORBC System, ensuring that payment methods align with user roles and enabled features.
   * The method verifies transactions against application status and computes transaction amounts.
   * It then creates and saves new transactions and their associated records, handling any CFS payment methods.
   *
   * @param applicationId - The ID of the application related to the refund transactions.
   * @param transactions - An array of transactions of type {@link RefundTransactionDto} to process.
   * @param currentUser - The current user object of type {@link IUserJWT}.
   * @param nestedQueryRunner - An optional query runner. If not provided, a new one is created.
   * @returns {Promise<ReadTransactionDto[]>} The created list of transactions of type {@link ReadTransactionDto}.
   * @throws UnprocessableEntityException - When the payment method type is invalid for the user or feature is disabled.
   * @throws BadRequestException - When the application status is not valid for the transaction.
   */
  @LogAsyncMethodExecution()
  async createRefundTransactions({
    applicationId,
    transactions,
    currentUser,
    nestedQueryRunner,
  }: {
    applicationId: string;
    transactions: PaymentTransactionDto[];
    currentUser: IUserJWT;
    nestedQueryRunner?: Nullable<QueryRunner>;
  }): Promise<ReadTransactionDto[]> {
    for (const transaction of transactions) {
      if (
        !doesUserHaveRole(currentUser.orbcUserRole, IDIR_USER_ROLE_LIST) &&
        transaction?.paymentMethodTypeCode !== PaymentMethodTypeEnum.WEB &&
        transaction?.paymentMethodTypeCode !== PaymentMethodTypeEnum.ACCOUNT &&
        transaction?.paymentMethodTypeCode !== PaymentMethodTypeEnum.NO_PAYMENT
      ) {
        throwUnprocessableEntityException(
          'Invalid payment method type for the user',
        );
      } else if (
        transaction?.paymentMethodTypeCode === PaymentMethodTypeEnum.ACCOUNT &&
        !(await isFeatureEnabled(this.cacheManager, 'CREDIT-ACCOUNT'))
      ) {
        throwUnprocessableEntityException('Disabled feature');
      }

      if (
        transaction?.paymentMethodTypeCode === PaymentMethodTypeEnum.POS &&
        !transaction?.paymentCardTypeCode
      ) {
        throwBadRequestException('paymentCardTypeCode', [
          `paymentCardTypeCode is required when paymentMethodTypeCode is ${transaction?.paymentMethodTypeCode}`,
        ]);
      }

      if (
        transaction?.paymentMethodTypeCode !==
          PaymentMethodTypeEnum.NO_PAYMENT &&
        transaction?.transactionAmount === 0
      ) {
        throwUnprocessableEntityException(
          `paymentMethodTypeCode should be ${PaymentMethodTypeEnum.NO_PAYMENT} when transaction amount is 0`,
        );
      }
    }

    let readTransactionDto: ReadTransactionDto[];
    const queryRunner =
      nestedQueryRunner || this.dataSource.createQueryRunner();
    if (!nestedQueryRunner) {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    }

    try {
      const existingApplication: Permit = await queryRunner.manager.findOne(
        Permit,
        {
          where: { permitId: applicationId },
          relations: { permitData: true },
        },
      );

      if (
        !(
          isVoidorRevoked(existingApplication.permitStatus) ||
          isApplicationInCart(existingApplication.permitStatus) ||
          isAmendmentApplication(existingApplication)
        )
      ) {
        throw new BadRequestException(
          'Application in its current status cannot be processed for payment.',
        );
      }

      const companyId = existingApplication?.company?.companyId;
      const validationResults =
        await this.policyService.validateApplicationAndCalculateCost({
          application: existingApplication,
          queryRunner,
          companyId,
        });

      const totalTransactionAmount = transactions?.reduce(
        (accumulator, item) => accumulator + item.transactionAmount,
        0,
      );
      const paymentValidationResult = validatePaymentReceived(
        validationResults?.cost?.at(0)?.cost,
        totalTransactionAmount,
        TransactionType.REFUND,
      );

      if (paymentValidationResult) {
        validationResults?.violations?.push(paymentValidationResult);
      }

      const policyEngineValidationFailure = evaluatePolicyViolations(
        existingApplication,
        currentUser,
        validationResults,
      );

      if (policyEngineValidationFailure) {
        throw throwUnprocessableEntityException(
          'Policy Engine Validation Failure',
          validationResults,
          'VALIDATION_FAILURE',
        );
      }

      let newTransactionList: Transaction[] = [];
      const date = new Date();
      for (const transaction of transactions) {
        const transactionOrderNumber =
          await this.generateTransactionOrderNumber();
        const newTransaction = new Transaction();
        newTransaction.transactionTypeId = TransactionType.REFUND;
        newTransaction.pgTransactionId = transaction.pgTransactionId;
        newTransaction.totalTransactionAmount = transaction.transactionAmount;
        newTransaction.paymentMethodTypeCode =
          transaction.paymentMethodTypeCode;
        newTransaction.paymentCardTypeCode = transaction.paymentCardTypeCode;
        newTransaction.pgCardType = transaction.paymentCardTypeCode;
        newTransaction.pgPaymentMethod = transaction.pgPaymentMethod;
        newTransaction.transactionOrderNumber = transactionOrderNumber;
        newTransaction.transactionApprovedDate = date;
        newTransaction.payerName = PPC_FULL_TEXT;
        if (transaction.paymentMethodTypeCode === PaymentMethodTypeEnum.WEB) {
          newTransaction.pgApproved = 1;
        }
        setBaseEntityProperties<Transaction>({
          entity: newTransaction,
          currentUser,
          date,
        });
        newTransactionList.push(newTransaction);
      }

      newTransactionList = await queryRunner.manager.save(newTransactionList);

      const receiptNumber = await this.generateReceiptNumber();
      let receipt = new Receipt();
      receipt.receiptNumber = receiptNumber;
      setBaseEntityProperties<Receipt>({ entity: receipt, currentUser });
      receipt = await queryRunner.manager.save(receipt);

      for (const newTransaction of newTransactionList) {
        let newPermitTransactions = new PermitTransaction();
        newPermitTransactions.transaction = newTransaction;
        newPermitTransactions.permit = existingApplication;
        newPermitTransactions.transactionAmount =
          newTransaction.totalTransactionAmount;
        setBaseEntityProperties<PermitTransaction>({
          entity: newPermitTransactions,
          currentUser,
          date,
        });
        newPermitTransactions = await queryRunner.manager.save(
          newPermitTransactions,
        );

        await queryRunner.manager.update(
          Transaction,
          { transactionId: newTransaction.transactionId },
          {
            receipt: receipt,
            updatedDateTime: new Date(),
            updatedUser: currentUser.userName,
            updatedUserDirectory: currentUser.orbcUserDirectory,
            updatedUserGuid: currentUser.userGUID,
          },
        );

        if (isCfsPaymentMethodType(newTransaction.paymentMethodTypeCode)) {
          const newCfsTransaction: CfsTransactionDetail =
            new CfsTransactionDetail();
          newCfsTransaction.transaction = newTransaction;
          newCfsTransaction.fileStatus = CfsFileStatus.READY;
          await queryRunner.manager.save(newCfsTransaction);
        }
      }

      if (!nestedQueryRunner) {
        await queryRunner.commitTransaction();
      }

      const createdTransaction = await queryRunner.manager.find(Transaction, {
        where: {
          transactionId: In(
            newTransactionList?.map(({ transactionId }) => transactionId),
          ),
        },
        relations: ['permitTransactions', 'permitTransactions.permit'],
      });

      readTransactionDto = await this.classMapper.mapArrayAsync(
        createdTransaction,
        Transaction,
        ReadTransactionDto,
      );
    } catch (error) {
      if (!nestedQueryRunner) {
        await queryRunner.rollbackTransaction();
      }
      this.logger.error(error);
      throw error;
    } finally {
      if (!nestedQueryRunner) {
        await queryRunner.release();
      }
    }

    return readTransactionDto;
  }

  /**
   * Creates a Transaction in ORBC System.
   * @param currentUser - The current user object of type {@link IUserJWT}
   * @param createTransactionDto - The createTransactionDto object of type
   * {@link CreateTransactionDto} for creating a new Transaction.
   * @returns {ReadTransactionDto} The created transaction of type {@link ReadTransactionDto}.
   */
  @LogAsyncMethodExecution()
  async createTransactions(
    currentUser: IUserJWT,
    createTransactionDto: CreateTransactionDto,
    nestedQueryRunner?: QueryRunner,
  ): Promise<ReadTransactionDto> {
    if (createTransactionDto.transactionTypeId !== TransactionType.PURCHASE) {
      throwUnprocessableEntityException('Invalid transaction type');
    }

    const featureFlags = await getMapFromCache(
      this.cacheManager,
      CacheKey.FEATURE_FLAG_TYPE,
    );
    const isStaffCanPayEnabled =
      featureFlags?.['STAFF-CAN-PAY'] &&
      (featureFlags['STAFF-CAN-PAY'] as FeatureFlagValue) ===
        FeatureFlagValue.ENABLED;
    const isRefundOrNoPayment =
      createTransactionDto.transactionTypeId == TransactionType.REFUND ||
      createTransactionDto.paymentMethodTypeCode ===
        PaymentMethodTypeEnum.NO_PAYMENT;

    // If the user is a staff user,
    // transacation is NOT a refund or no payment and STAFF-CAN-PAY is disabled,
    // throw an error
    if (
      doesUserHaveRole(currentUser.orbcUserRole, IDIR_USER_ROLE_LIST) &&
      !isRefundOrNoPayment &&
      !isStaffCanPayEnabled
    ) {
      throwUnprocessableEntityException(
        'Disabled feature - Feature flag: STAFF-CAN-PAY',
      );
    }
    if (
      !doesUserHaveRole(currentUser.orbcUserRole, IDIR_USER_ROLE_LIST) &&
      createTransactionDto?.paymentMethodTypeCode !==
        PaymentMethodTypeEnum.WEB &&
      createTransactionDto?.paymentMethodTypeCode !==
        PaymentMethodTypeEnum.ACCOUNT &&
      createTransactionDto?.paymentMethodTypeCode !==
        PaymentMethodTypeEnum.NO_PAYMENT
    ) {
      throwUnprocessableEntityException(
        'Invalid payment method type for the user',
      );
    } else if (
      createTransactionDto?.paymentMethodTypeCode ===
        PaymentMethodTypeEnum.ACCOUNT &&
      !(await isFeatureEnabled(this.cacheManager, 'CREDIT-ACCOUNT'))
    ) {
      throwUnprocessableEntityException('Disabled feature');
    }

    if (
      createTransactionDto?.paymentMethodTypeCode ===
        PaymentMethodTypeEnum.POS &&
      !createTransactionDto?.paymentCardTypeCode
    ) {
      throwBadRequestException('paymentCardTypeCode', [
        `paymentCardTypeCode is required when paymentMethodTypeCode is ${createTransactionDto?.paymentMethodTypeCode}`,
      ]);
    }

    let readTransactionDto: ReadTransactionDto;
    const queryRunner =
      nestedQueryRunner || this.dataSource.createQueryRunner();
    if (!nestedQueryRunner) {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    }
    //converting to comma separated string using join and then string array using split.
    const applicationIds: string[] =
      createTransactionDto.applicationDetails.map(
        ({ applicationId }) => applicationId,
      );

    try {
      const existingApplications: Permit[] = await queryRunner.manager.find(
        Permit,
        {
          where: { permitId: In(applicationIds) },
          relations: { permitData: true },
        },
      );

      let totalTransactionAmount = 0;
      const policyValidationDto: ReadPolicyValidationDto[] = [];
      for (const application of existingApplications) {
        if (
          !(
            isVoidorRevoked(application.permitStatus) ||
            isApplicationInCart(application.permitStatus) ||
            isAmendmentApplication(application)
          )
        ) {
          throw throwUnprocessableEntityException(
            `${application.applicationNumber} in its current status cannot be processed for payment.`,
            null,
            'TRANS_INVALID_APPLICATION_STATUS',
          );
        }

        const applicationFromDto =
          createTransactionDto?.applicationDetails?.find(
            (app) => app.applicationId === application.permitId,
          );

        const companyId = application?.company?.companyId;
        const validationResults =
          await this.policyService.validateApplicationAndCalculateCost({
            application,
            queryRunner,
            companyId,
          });

        const paymentValidationResult = validatePaymentReceived(
          validationResults?.cost?.at(0)?.cost,
          applicationFromDto?.transactionAmount,
          createTransactionDto?.transactionTypeId,
        );

        if (paymentValidationResult) {
          validationResults?.violations?.push(paymentValidationResult);
        }
        policyValidationDto.push({
          id: application.permitId,
          ...validationResults,
        });

        totalTransactionAmount += validationResults?.cost?.at(0)?.cost;
      }

      for (const policyValidation of policyValidationDto) {
        if (policyValidation?.violations?.length) {
          const existingApplication: Permit = await queryRunner.manager.findOne(
            Permit,
            {
              where: { permitId: policyValidation.id },
              relations: { permitData: true },
            },
          );
          const policyEngineValidationFailure = evaluatePolicyViolations(
            existingApplication,
            currentUser,
            policyValidation,
          );

          if (policyEngineValidationFailure) {
            throw throwUnprocessableEntityException(
              'Policy Engine Validation Failure',
              policyValidation,
              'VALIDATION_FAILURE',
            );
          }
        }
      }

      const transactionOrderNumber =
        await this.generateTransactionOrderNumber();

      let newTransaction = await this.classMapper.mapAsync(
        createTransactionDto,
        CreateTransactionDto,
        Transaction,
        {
          extraArgs: () => ({
            transactionOrderNumber: transactionOrderNumber,
            totalTransactionAmount: totalTransactionAmount,
            userName: currentUser.userName,
            userGUID: currentUser.userGUID,
            timestamp: new Date(),
            directory: currentUser.orbcUserDirectory,
          }),
        },
      );

      newTransaction = await queryRunner.manager.save(newTransaction);

      for (const existingApplication of existingApplications) {
        let newPermitTransactions = new PermitTransaction();
        newPermitTransactions.transaction = newTransaction;
        newPermitTransactions.permit = existingApplication;
        newPermitTransactions.createdDateTime = new Date();
        newPermitTransactions.createdUser = currentUser.userName;
        newPermitTransactions.createdUserDirectory =
          currentUser.orbcUserDirectory;
        newPermitTransactions.createdUserGuid = currentUser.userGUID;
        newPermitTransactions.updatedDateTime = new Date();
        newPermitTransactions.updatedUser = currentUser.userName;
        newPermitTransactions.updatedUserDirectory =
          currentUser.orbcUserDirectory;
        newPermitTransactions.updatedUserGuid = currentUser.userGUID;
        newPermitTransactions.transactionAmount =
          createTransactionDto.applicationDetails
            .filter(
              (application) =>
                application.applicationId === existingApplication.permitId,
            )
            .map((application) => application.transactionAmount)[0];
        newPermitTransactions = await queryRunner.manager.save(
          newPermitTransactions,
        );

        if (isCfsPaymentMethodType(newTransaction.paymentMethodTypeCode)) {
          const newCfsTransaction: CfsTransactionDetail =
            new CfsTransactionDetail();
          newCfsTransaction.transaction = newTransaction;
          newCfsTransaction.fileStatus = CfsFileStatus.READY;
          await queryRunner.manager.save(newCfsTransaction);
        }
        if (
          isWebTransactionPurchase(
            newTransaction.paymentMethodTypeCode,
            newTransaction.transactionTypeId,
          )
        ) {
          existingApplication.permitStatus = ApplicationStatus.WAITING_PAYMENT;
          existingApplication.updatedDateTime = new Date();
          existingApplication.updatedUser = currentUser.userName;
          existingApplication.updatedUserDirectory =
            currentUser.orbcUserDirectory;
          existingApplication.updatedUserGuid = currentUser.userGUID;

          await queryRunner.manager.save(existingApplication);
        } else if (
          isTransactionPurchase(newTransaction.transactionTypeId) &&
          !isVoidorRevoked(existingApplication.permitStatus)
        ) {
          existingApplication.permitStatus = ApplicationStatus.PAYMENT_COMPLETE;
          existingApplication.updatedDateTime = new Date();
          existingApplication.updatedUser = currentUser.userName;
          existingApplication.updatedUserDirectory =
            currentUser.orbcUserDirectory;
          existingApplication.updatedUserGuid = currentUser.userGUID;

          await queryRunner.manager.save(existingApplication);
        }
      }

      const createdTransaction = await queryRunner.manager.findOne(
        Transaction,
        {
          where: { transactionId: newTransaction.transactionId },
          relations: ['permitTransactions', 'permitTransactions.permit'],
        },
      );

      let url: string = undefined;
      if (
        isWebTransactionPurchase(
          createdTransaction.paymentMethodTypeCode,
          createdTransaction.transactionTypeId,
        )
      ) {
        // Only payment using PayBC should generate the url
        url = await this.generateUrl(createdTransaction);
      }

      if (
        !isWebTransactionPurchase(
          createdTransaction.paymentMethodTypeCode,
          createdTransaction.transactionTypeId,
        )
      ) {
        const receiptNumber = await this.generateReceiptNumber();
        let receipt = new Receipt();
        receipt.receiptNumber = receiptNumber;
        receipt.createdDateTime = new Date();
        receipt.createdUser = currentUser.userName;
        receipt.createdUserDirectory = currentUser.orbcUserDirectory;
        receipt.createdUserGuid = currentUser.userGUID;
        receipt.updatedDateTime = new Date();
        receipt.updatedUser = currentUser.userName;
        receipt.updatedUserDirectory = currentUser.orbcUserDirectory;
        receipt.updatedUserGuid = currentUser.userGUID;
        receipt = await queryRunner.manager.save(receipt);

        await queryRunner.manager.update(
          Transaction,
          { transactionId: createdTransaction.transactionId },
          {
            receipt: receipt,
            updatedDateTime: new Date(),
            updatedUser: currentUser.userName,
            updatedUserDirectory: currentUser.orbcUserDirectory,
            updatedUserGuid: currentUser.userGUID,
          },
        );
      }

      readTransactionDto = await this.classMapper.mapAsync(
        createdTransaction,
        Transaction,
        ReadTransactionDto,
        {
          extraArgs: () => ({
            url: url,
          }),
        },
      );

      if (!nestedQueryRunner) {
        await queryRunner.commitTransaction();
      }
    } catch (error) {
      if (!nestedQueryRunner) {
        await queryRunner.rollbackTransaction();
      }
      this.logger.error(error);
      throw error;
    } finally {
      if (!nestedQueryRunner) {
        await queryRunner.release();
      }
    }

    return readTransactionDto;
  }

  @LogAsyncMethodExecution()
  async updateReceiptDocument(
    currentUser: IUserJWT,
    receiptId: string,
    documentId: string,
  ) {
    const updateResult = await this.receiptRepository
      .createQueryBuilder()
      .update()
      .set({
        receiptDocumentId: documentId,
        updatedUser: currentUser.userName,
        updatedDateTime: new Date(),
        updatedUserDirectory: currentUser.orbcUserDirectory,
        updatedUserGuid: currentUser.userGUID,
      })
      .where('receiptId = :receiptId', { receiptId: receiptId })
      .andWhere('receiptDocumentId IS NULL')
      .execute();

    if (updateResult.affected === 0) {
      throw new InternalServerErrorException('Update receipt document failed');
    }
    return true;
  }

  /**
   * Updates details returned by Payment Gateway in ORBC System.
   * @param currentUser - The current user object of type {@link IUserJWT}
   * @param updatePaymentGatewayTransactionDto - The UpdatePaymentGatewayTransactionDto object of type
   *                                {@link UpdatePaymentGatewayTransactionDto} for updating the payment gateway details.
   * @returns {ReadTransactionDto} The updated payment gateway of type {@link ReadPaymentGatewayTransactionDto}.
   */
  async updateTransactions(
    currentUser: IUserJWT,
    transactionId: string,
    updatePaymentGatewayTransactionDto: UpdatePaymentGatewayTransactionDto,
    queryString: string,
  ): Promise<ReadPaymentGatewayTransactionDto> {
    let query: string, hashValue: string;
    //Code QL fixes
    if (typeof queryString === 'string') {
      const re = /\+/gi;
      query = queryString
        .substring(0, queryString.indexOf('hashValue=') - 1)
        .replace(re, ' ');
      hashValue = queryString.substring(
        queryString.indexOf('hashValue=') + 10,
        queryString.length,
      );
    }
    const validHash =
      convertToHash(
        `${query}${process.env.PAYBC_API_KEY}`,
        CRYPTO_ALGORITHM_MD5,
      ) === hashValue;
    const validDto = this.validateUpdateTransactionDto(
      updatePaymentGatewayTransactionDto,
      `${query}&hashValue=${hashValue}`,
    );

    if (!validHash) {
      throw new InternalServerErrorException('Invalid Hash');
    }
    if (!validDto) {
      throw new InternalServerErrorException('Invalid Transaction Data');
    }
    let updatedTransaction: Transaction;
    let updateResult: UpdateResult;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const transactionToUpdate = await queryRunner.manager.findOne(
        Transaction,
        {
          where: { transactionId: transactionId },
          relations: ['permitTransactions', 'permitTransactions.permit'],
        },
      );

      if (!transactionToUpdate) {
        throw new NotFoundException('TransactionId not found');
      }

      transactionToUpdate.permitTransactions.forEach((permitTransaction) => {
        if (
          permitTransaction.permit.permitStatus !=
          ApplicationStatus.WAITING_PAYMENT
        ) {
          throw new BadRequestException(
            `${permitTransaction.permit.permitId} not in valid status!`,
          );
        }
      });

      const updateTransactionTemp = await this.classMapper.mapAsync(
        updatePaymentGatewayTransactionDto,
        UpdatePaymentGatewayTransactionDto,
        Transaction,
        {
          extraArgs: () => ({
            userName: currentUser.userName,
            firstName: currentUser.orbcUserFirstName,
            lastName: currentUser.orbcUserLastName,
            userGUID: currentUser.userGUID,
            timestamp: new Date(),
            directory: currentUser.orbcUserDirectory,
          }),
        },
      );

      updateResult = await queryRunner.manager.update(
        Transaction,
        { transactionId: transactionId },
        updateTransactionTemp,
      );

      if (!updateResult?.affected) {
        throw new InternalServerErrorException('Error updating transaction');
      }

      if (updateTransactionTemp.pgApproved === 1) {
        for (const permitTransaction of transactionToUpdate.permitTransactions) {
          updateResult = await queryRunner.manager.update(
            Permit,
            { permitId: permitTransaction.permit.permitId },
            {
              permitStatus: ApplicationStatus.PAYMENT_COMPLETE,
              updatedDateTime: new Date(),
              updatedUser: currentUser.userName,
              updatedUserGuid: currentUser.userGUID,
              updatedUserDirectory: currentUser.orbcUserDirectory,
            },
          );
          if (!updateResult?.affected) {
            throw new InternalServerErrorException(
              'Error updating permit status',
            );
          }
        }
      }

      updatedTransaction = await queryRunner.manager.findOne(Transaction, {
        where: { transactionId: transactionId },
        relations: ['permitTransactions', 'permitTransactions.permit'],
      });

      if (updateTransactionTemp.pgApproved === 1) {
        const receiptNumber = await this.generateReceiptNumber();
        let receipt = new Receipt();
        receipt.receiptNumber = receiptNumber;
        receipt.createdDateTime = new Date();
        receipt.createdUser = currentUser.userName;
        receipt.createdUserDirectory = currentUser.orbcUserDirectory;
        receipt.createdUserGuid = currentUser.userGUID;
        receipt.updatedDateTime = new Date();
        receipt.updatedUser = currentUser.userName;
        receipt.updatedUserDirectory = currentUser.orbcUserDirectory;
        receipt.updatedUserGuid = currentUser.userGUID;
        receipt = await queryRunner.manager.save(receipt);

        await queryRunner.manager.update(
          Transaction,
          { transactionId: updatedTransaction.transactionId },
          {
            receipt: receipt,
            updatedDateTime: new Date(),
            updatedUser: currentUser.userName,
            updatedUserDirectory: currentUser.orbcUserDirectory,
            updatedUserGuid: currentUser.userGUID,
          },
        );
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }

    const readTransactionDto = await this.classMapper.mapAsync(
      updatedTransaction,
      Transaction,
      ReadPaymentGatewayTransactionDto,
    );

    return readTransactionDto;
  }

  async findTransaction(transactionId: string): Promise<ReadTransactionDto> {
    return await this.classMapper.mapAsync(
      await this.findTransactionEntity(transactionId),
      Transaction,
      ReadTransactionDto,
    );
  }

  async findTransactionEntity(transactionId: string): Promise<Transaction> {
    return await this.transactionRepository.findOne({
      where: { transactionId: transactionId },
      relations: ['permitTransactions', 'permitTransactions.permit'],
    });
  }

  validateUpdateTransactionDto(
    updatePaymentGatewayTransactionDto: UpdatePaymentGatewayTransactionDto,
    queryString: string,
  ): boolean {
    const params = new URLSearchParams(queryString);
    const trnApproved = updatePaymentGatewayTransactionDto.pgApproved;
    const messageText = updatePaymentGatewayTransactionDto.pgMessageText;
    const trnOrderId = updatePaymentGatewayTransactionDto.pgTransactionId;
    const trnAmount = params.get('trnAmount');
    const paymentMethod = updatePaymentGatewayTransactionDto.pgPaymentMethod;
    const cardType = updatePaymentGatewayTransactionDto.pgCardType ?? '';
    const authCode = updatePaymentGatewayTransactionDto.pgAuthCode;
    const trnDate = params.get('trnDate');
    const ref2 = params.get('ref2');
    const pbcTxnNumber = params.get('pbcTxnNumber');
    const hashValue = params.get('hashValue');
    const query =
      `trnApproved=${trnApproved}` +
      `&messageText=${messageText}` +
      `&trnOrderId=${trnOrderId}` +
      `&trnAmount=${trnAmount}` +
      `&paymentMethod=${paymentMethod}` +
      `&cardType=${cardType}` +
      `&authCode=${authCode}` +
      `&trnDate=${trnDate}` +
      `&ref2=${ref2}` +
      `&pbcTxnNumber=${pbcTxnNumber}`;
    return (
      convertToHash(
        `${query}${process.env.PAYBC_API_KEY}`,
        CRYPTO_ALGORITHM_MD5,
      ) === hashValue
    );
  }

  async findAllPaymentMethodTypeEntities(): Promise<PaymentMethodType[]> {
    return await this.paymentMethodTypeRepository.find();
  }

  async findAllPaymentCardTypeEntities(): Promise<PaymentCardType[]> {
    return await this.paymentCardTypeRepository.find();
  }
}
