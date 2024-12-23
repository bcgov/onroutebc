import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Brackets, DataSource, In, QueryRunner, Repository } from 'typeorm';
import { Permit } from '../permit/entities/permit.entity';
import { LogAsyncMethodExecution } from '../../../common/decorator/log-async-method-execution.decorator';
import { ApplicationStatus } from '../../../common/enum/application-status.enum';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { CreateTransactionDto } from '../payment/dto/request/create-transaction.dto';
import { isCVClient } from 'src/common/helper/common.helper';
import { TIMEZONE_PACIFIC } from 'src/common/constants/api.constant';
import {
  calculatePermitAmount,
  permitFee,
  validAmount,
} from 'src/common/helper/permit-fee.helper';
import { PermitHistoryDto } from '../permit/dto/response/permit-history.dto';
import { SpecialAuth } from 'src/modules/special-auth/entities/special-auth.entity';
import {
  isAmendmentApplication,
  validApplicationDates,
} from 'src/common/helper/permit-application.helper';
import {
  ApplicationDataValidationDto,
  CartValidationDto,
} from './dto/response/cart-validation.dto';
import {
  Loas,
  PermitData,
} from 'src/common/interface/permit.template.interface';
import { LoaDetail } from 'src/modules/special-auth/entities/loa-detail.entity';
import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodType } from 'src/common/enum/payment-method-type.enum';
import { PgApprovesStatus } from 'src/common/enum/pg-approved-status-type.enum';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ReadLoaDto } from 'src/modules/special-auth/dto/response/read-loa.dto';
import { PermitType } from 'src/common/enum/permit-type.enum';
import { convertToHash } from 'src/common/helper/crypto.helper';
import { todayDate } from 'src/common/helper/date-time.helper';

@Injectable()
export class ApplicationValidationService {
  private readonly logger = new Logger(ApplicationValidationService.name);
  private validationDto: CartValidationDto;
  private applicationDataValidationDto: ApplicationDataValidationDto;
  private errorCount;

  constructor(
    private dataSource: DataSource,
    @InjectMapper() private readonly classMapper: Mapper,

    @InjectRepository(LoaDetail)
    private loaDetailRepository: Repository<LoaDetail>,
  ) {}

