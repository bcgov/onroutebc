import {
  BadRequestException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
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
import { isAmendmentApplication, validApplicationDates } from 'src/common/helper/permit-application.helper';
import { ApplicationDataValidationDto, CartValidationDto, Status } from './dto/response/cart-validation.dto';
import { Loas, PermitData } from 'src/common/interface/permit.template.interface';
import { LoaDetail } from 'src/modules/special-auth/entities/loa-detail.entity';
import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodType } from 'src/common/enum/payment-method-type.enum';
import { PgApprovesStatus } from 'src/common/enum/pg-approved-status-type.enum';


@Injectable()
export class ApplicationValidationService {
  private readonly logger = new Logger(ApplicationValidationService.name);
  private readonly validationDto = new CartValidationDto();

  constructor(private dataSource: DataSource,
    @InjectRepository(LoaDetail)
    private loaDetailRepository: Repository<LoaDetail>,
  ) {}

  async validateApplication(
    currentUser: IUserJWT,

    createTransactionDto: CreateTransactionDto,
  ): Promise<CartValidationDto> {
    this.validationDto.applicationValidationResult=[];
    let totalTransactionAmountCalculated = 0;
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
     try {
        await this.validateApplicationAndPayment(
          createTransactionDto,
          applications,
          currentUser,
          queryRunner,
        );
      } catch (error) {
        if (error instanceof BadRequestException) {
          this.validationDto.status = Status.ERROR;
          this.validationDto.error = error.message;
        }
      }
      for (const application of applications) {
        const applicationDataValidationDto = new ApplicationDataValidationDto();
        applicationDataValidationDto.errors = [];
        applicationDataValidationDto.applicationNumber = application.applicationNumber;

         //Check if each application has a valid start date and valid expiry date.
      if (
        isCVClientUser &&
        !validApplicationDates(application, TIMEZONE_PACIFIC)
      ) {
          applicationDataValidationDto.errors.push('Application in its current status cannot be processed for payment');
      }
      totalTransactionAmountCalculated += await this.permitFeeCalculator(
        application,
        queryRunner,
      );
        if (
          !(
            this.isVoidorRevoked(application.permitStatus) ||
            this.isApplicationInCart(application.permitStatus) ||
            isAmendmentApplication(application)
          )
        ){
          applicationDataValidationDto.errors.push('Application in its current status cannot be processed for payment');
          this.validationDto.applicationValidationResult.push(applicationDataValidationDto);
        }

        const permitData = JSON.parse(
          application.permitData.permitData,
        ) as PermitData;
        if (permitData.loas) await this.isValidLoa(application);
      }
      const totalTransactionAmount =
      createTransactionDto.applicationDetails?.reduce(
        (accumulator, item) => accumulator + item.transactionAmount,
        0,
      );
    if (
      !validAmount(
        totalTransactionAmountCalculated,
        totalTransactionAmount,
        createTransactionDto.transactionTypeId,
      )
    )
    this.validationDto.error = `Transaction amount mismatch.calculated ${totalTransactionAmountCalculated} and received ${totalTransactionAmount}`
      //throw new BadRequestException('Transaction amount mismatch.');
      return this.validationDto;
    } catch (error) {
      console.log(error);
    } finally {
      await queryRunner.release();
    }
  }
  /**
   * Validates the payment information in the request against the backend data, calculates the transaction amount,
   * and checks for transaction type and amount consistency.
   *
   * This method first calculates the total transaction amount based on the backend permit data and
   * compares it with the transaction amount sent in the request to ensure they match. If there's a mismatch, it throws an error.
   * Additionally, for refund transactions, it checks if the total calculated transaction amount is negative as expected;
   * if not, it throws an error.
   *
   * @param {CreateTransactionDto} createTransactionDto - The DTO containing the transaction details from the request.
   * @param {Permit[]} applications - A list of permits associated with the transaction.
   * @param {QueryRunner} nestedQueryRunner - The query runner to use for database operations within the method.
   * @returns {Promise<number>} The total transaction amount calculated from the backend data.
   * @throws {BadRequestException} When the transaction amount in the request doesn't match with the calculated amount,
   * or if there's a transaction type and amount mismatch in case of refunds.
   */
  private async validateApplicationAndPayment(
    createTransactionDto: CreateTransactionDto,
    applications: Permit[],
    currentUser: IUserJWT,
    queryRunner: QueryRunner,
  ) {
    let totalTransactionAmountCalculated = 0;
    const isCVClientUser: boolean = isCVClient(currentUser.identity_provider);
    // Calculate and add amount for each requested application, as per the available backend data.
    for (const application of applications) {
      //Check if each application has a valid start date and valid expiry date.
      if (
        isCVClientUser &&
        !validApplicationDates(application, TIMEZONE_PACIFIC)
      ) {
        throw new UnprocessableEntityException(
          `Atleast one of the application has invalid startDate or expiryDate.`,
        );
      }
      totalTransactionAmountCalculated += await this.permitFeeCalculator(
        application,
        queryRunner,
      );
    }
    const totalTransactionAmount =
      createTransactionDto.applicationDetails?.reduce(
        (accumulator, item) => accumulator + item.transactionAmount,
        0,
      );
    if (
      !validAmount(
        totalTransactionAmountCalculated,
        totalTransactionAmount,
        createTransactionDto.transactionTypeId,
      )
    )
    this.validationDto.error = `Transaction amount mismatch.calculated ${totalTransactionAmountCalculated} and received ${totalTransactionAmount}`
      //throw new BadRequestException('Transaction amount mismatch.');
    return totalTransactionAmount;
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
    const { vehicleId: permitVehicleId, vehicleType: permitVehicleType } = permitData.vehicleDetails;
    const loaIds = permitData.loas.map((loa) => loa.loaId);
  
    const loaDetails = await this.findLoasByIds(companyId, loaIds);
  
    // Validate LOA details and permit data against database entries
    //const loaValidationDto = 
    this.validateLoaDetails(
      loaDetails,
      permit,
      permitVehicleId,
      permitVehicleType,
    );
  
    //this.mergeValidationResults(loaValidationDto);
  
    //const permitValidationDto =
     this.validatePermitDataAgainstLoas(
      permitData,
      permit,
      permitVehicleId,
      permitVehicleType,
    );
  
  //  this.mergeValidationResults(permitValidationDto);
  }
  private mergeValidationResults(applicationValidationDto: ApplicationDataValidationDto): void {
    const existingValidationResult = this.validationDto?.applicationValidationResult?.find(
      (dto) => dto.applicationNumber === applicationValidationDto.applicationNumber,
    );
  
    if (existingValidationResult) {
      // Merge errors if the validation DTO already exists
      if (applicationValidationDto.errors) {
        existingValidationResult.errors.push(...applicationValidationDto.errors);
      }
    } else {
      // If no matching DTO is found, add it to the results
      this.validationDto?.applicationValidationResult?.push(applicationValidationDto);
    }
  }
  private validateLoaDetails(
    loaDetails: LoaDetail[],
    permit: Permit,
    permitVehicleId: string,
    permitVehicleType: string,
  ) {
    const applicationDataValidationDto = new ApplicationDataValidationDto();
    applicationDataValidationDto.applicationNumber = permit.applicationNumber;
    for (const loaDetail of loaDetails) {
      const allowedPowerUnits: string []= [];
      const allowedTrailers: string []= [];
      const allowedPermitTypes: string []= [];
      this.collectAllowedVehiclesAndPermitTypes(loaDetail, allowedPowerUnits, allowedTrailers, allowedPermitTypes);
      if (!this.isValidDateForLoa(loaDetail, permit)) {
        applicationDataValidationDto.errors.push('LoA with invalid date(s).')
      }
      if(!this.isVehicleTypeValid(permitVehicleType, permitVehicleId, allowedPowerUnits, allowedTrailers)){
        applicationDataValidationDto.errors.push('LoA with invalid vehicle(s).')
  
       }
        if(!this.isPermitTypeValid(permit.permitType, allowedPermitTypes)){
          applicationDataValidationDto.errors.push('LoA snapshot with invalid permitType.')
        }
    }
    this.validationDto.applicationValidationResult.push(applicationDataValidationDto);
  }
  
  private validatePermitDataAgainstLoas(
    permitData: PermitData,
    permit: Permit,
    permitVehicleId: string,
    permitVehicleType: string,
  ){
    const permitLoaPowerUnits: string []= []
    const permitLoaTrailers: string []= []
    const permitTypesLoa: string []= []
    const applicationDataValidationDto = new ApplicationDataValidationDto();
    applicationDataValidationDto.applicationNumber = permit.applicationNumber;
  
    for (const loa of permitData.loas) {
      permitLoaPowerUnits.push(...loa.powerUnits);
      permitLoaTrailers.push(...loa.trailers);
      permitTypesLoa.push(...loa.loaPermitType);
      if (!this.isValidDateForLoa(loa, permit)) {

        applicationDataValidationDto.errors.push('Application has and LoA snapshot with invalid date(s).')
      }
  
     if(!this.isVehicleTypeValid(permitVehicleType, permitVehicleId, permitLoaPowerUnits, permitLoaTrailers)){
      applicationDataValidationDto.errors.push('Application has and LoA snapshot with invalid vehicle(s).')

     }
      if(!this.isPermitTypeValid(permit.permitType, permitTypesLoa)){
        applicationDataValidationDto.errors.push('Application has and LoA snapshot with invalid permitType.')
      }
    }
    this.validationDto.applicationValidationResult.push(applicationDataValidationDto);
  }
  
  private isVehicleTypeValid(
    permitVehicleType: string,
    permitVehicleId: string,
    allowedPowerUnits: string[],
    allowedTrailers: string[],
  ): boolean {
    const isPowerUnitAllowed = permitVehicleType === 'powerUnit' 
      ? allowedPowerUnits.includes(permitVehicleId) 
      : true;
  
    const isTrailerAllowed = permitVehicleType === 'trailer' 
      ? allowedTrailers.includes(permitVehicleId) 
      : true;
  
    return isPowerUnitAllowed && isTrailerAllowed;
  }
  
  private isPermitTypeValid(permitType: string, allowedPermitTypes: string[]): boolean {
    return allowedPermitTypes.includes(permitType)
  }
  
  private isValidDateForLoa(loaDetail: Loas| LoaDetail, permit: Permit): boolean {
    const { startDate, expiryDate } = loaDetail;
    const { startDate: permitStartDate, expiryDate: permitExpiryDate } = permit.permitData;
  
    return dayjs(startDate).isBefore(permitStartDate, 'day') &&
      (expiryDate ? dayjs(expiryDate).isAfter(permitExpiryDate, 'day') : true);
  }
  
  private collectAllowedVehiclesAndPermitTypes(
    loaDetail: LoaDetail,
    allowedPowerUnits: string[],
    allowedTrailers: string[],
    allowedPermitTypes: string[],
  ): void {
    for (const loaVehicle of loaDetail.loaVehicles) {
      if (loaVehicle.powerUnit) allowedPowerUnits.includes(loaVehicle.powerUnit);
      if (loaVehicle.trailer) allowedTrailers.includes(loaVehicle.trailer);
    }
    for (const loaPermitType of loaDetail.loaPermitTypes) {
      allowedPermitTypes.includes(loaPermitType.permitType);
    }
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
  async findLoasByIds(
    companyId: number,
    loaIds: number[],
  ): Promise<LoaDetail[]> {
    // Fetch initial active LOA details
    const loaDetails = await this.loaDetailRepository.find({
      where: {
        loaId: In(loaIds),
        isActive: true,
        company: { companyId },
      },
      relations: ['company', 'loaVehicles', 'loaPermitTypes'],
    });
  
    // Handle cases where LOA details may need replacements
    const updatedLoaDetails = await this.validateAndUpdateLoaDetails(
      loaDetails,
      companyId,
    );
  
    return updatedLoaDetails;
  }
  
  private async validateAndUpdateLoaDetails(
    loaDetails: LoaDetail[],
    companyId: number,
  ): Promise<LoaDetail[]> {
    const updatedLoas: LoaDetail[] = [];
  
    for (const loaDetail of loaDetails) {
      if (!loaDetail.isActive) {
        const replacementLoa = await this.findActiveReplacementLoa(
          loaDetail,
          companyId,
        );
  
        if (replacementLoa) {
          updatedLoas.push(replacementLoa);
        }
      } else {
        updatedLoas.push(loaDetail);
      }
    }
  
    return updatedLoas;
  }
  
  private async findActiveReplacementLoa(
    loaDetail: LoaDetail,
    companyId: number,
  ): Promise<LoaDetail | null> {
    const loa = await this.loaDetailRepository.findOne({
      where: {
        loaNumber: loaDetail.loaNumber,
        isActive: true,
        company: { companyId },
      },
      relations: ['company', 'loaVehicles', 'loaPermitTypes'],
    });
  
    return loa || null;
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
