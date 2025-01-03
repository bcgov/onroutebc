import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Permit } from '../permit/entities/permit.entity';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { CreateTransactionDto } from '../payment/dto/request/create-transaction.dto';
import { isCVClient } from 'src/common/helper/common.helper';
import { TIMEZONE_PACIFIC } from 'src/common/constants/api.constant';
import {
  permitFeeCalculator,
  validAmount,
} from 'src/common/helper/permit-fee.helper';
import {
  isAmendmentApplication,
  isApplicationInCart,
  isVoidorRevoked,
  validApplicationDates,
} from 'src/common/helper/permit-application.helper';
import {
  ApplicationDataValidationDto,
  CartValidationDto,
} from './dto/response/cart-validation.dto';
import {
  PermitData,
} from 'src/common/interface/permit.template.interface';
import { LoaDetail } from 'src/modules/special-auth/entities/loa-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { convertToHash } from 'src/common/helper/crypto.helper';
import { todayDate } from 'src/common/helper/date-time.helper';
import { isValidLoa } from 'src/common/helper/validate-loa.helper';

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
        const transactionAmountCalculated = await permitFeeCalculator(
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
            isVoidorRevoked(application.permitStatus) ||
            isApplicationInCart(application.permitStatus) ||
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
            await isValidLoa(application,queryRunner,this.classMapper);
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
        this.generateValidationHash(applicationIds, amount);
      }
      return this.validationDto;
    } catch (error) {
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
  generateValidationHash(applicationIds: string[], amount: number[]): void {
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
}