  async validateApplication(
    currentUser: IUserJWT,

    createTransactionDto: CreateTransactionDto,
  ): Promise<CartValidationDto> {
    this.validationDto = new CartValidationDto();
    this.errorCount = 0;
    this.validationDto.applicationValidationResult = [];
    const isCVClientUser: boolean = isCVClient(currentUser.identity_provider);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    //converting to comma separated string using join and then string array using split.
    const applicationIds: string[] =
      createTransactionDto.applicationDetails.map(
        ({ applicationId }) => applicationId,
      );
    try {
      const applications: Permit[] = await queryRunner.manager.find(Permit, {
        where: { permitId: In(applicationIds) },
        relations: { permitData: true },
      });

      //Loop to validate each application data for dates, application status, LoA, amount.
      for (const application of applications) {
        this.applicationDataValidationDto = new ApplicationDataValidationDto();
        this.applicationDataValidationDto.errors = [];
        this.applicationDataValidationDto.applicationNumber =
          application.applicationNumber;

        /* Check if each application has a valid start date and valid expiry date.
        ** If an application has invalid dates then push the error to applicationDataValidationDto.error 
        ** Also validate dates for client only as staff is allowed to work on back dated applications but client is not.*/
        if (
          isCVClientUser &&
          !validApplicationDates(application, TIMEZONE_PACIFIC)
        ) {
          this.applicationDataValidationDto.errors.push(
            'Application dates are invalid.',
          );
          this.errorCount += 1;
        }
        const transactionAmountCalculated = await this.permitFeeCalculator(
          application,
          queryRunner,
        );

        /* Check if each application has a valid amount as per its duration and permit type and special authorizations.
        ** If an application has invalid amount then push the error to applicationDataValidationDto.error*/
        if (
          !validAmount(
            transactionAmountCalculated,
            createTransactionDto.applicationDetails[
              createTransactionDto.applicationDetails.findIndex(
                (a) => a.applicationId == application.permitId,
              )
            ].transactionAmount,
            createTransactionDto.transactionTypeId,
          )
        ) {
          this.applicationDataValidationDto.errors.push(
            `Transaction amount mismatch`,
          );
          this.errorCount += 1;
        }
        /* Check if each application is in a valid status.
        ** If an application has invalid status then push the error to applicationDataValidationDto.error */
        if (
          !(
            this.isVoidorRevoked(application.permitStatus) ||
            this.isApplicationInCart(application.permitStatus) ||
            isAmendmentApplication(application)
          )
        ) {
          this.applicationDataValidationDto.errors.push(
            'Application in its current status cannot be processed for payment',
          );
          this.errorCount += 1;
        }

        const permitData = JSON.parse(
          application.permitData.permitData,
        ) as PermitData;
        // If application includes LoAs then validate Loa data.
        if (permitData.loas) 
          {
            await this.isValidLoa(application);
          }
        // Add application validation result to CartValidationDto.
        this.validationDto.applicationValidationResult.push(
          this.applicationDataValidationDto,
        );
      }
      // Generate hash if all cart items are valid i.e. do not have any error.
      if (this.errorCount === 0) {
        const amount: number[] = createTransactionDto.applicationDetails.map(
          ({ transactionAmount }) => transactionAmount,
        );
        this.generatevalidationHash(applicationIds, amount);
      }
      return this.validationDto;
    } catch (error) {
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
  generatevalidationHash(applicationIds: string[], amount: number[]): void {
    const date = new Date();
    const hash =
      applicationIds.join() +
      amount.join() +
      date.toString() +
      todayDate() +
      process.env.VALIDATION_HASH_SALT;
    this.validationDto.validationDateTime = date;
    this.validationDto.hash = convertToHash(
      hash,
      process.env.VALIDATION_HASH_ALGOROTHM,
    );
  }
  /**
   * Calculates the permit fee based on the application status, historical payments, and current permit data.
   * If the application is revoked, it returns 0. For voided applications, it calculates the refund amount.
   * Otherwise, it calculates the fee based on existing payments and current permit data.
   *
   * @param application - The Permit application for which to calculate the fee.
   * @param queryRunner - An optional QueryRunner for database transactions.
   * @returns {Promise<number>} - The calculated permit fee or refund amount.
   */
  @LogAsyncMethodExecution()
  async permitFeeCalculator(
    application: Permit,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    if (application.permitStatus === ApplicationStatus.REVOKED) return 0;

    const permitPaymentHistory = await this.findPermitHistory(
      application.originalPermitId,
      queryRunner,
    );
    const isNoFee = await this.findNoFee(
      application.company.companyId,
      queryRunner,
    );
    const oldAmount =
      permitPaymentHistory.length > 0
        ? calculatePermitAmount(permitPaymentHistory)
        : undefined;
    const fee = permitFee(application, isNoFee, oldAmount);
    return fee;
  }

  @LogAsyncMethodExecution()
  async findNoFee(
    companyId: number,
    queryRunner: QueryRunner,
  ): Promise<boolean> {
    const specialAuth = await queryRunner.manager
      .createQueryBuilder()
      .select('specialAuth')
      .from(SpecialAuth, 'specialAuth')
      .innerJoinAndSelect('specialAuth.company', 'company')
      .where('company.companyId = :companyId', { companyId: companyId })
      .getOne();
    return !!specialAuth && !!specialAuth.noFeeType;
  }

  @LogAsyncMethodExecution()
  async findPermitHistory(
    originalPermitId: string,
    queryRunner: QueryRunner,
  ): Promise<PermitHistoryDto[]> {
    // Fetches the permit history for a given originalPermitId using the provided QueryRunner
    // This includes all related transactions and filters permits by non-null permit numbers
    // Orders the results by transaction submission date in descending order

    const permits = await queryRunner.manager
      .createQueryBuilder()
      .select('permit')
      .from(Permit, 'permit')
      .innerJoinAndSelect('permit.permitTransactions', 'permitTransactions')
      .innerJoinAndSelect('permitTransactions.transaction', 'transaction')
      .where('permit.permitNumber IS NOT NULL')
      .andWhere('permit.originalPermitId = :originalPermitId', {
        originalPermitId: originalPermitId,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'transaction.paymentMethodTypeCode != :paymentType OR ( transaction.paymentMethodTypeCode = :paymentType AND transaction.pgApproved = :approved)',
            {
              paymentType: PaymentMethodType.WEB,
              approved: PgApprovesStatus.APPROVED,
            },
          );
        }),
      )
      .orderBy('transaction.transactionSubmitDate', 'DESC')
      .getMany();

    return permits.flatMap((permit) =>
      permit.permitTransactions.map((permitTransaction) => ({
        permitNumber: permit.permitNumber,
        comment: permit.comment,
        transactionOrderNumber:
          permitTransaction.transaction.transactionOrderNumber,
        transactionAmount: permitTransaction.transactionAmount,
        transactionTypeId: permitTransaction.transaction.transactionTypeId,
        pgPaymentMethod: permitTransaction.transaction.pgPaymentMethod,
        pgTransactionId: permitTransaction.transaction.pgTransactionId,
        paymentCardTypeCode: permitTransaction.transaction.paymentCardTypeCode,
        paymentMethodTypeCode:
          permitTransaction.transaction.paymentMethodTypeCode,
        commentUsername: permit.createdUser,
        permitId: +permit.permitId,
        transactionSubmitDate:
          permitTransaction.transaction.transactionSubmitDate,
        pgApproved: permitTransaction.transaction.pgApproved,
      })),
    ) as PermitHistoryDto[];
  }

