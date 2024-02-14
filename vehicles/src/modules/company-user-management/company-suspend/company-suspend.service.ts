import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LogAsyncMethodExecution } from '../../../common/decorator/log-async-method-execution.decorator';
import { SuspendActivity } from '../../../common/enum/suspend-activity.enum';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { Company } from '../company/entities/company.entity';
import { IdirUser } from '../users/entities/idir.user.entity';
import { CompanyService } from '../company/company.service';
import { CreateCompanySuspendDto } from './dto/request/create-company-suspend.dto';
import { ReadCompanySuspendActivityDto } from './dto/response/read-company-suspend-activity.dto';
import { CompanySuspendActivity } from './entities/company-suspend-activity.entity';

@Injectable()
export class CompanySuspendService {
  private readonly logger = new Logger(CompanySuspendService.name);
  constructor(
    @InjectRepository(CompanySuspendActivity)
    private companySuspendRepository: Repository<CompanySuspendActivity>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
    private readonly companyService: CompanyService,
  ) {}

  /**
   * The update() method retrieves the entity from the database using the
   * Repository, maps the DTO object to the entity using the Mapper, sets some
   * additional properties on the entity, and saves it back to the database
   * using the Repository. It then retrieves the updated entity and returns it
   * in a DTO object.
   *
   *
   * @param companyId The company Id.
   * @param updateCompanyDto Request object of type {@link UpdateCompanyDto} for
   * updating a company.
   * @param directory Directory derived from the access token.
   *
   * @returns The company details as a promise of type {@link ReadCompanyDto}
   */
  @LogAsyncMethodExecution()
  async suspendCompany(
    companyId: number,
    createCompanySuspendDtonyDto: CreateCompanySuspendDto,
    currentUser: IUserJWT,
  ): Promise<ReadCompanySuspendActivityDto> {
    let savedSuspendAcitivity: CompanySuspendActivity;
    const company = await this.companyService.findOne(companyId);

    if (!company) {
      throw new DataNotFoundException();
    }
    const toBeSuspended: boolean =
      createCompanySuspendDtonyDto.suspendActivityType ===
      SuspendActivity.SUSPEND_COMPANY;
    if (company.isSuspended === toBeSuspended) {
      throw new BadRequestException(
        `Company ${companyId} is already in ${company.isSuspended ? SuspendActivity.SUSPEND_COMPANY : SuspendActivity.UNSUSPEND_COMPANY} status`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const currentDateTime: Date = new Date();

      await queryRunner.manager
        .createQueryBuilder()
        .update(Company)
        .set({
          isSuspended: toBeSuspended,
          updatedUser: currentUser.userName,
          updatedDateTime: currentDateTime,
          updatedUserDirectory: currentUser.orbcUserDirectory,
          updatedUserGuid: currentUser.userGUID,
        })
        .where('companyId = :companyId', { companyId: companyId })
        .execute();

      const suspendActivity: CompanySuspendActivity =
        new CompanySuspendActivity();

      suspendActivity.companyId = companyId;
      suspendActivity.suspendActivityType =
        createCompanySuspendDtonyDto.suspendActivityType;
      suspendActivity.comment = createCompanySuspendDtonyDto.comment;
      suspendActivity.suspendActivityDateTime = currentDateTime;
      const idirUser = new IdirUser();
      idirUser.userGUID = currentUser.userGUID;
      suspendActivity.idirUser = idirUser;
      suspendActivity.createdUser = currentUser.userName;
      suspendActivity.createdUserGuid = currentUser.userGUID;
      suspendActivity.createdUserDirectory = currentUser.orbcUserDirectory;
      suspendActivity.createdDateTime = currentDateTime;
      suspendActivity.updatedUser = currentUser.userName;
      suspendActivity.updatedUserGuid = currentUser.userGUID;
      suspendActivity.updatedUserDirectory = currentUser.orbcUserDirectory;
      suspendActivity.updatedDateTime = currentDateTime;

      savedSuspendAcitivity = await queryRunner.manager.save(suspendActivity);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }

    const result = await this.classMapper.mapAsync(
      savedSuspendAcitivity,
      CompanySuspendActivity,
      ReadCompanySuspendActivityDto,
    );
    result.userName = currentUser.userName?.toUpperCase();
    return result;
  }

  /**
   * The findAllSuspendActivityByCompanyId() method retrieves all suspend activities associated with a given company ID.
   * It queries the suspend activity repository for records matching the company ID and includes the relation to the IDIR user.
   * The results are then mapped from the CompanySuspendActivity entities to ReadCompanySuspendActivityDto objects for presentation.
   *
   * @param companyId The unique identifier of the company.
   *
   * @returns A promise containing an array of ReadCompanySuspendActivityDto objects representing the suspend activities for the specified company.
   */
  @LogAsyncMethodExecution()
  async findAllSuspendActivityByCompanyId(
    companyId: number,
  ): Promise<ReadCompanySuspendActivityDto[]> {
    const suspendActivityDbResults = await this.companySuspendRepository.find({
      where: { companyId: companyId },
      relations: {
        idirUser: true,
      },
      order: { activityId: { direction: 'desc' } },
    });

    return await this.classMapper.mapArrayAsync(
      suspendActivityDbResults,
      CompanySuspendActivity,
      ReadCompanySuspendActivityDto,
    );
  }
}
