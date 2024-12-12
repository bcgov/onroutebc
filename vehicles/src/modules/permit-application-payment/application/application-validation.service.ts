import {
  BadRequestException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Brackets, DataSource, In, QueryRunner } from 'typeorm';
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
import { validApplicationDates } from 'src/common/helper/permit-application.helper';
import { CartValidationDto, Status } from './dto/response/cart-validation.dto';

@Injectable()
export class ApplicationValidationService {
  private readonly logger = new Logger(ApplicationValidationService.name);
  constructor(private dataSource: DataSource) {}

  async validateApplication(
    currentUser: IUserJWT,

    createTransactionDto: CreateTransactionDto,
  ): Promise<CartValidationDto[]> {
    const validationDto = new CartValidationDto();
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
          validationDto.status = Status.ERROR;
          validationDto.error = error.message;
        }
      }

      return [new CartValidationDto()];
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
      throw new BadRequestException('Transaction amount mismatch.');
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
              paymentType: PaymentMethodTypeEnum.WEB,
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
}