  async isValidLoa(permit: Permit): Promise<void> {
    const { companyId } = permit.company;
    const permitData = JSON.parse(permit.permitData.permitData) as PermitData;
    const { vehicleId: permitVehicleId, vehicleType: permitVehicleType } =
      permitData.vehicleDetails;
    const loaNumbers = permitData.loas.map((loa) => loa.loaNumber);
    const readLoaDto = await this.findLoas(companyId, loaNumbers);

    // Validate LOA details and permit data against database entries
    this.validateLoaDetails(
      readLoaDto,
      permit,
      permitVehicleId,
      permitVehicleType,
    );

    // validate LoA snapshot in permit Data
    this.validatePermitDataAgainstLoas(
      permitData,
      permit,
      permitVehicleId,
      permitVehicleType,
    );
  }
  private validateLoaDetails(
    readLoaDtos: ReadLoaDto[],
    permit: Permit,
    permitVehicleId: string,
    permitVehicleType: string,
  ) {
    for (const readLoaDto of readLoaDtos) {
      const loaPowerUnits = readLoaDto.powerUnits;
      const loaTrailers = readLoaDto.trailers;
      const loaPermitTypes = readLoaDto.loaPermitType;
      if (!this.isValidDateForLoa(readLoaDto, permit)) {
        this.applicationDataValidationDto.errors.push(
          'LoA with invalid date(s).',
        );
        this.errorCount += 1;
      }
      if (
        !this.isVehicleTypeValid(
          permitVehicleType,
          permitVehicleId,
          loaPowerUnits,
          loaTrailers,
        )
      ) {
        this.applicationDataValidationDto.errors.push(
          'LoA with invalid vehicle(s).',
        );
        this.errorCount += 1;
      }
      if (!this.isPermitTypeValid(permit.permitType, loaPermitTypes)) {
        this.applicationDataValidationDto.errors.push(
          'LoA with invalid permitType.',
        );
        this.errorCount += 1;
      }
    }
  }

  private validatePermitDataAgainstLoas(
    permitData: PermitData,
    permit: Permit,
    permitVehicleId: string,
    permitVehicleType: string,
  ) {
    for (const loa of permitData.loas) {
      const permitLoaPowerUnits = loa.powerUnits;
      const permitLoaTrailers = loa.trailers;
      const permitTypesLoa = loa.loaPermitType;
      if (!this.isValidDateForLoa(loa, permit)) {
        this.applicationDataValidationDto.errors.push(
          'Application has an LoA snapshot with invalid date(s).',
        );
        this.errorCount += 1;
      }

      if (
        !this.isVehicleTypeValid(
          permitVehicleType,
          permitVehicleId,
          permitLoaPowerUnits,
          permitLoaTrailers,
        )
      ) {
        this.applicationDataValidationDto.errors.push(
          'Application has an LoA snapshot with invalid vehicle(s).',
        );
        this.errorCount += 1;
      }
      if (!this.isPermitTypeValid(permit.permitType, permitTypesLoa)) {
        this.applicationDataValidationDto.errors.push(
          'Application has an LoA snapshot with invalid permitType.',
        );
        this.errorCount += 1;
      }
    }
  }

  private isVehicleTypeValid(
    permitVehicleType: string,
    permitVehicleId: string,
    powerUnits?: string[],
    trailers?: string[],
  ): boolean {
    const isPowerUnitAllowed =
      permitVehicleType === 'powerUnit'
        ? powerUnits.includes(permitVehicleId)
        : true;

    const isTrailerAllowed =
      permitVehicleType === 'trailer'
        ? trailers.includes(permitVehicleId)
        : true;

    return isPowerUnitAllowed && isTrailerAllowed;
  }

  private isPermitTypeValid(
    permitTypePermit: PermitType,
    permitType: PermitType[],
  ): boolean {
    return permitType.includes(permitTypePermit);
  }

  private isValidDateForLoa(
    loaDetail: Loas | ReadLoaDto,
    permit: Permit,
  ): boolean {
    const { startDate, expiryDate } = loaDetail;
    const { startDate: permitStartDate, expiryDate: permitExpiryDate } =
      permit.permitData;

    return (
      dayjs(startDate).isBefore(permitStartDate, 'day') &&
      (expiryDate ? dayjs(expiryDate).isAfter(permitExpiryDate, 'day') : true)
    );
  }

  /**
   * Retrieves a single LOA (Letter of Authorization) detail for a specified company.
   *
   * Steps:
   * 1. Fetches the LOA detail from the repository based on company ID and LOA ID.
   * 2. Ensures the fetched LOA detail is active.
   * 3. Includes relations (company, loaVehicles, loaPermitTypes) in the query.
   *
   * @param {number} companyId - ID of the company for which to fetch the LOA detail.
   * @param {number} loaId - ID of the LOA to be fetched.
   * @returns {Promise<LoaDetail>} - Returns a Promise that resolves to the LOA detail.
   */
  @LogAsyncMethodExecution()
  async findLoas(
    companyId: number,
    loaNumbers: number[],
  ): Promise<ReadLoaDto[]> {
    // Fetch initial active LOA details
    const loaDetails = await this.loaDetailRepository.find({
      where: {
        loaNumber: In(loaNumbers),
        isActive: true,
        company: { companyId },
      },
      relations: ['company', 'loaVehicles', 'loaPermitTypes'],
    });

    const readLoaDto = await this.classMapper.mapArrayAsync(
      loaDetails,
      LoaDetail,
      ReadLoaDto,
      {
        extraArgs: () => ({ companyId: companyId }),
      },
    );
    return readLoaDto;
  }

  private isApplicationInCart(permitStatus: ApplicationStatus) {
    return permitStatus === ApplicationStatus.IN_CART;
  }

  private isVoidorRevoked(permitStatus: ApplicationStatus) {
    return (
      permitStatus === ApplicationStatus.VOIDED ||
      permitStatus === ApplicationStatus.REVOKED
    );
  }
}
