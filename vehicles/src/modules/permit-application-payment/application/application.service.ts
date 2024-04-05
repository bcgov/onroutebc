import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateApplicationDto } from './dto/request/create-application.dto';
import { ReadApplicationDto } from './dto/response/read-application.dto';
import { Permit } from '../permit/entities/permit.entity';
import { UpdateApplicationDto } from './dto/request/update-application.dto';
import { ResultDto } from './dto/response/result.dto';
import { PermitApplicationOrigin } from './entities/permit-application-origin.entity';
import { PermitApprovalSource } from './entities/permit-approval-source.entity';
import { PermitApplicationOrigin as PermitApplicationOriginEnum } from '../../../common/enum/permit-application-origin.enum';
import { PermitApprovalSource as PermitApprovalSourceEnum } from '../../../common/enum/permit-approval-source.enum';
import { paginate, sortQuery } from '../../../common/helper/database.helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NotificationTemplate } from '../../../common/enum/notification-template.enum';
import { DopsService } from '../../common/dops.service';
import { TemplateName } from '../../../common/enum/template-name.enum';
import { convertUtcToPt } from '../../../common/helper/date-time.helper';
import { Directory } from '../../../common/enum/directory.enum';
import { PermitIssuedBy } from '../../../common/enum/permit-issued-by.enum';
import {
  formatAmount,
  getPaymentCodeFromCache,
} from '../../../common/helper/payment.helper';
import * as constants from '../../../common/constants/api.constant';
import { LogAsyncMethodExecution } from '../../../common/decorator/log-async-method-execution.decorator';
import { PageMetaDto } from '../../../common/dto/paginate/page-meta';
import { PaginationDto } from '../../../common/dto/paginate/pagination';

import {
  ClientUserAuthGroup,
  IDIR_USER_AUTH_GROUP_LIST,
} from '../../../common/enum/user-auth-group.enum';
import { DeleteDto } from '../../common/dto/response/delete.dto';
import { ReadApplicationMetadataDto } from './dto/response/read-application-metadata.dto';
import { doesUserHaveAuthGroup } from '../../../common/helper/auth.helper';
import { formatTemplateData } from '../../../common/helper/format-template-data.helper';
import {
  ACTIVE_APPLICATION_STATUS,
  ACTIVE_APPLICATION_STATUS_FOR_ISSUANCE,
  ALL_APPLICATION_STATUS,
  ApplicationStatus,
} from '../../../common/enum/application-status.enum';
import { IDP } from '../../../common/enum/idp.enum';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import {
  fetchPermitDataDescriptionValuesFromCache,
  generateApplicationNumber,
  generatePermitNumber,
} from '../../../common/helper/permit-application.helper';
import { INotificationDocument } from '../../../common/interface/notification-document.interface';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
    private dataSource: DataSource,
    private readonly dopsService: DopsService,
    private readonly paymentService: PaymentService,
    @InjectRepository(PermitApplicationOrigin)
    private permitApplicationOriginRepository: Repository<PermitApplicationOrigin>,
    @InjectRepository(PermitApprovalSource)
    private permitApprovalSourceRepository: Repository<PermitApprovalSource>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * createApplicationDto.permitID null means new application for new permit
   * if createApplicationDto.permitID is not null then create new application for permit amendment.
   * @param createApplicationDto
   *
   */
  @LogAsyncMethodExecution()
  async create(
    createApplicationDto: CreateApplicationDto,
    currentUser: IUserJWT,
  ): Promise<ReadApplicationDto> {
    const id = createApplicationDto.permitId;
    let fetchExistingApplication: Permit;
    //If permit id exists assign it to null to create new application.
    //Existing permit id also implies that this new application is an amendment.
    if (id) {
      fetchExistingApplication = await this.findOne(id);
      //to check if there is already an appliation in database
      const count = await this.checkApplicationInProgress(
        fetchExistingApplication.originalPermitId,
      );
      // If an application already exists throw error.
      //As there should not be multiple amendment applications for one permit
      if (count > 0)
        throw new InternalServerErrorException(
          'An application already exists for this permit.',
        );
      createApplicationDto.revision = fetchExistingApplication.revision + 1;
      createApplicationDto.previousRevision = id;
      createApplicationDto.permitId = null;
      createApplicationDto.originalPermitId =
        fetchExistingApplication.originalPermitId;
    }

    const permitApplication = this.classMapper.map(
      createApplicationDto,
      CreateApplicationDto,
      Permit,
      {
        extraArgs: () => ({
          permitApplicationOrigin:
            currentUser.identity_provider === IDP.IDIR
              ? PermitApplicationOriginEnum.PPC
              : PermitApplicationOriginEnum.ONLINE,
          userName: currentUser.userName,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
          directory: currentUser.orbcUserDirectory,
        }),
      },
    );

    //Generate appliction number for the application to be created in database.
    const applicationNumber = await generateApplicationNumber(
      this.dataSource,
      this.cacheManager,
      permitApplication.permitApplicationOrigin,
      fetchExistingApplication,
    );

    permitApplication.applicationNumber = applicationNumber;
    permitApplication.permitStatus = ApplicationStatus.IN_PROGRESS;

    const savedPermitEntity =
      await this.permitRepository.save(permitApplication);
    // In case of new application assign original permit ID
    if (id === undefined || id === null) {
      await this.permitRepository
        .createQueryBuilder()
        .update()
        .set({
          originalPermitId: savedPermitEntity.permitId,
          updatedUser: currentUser.userName,
          updatedDateTime: new Date(),
          updatedUserDirectory: currentUser.orbcUserDirectory,
          updatedUserGuid: currentUser.userGUID,
        })
        .where('permitId = :permitId', { permitId: savedPermitEntity.permitId })
        .execute();
    }
    const refreshedPermitEntity = await this.findOne(
      savedPermitEntity.permitId,
    );
    return await this.classMapper.mapAsync(
      refreshedPermitEntity,
      Permit,
      ReadApplicationDto,
      {
        extraArgs: () => ({
          currentUserAuthGroup: currentUser?.orbcUserAuthGroup,
        }),
      },
    );
  }

  private async findOne(permitId: string): Promise<Permit> {
    return await this.permitRepository.findOne({
      where: [{ permitId: permitId }],
      relations: {
        company: true,
        permitData: true,
        applicationOwner: {
          userContact: true,
        },
      },
    });
  }

  private async findOneWithSuccessfulTransaction(
    applicationId: string,
    companyId?: number,
  ): Promise<Permit> {
    const permitQB = this.permitRepository.createQueryBuilder('permit');
    permitQB
      .leftJoinAndSelect('permit.company', 'company')
      .innerJoinAndSelect('permit.permitData', 'permitData')
      .innerJoinAndSelect('permit.permitTransactions', 'permitTransactions')
      .innerJoinAndSelect('permitTransactions.transaction', 'transaction')
      .innerJoinAndSelect('transaction.receipt', 'receipt')
      .leftJoinAndSelect('permit.applicationOwner', 'applicationOwner')
      .leftJoinAndSelect(
        'applicationOwner.userContact',
        'applicationOwnerContact',
      )
      .where('permit.permitId = :permitId', {
        permitId: applicationId,
      })
      .andWhere('receipt.receiptNumber IS NOT NULL');

    if (companyId) {
      permitQB.andWhere('company.companyId = :companyId', {
        companyId: companyId,
      });
    }
    return await permitQB.getOne();
  }

  /**
   * Finds multiple permits by application IDs or a single transaction ID with successful transactions,
   * optionally filtering by companyId.
   *
   * @param applicationIds Array of application IDs to filter the permits. If empty, will search by transactionId.
   * @param companyId The ID of the company to which the permits may belong, optional.
   * @param transactionId A specific transaction ID to find the related permit, optional. If provided, applicationIds should be empty.
   * @returns A promise that resolves with an array of permits matching the criteria.
   */
  private async findManyWithSuccessfulTransaction(
    applicationIds: string[],
    companyId?: number,
    transactionId?: string,
  ): Promise<Permit[]> {
    if (
      (!applicationIds?.length && !transactionId) ||
      (applicationIds?.length && transactionId)
    ) {
      throw new InternalServerErrorException(
        'Either applicationId or transactionId must be exclusively present!',
      );
    }
    const permitQB = this.permitRepository.createQueryBuilder('permit');
    permitQB
      .leftJoinAndSelect('permit.company', 'company')
      .innerJoinAndSelect('permit.permitData', 'permitData')
      .innerJoinAndSelect('permit.permitTransactions', 'permitTransactions')
      .innerJoinAndSelect('permitTransactions.transaction', 'transaction')
      .innerJoinAndSelect('transaction.receipt', 'receipt')
      .leftJoinAndSelect('permit.applicationOwner', 'applicationOwner')
      .leftJoinAndSelect(
        'applicationOwner.userContact',
        'applicationOwnerContact',
      )
      .where('receipt.receiptNumber IS NOT NULL');

    if (applicationIds?.length) {
      permitQB.andWhere('permit.permitId IN (:...permitIds)', {
        permitIds: applicationIds,
      });
    } else if (transactionId) {
      permitQB.andWhere('transaction.transactionId =:transactionId', {
        transactionId: transactionId,
      });
    }
    if (companyId) {
      permitQB.andWhere('company.companyId = :companyId', {
        companyId: companyId,
      });
    }

    return await permitQB.getMany();
  }

  /**
   * Finds multiple permits with their transactionId, filtered by application IDs and an optional companyId. Permits are only included if they have a receipt.
   * @param applicationIds Array of application IDs to filter permits.
   * @param companyId Optional company ID for further filtering.
   * @returns Promise resolving to an array of objects, each containing a transactionId and its associated permits.
   */
  private async findApplicationsForReceiptGeneration(
    applicationIds: string[],
    companyId?: number,
  ): Promise<{ transactionId: string; permits: Permit[] }[]> {
    const permitQB = this.permitRepository.createQueryBuilder('permit');
    permitQB
      .select('transaction.transactionId', 'transactionId')
      .addSelect(
        'COUNT(permit.permitId) OVER (PARTITION BY transaction.transactionId)',
        'permitCountPerTransactionId',
      )
      .distinct(true)
      .leftJoin('permit.company', 'company')
      .innerJoin('permit.permitTransactions', 'permitTransactions')
      .innerJoin('permitTransactions.transaction', 'transaction')
      .innerJoin('transaction.receipt', 'receipt')
      .where('permit.permitId IN (:...permitIds)', {
        permitIds: applicationIds,
      })
      .andWhere('receipt.receiptNumber IS NOT NULL')
      .andWhere('permit.permitNumber IS NOT NULL');

    if (companyId) {
      permitQB.andWhere('company.companyId = :companyId', {
        companyId: companyId,
      });
    }

    const transactions = await permitQB.getRawMany<{
      transactionId: string;
      permitCountPerTransactionId: number;
    }>();

    const transactionPermitList: {
      transactionId: string;
      permits: Permit[];
    }[] = [];

    for (const transaction of transactions) {
      const fetchedApplications = await this.findManyWithSuccessfulTransaction(
        null,
        companyId,
        transaction.transactionId,
      );

      if (
        fetchedApplications?.length === transaction.permitCountPerTransactionId
      ) {
        transactionPermitList.push({
          transactionId: transaction.transactionId,
          permits: fetchedApplications,
        });
      }
    }

    return transactionPermitList;
  }

  /* Get single application By Permit ID*/
  @LogAsyncMethodExecution()
  async findApplication(
    permitId: string,
    currentUser: IUserJWT,
  ): Promise<ReadApplicationDto> {
    const application = await this.findOne(permitId);
    const readPermitApplicationdto = await this.classMapper.mapAsync(
      application,
      Permit,
      ReadApplicationDto,
      {
        extraArgs: () => ({
          currentUserAuthGroup: currentUser?.orbcUserAuthGroup,
        }),
      },
    );
    return readPermitApplicationdto;
  }

  /**
   * Retrieves applications based on user GUID, and company ID. It allows for sorting, pagination, and filtering of the applications results.
   * @param getApplicationQueryParamsDto - DTO containing query parameters such as companyId, orderBy, page, and take for filtering and pagination.
   * @param userGUID - Unique identifier for the user. If provided, the query
   */
  @LogAsyncMethodExecution()
  async findAllApplications(findAllApplicationsOptions?: {
    page: number;
    take: number;
    orderBy?: string;
    pendingPermits?: boolean;
    companyId?: number;
    userGUID?: string;
    currentUser?: IUserJWT;
  }): Promise<PaginationDto<ReadApplicationMetadataDto>> {
    // Construct the base query to find applications
    const applicationsQB = this.buildApplicationQuery(
      findAllApplicationsOptions.currentUser,
      findAllApplicationsOptions.companyId,
      findAllApplicationsOptions.pendingPermits,
      findAllApplicationsOptions.userGUID,
    );
    // total number of items
    const totalItems = await applicationsQB.getCount();

    // Mapping of frontend orderBy parameter to database columns
    const orderByMapping: Record<string, string> = {
      applicationNumber: 'permit.applicationNumber',
      permitType: 'permit.permitType',
      updatedDateTime: 'permit.updatedDateTime',
      startDate: 'permitData.startDate',
      expiryDate: 'permitData.expiryDate',
      unitNumber: 'permitData.unitNumber',
      plate: 'permitData.plate',
      vin: 'permitData.vin',
    };

    // Apply sorting if orderBy parameter is provided
    if (findAllApplicationsOptions.orderBy) {
      sortQuery<Permit>(
        applicationsQB,
        orderByMapping,
        findAllApplicationsOptions.orderBy,
      );
    }
    // Apply pagination if page and take parameters are provided
    if (findAllApplicationsOptions.page && findAllApplicationsOptions.take) {
      paginate<Permit>(
        applicationsQB,
        findAllApplicationsOptions.page,
        findAllApplicationsOptions.take,
      );
    }

    // Get the paginated list of permits
    const applications = await applicationsQB.getMany();

    // Prepare pagination metadata
    const pageMetaDto = new PageMetaDto({
      totalItems,
      pageOptionsDto: {
        page: findAllApplicationsOptions.page,
        take: findAllApplicationsOptions.take,
        orderBy: findAllApplicationsOptions.orderBy,
      },
    });
    // Map permit entities to ReadPermitDto objects
    const readApplicationMetadataDto: ReadApplicationMetadataDto[] =
      await this.classMapper.mapArrayAsync(
        applications,
        Permit,
        ReadApplicationMetadataDto,
        {
          extraArgs: () => ({
            currentUserAuthGroup:
              findAllApplicationsOptions?.currentUser?.orbcUserAuthGroup,
          }),
        },
      );
    // Return paginated result
    return new PaginationDto(readApplicationMetadataDto, pageMetaDto);
  }

  private buildApplicationQuery(
    currentUser: IUserJWT,
    companyId?: number,
    pendingPermits?: boolean,
    userGUID?: string,
  ): SelectQueryBuilder<Permit> {
    let permitsQuery = this.permitRepository
      .createQueryBuilder('permit')
      .leftJoinAndSelect('permit.company', 'company')
      .innerJoinAndSelect('permit.permitData', 'permitData')
      .leftJoinAndSelect('permit.applicationOwner', 'applicationOwner')
      .leftJoinAndSelect(
        'applicationOwner.userContact',
        'applicationOwnerContact',
      );
    permitsQuery = permitsQuery.where('permit.permitNumber IS NULL');

    // Filter by companyId if provided
    if (companyId) {
      permitsQuery = permitsQuery.andWhere('company.companyId = :companyId', {
        companyId: companyId,
      });
    }

    // Handle pending permits query condition
    if (pendingPermits) {
      permitsQuery = permitsQuery.andWhere(
        new Brackets((qb) => {
          qb.where('permit.permitStatus IN (:...statuses)', {
            statuses: [ApplicationStatus.PAYMENT_COMPLETE],
          });
        }),
      );
    } else if (pendingPermits === false) {
      permitsQuery = permitsQuery.andWhere(
        new Brackets((qb) => {
          qb.where('permit.permitStatus IN (:...statuses)', {
            statuses: ACTIVE_APPLICATION_STATUS,
          });
        }),
      );
    } else if (pendingPermits === undefined) {
      permitsQuery = permitsQuery.andWhere(
        new Brackets((qb) => {
          qb.where('permit.permitStatus IN (:...statuses)', {
            statuses: ALL_APPLICATION_STATUS,
          });
        }),
      );
    }

    // Filter by userGUID if provided
    if (userGUID) {
      permitsQuery = permitsQuery.andWhere(
        'applicationOwner.userGUID = :userGUID',
        {
          userGUID: userGUID,
        },
      );
    }

    return permitsQuery;
  }

  /**
   * Get a single application by application number
   * @param applicationNumber example: "A2-00000004-373"
   * @returns Permit object associated with the given applicationNumber
   */
  private async findByApplicationNumber(
    applicationNumber: string,
  ): Promise<Permit> {
    const application = await this.permitRepository.findOne({
      where: [{ applicationNumber: applicationNumber }],
      relations: {
        company: true,
        permitData: true,
        applicationOwner: { userContact: true },
      },
    });

    return application;
  }

  /**
   * Update an application
   * @param applicationNumber The key used to find the existing application
   * @param updateApplicationDto
   * @returns The updated application as a ReadApplicationDto
   */
  @LogAsyncMethodExecution()
  async update(
    applicationNumber: string,
    updateApplicationDto: UpdateApplicationDto,
    currentUser: IUserJWT,
  ): Promise<ReadApplicationDto> {
    const existingApplication =
      await this.findByApplicationNumber(applicationNumber);

    const newApplication = this.classMapper.map(
      updateApplicationDto,
      UpdateApplicationDto,
      Permit,
      {
        extraArgs: () => ({
          permitId: existingApplication.permitId,
          permitDataId: existingApplication.permitData.permitDataId,
          userName: currentUser.userName,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
          directory: currentUser.orbcUserDirectory,
        }),
      },
    );

    const applicationData: Permit = newApplication;
    await this.permitRepository.save(applicationData);
    return this.classMapper.mapAsync(
      await this.findByApplicationNumber(applicationNumber),
      Permit,
      ReadApplicationDto,
      {
        extraArgs: () => ({
          currentUserAuthGroup: currentUser?.orbcUserAuthGroup,
        }),
      },
    );
  }

  /**
   * This function is responsible for issuing permits based on given application
   * IDs. It performs various checks such as verifying if a permit has already
   * been issued, if a document already exists for the permit to avoid
   * overwriting, and payment completion. It then generates a permit number,
   * updates the permit status to ISSUED, and handles database transactions for
   * issuing permits. It returns a resultDto indicating the success or failure
   * of issuing permits for each application ID.
   * @param currentUser The current user's JWT details.
   * @param applicationIds An array of application IDs to issue permits for.
   * @param companyId (Optional) The company ID to filter the applications by.
   * @returns A Promise resolving to a resultDto which lists the application IDs
   * that were successfully issued permits and those that failed.
   */
  @LogAsyncMethodExecution()
  async issuePermits(
    currentUser: IUserJWT,
    applicationIds: string[],
    companyId?: number,
  ): Promise<ResultDto> {
    const resultDto: ResultDto = {
      success: [],
      failure: [],
    };

    const fetchedApplications = await this.findManyWithSuccessfulTransaction(
      applicationIds,
      companyId,
    );

    if (!fetchedApplications?.length) {
      resultDto.failure = applicationIds;
      return resultDto;
    }

    for (const fetchedApplication of fetchedApplications) {
      try {
        // Check if a PDF document already exists for the permit.
        // It's important that a PDF does not get overwritten.
        // Once its created, it is a permanent legal document.

        if (fetchedApplication.permitNumber) {
          throw new NotFoundException('Application has already been issued!');
        }
        if (fetchedApplication.documentId) {
          throw new HttpException('Document already exists', 409);
        }
        if (
          fetchedApplication.permitStatus == ApplicationStatus.WAITING_PAYMENT
        ) {
          throw new BadRequestException(
            'Application must be ready for issuance with payment complete status!',
          );
        }
        const permitNumber = await generatePermitNumber(
          this.cacheManager,
          fetchedApplication.permitId !== fetchedApplication.originalPermitId
            ? await this.findOne(fetchedApplication.previousRevision.toString())
            : fetchedApplication,
        );

        fetchedApplication.permitNumber = permitNumber;
        fetchedApplication.permitStatus = ApplicationStatus.ISSUED;
        fetchedApplication.permitIssueDateTime = new Date();

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          await queryRunner.manager.update(
            Permit,
            { permitId: fetchedApplication.permitId },
            {
              permitStatus: fetchedApplication.permitStatus,
              permitNumber: fetchedApplication.permitNumber,
              issuer: { userGUID: currentUser.userGUID },
              permitApprovalSource: PermitApprovalSourceEnum.AUTO, //TODO : Hardcoding for release 1
              permitIssuedBy:
                currentUser.orbcUserDirectory == Directory.IDIR
                  ? PermitIssuedBy.PPC
                  : PermitIssuedBy.SELF_ISSUED,
              permitIssueDateTime: fetchedApplication.permitIssueDateTime,
              updatedDateTime: new Date(),
              updatedUser: currentUser.userName,
              updatedUserDirectory: currentUser.orbcUserDirectory,
              updatedUserGuid: currentUser.userGUID,
            },
          );

          // In case of amendment move the parent permit to SUPERSEDED Status.
          if (fetchedApplication.previousRevision) {
            await queryRunner.manager.update(
              Permit,
              {
                permitId: fetchedApplication.previousRevision,
              },
              {
                permitStatus: ApplicationStatus.SUPERSEDED,
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

        resultDto.success.push(fetchedApplication.permitId);
      } catch (error) {
        this.logger.error(error);
        resultDto.failure.push(fetchedApplication.permitId);
      }
    }
    return resultDto;
  }

  /**
   * Generates permit documents for a set of application IDs, optionally filtering by company ID.
   * The method checks if applications exist and have an ISSUED status, generates document data based
   * on the application details, and then updates the permit repository with the document IDs obtained
   * from generating documents. It handles and logs errors during document generation and updates.
   * It returns a list of application IDs for which document generation succeeded or failed.
   *
   * @param currentUser - The user who is currently logged in.
   * @param applicationIds - Array of application IDs for which to generate documents.
   * @param companyId - Optional company ID to filter applications by.
   * @returns A Promise resolving to a ResultDto containing lists of application IDs that succeeded
   * or failed in document generation.
   */
  @LogAsyncMethodExecution()
  async generatePermitDocuments(
    currentUser: IUserJWT,
    applicationIds: string[],
    companyId?: number,
  ): Promise<ResultDto> {
    if (!applicationIds?.length) {
      throw new InternalServerErrorException(
        'ApplicationId list cannot be empty',
      );
    }

    const resultDto: ResultDto = {
      success: [],
      failure: [],
    };

    const fetchedApplications = await this.findManyWithSuccessfulTransaction(
      applicationIds,
      companyId,
    );

    if (!fetchedApplications?.length) {
      resultDto.failure = applicationIds;
      return resultDto;
    }

    await Promise.allSettled(
      fetchedApplications?.map(async (fetchedApplication) => {
        try {
          if (fetchedApplication.documentId) {
            throw new HttpException('Document already exists', 409);
          }
          if (fetchedApplication.permitStatus != ApplicationStatus.ISSUED) {
            throw new BadRequestException(
              'Application must be in ISSUED status for document Generation!',
            );
          }

          const fullNames = await fetchPermitDataDescriptionValuesFromCache(
            this.cacheManager,
            fetchedApplication,
          );

          const revisionHistory = await this.permitRepository.find({
            where: [{ originalPermitId: fetchedApplication.originalPermitId }],
            order: { permitId: 'DESC' },
          });

          const { company } = fetchedApplication;

          const permitDataForTemplate = formatTemplateData(
            fetchedApplication,
            fullNames,
            company,
            revisionHistory,
          );

          const dopsRequestData = {
            templateName: TemplateName.PERMIT,
            generatedDocumentFileName: permitDataForTemplate.permitNumber,
            templateData: permitDataForTemplate,
            documentsToMerge: permitDataForTemplate.permitData.commodities.map(
              (commodity) => {
                if (commodity.checked) {
                  return commodity.condition;
                }
              },
            ),
          };

          const generatedDocument = await this.dopsService.generateDocument(
            currentUser,
            dopsRequestData,
            company?.companyId,
          );

          const documentId = generatedDocument?.documentId;

          const updateResult = await this.permitRepository.update(
            { permitId: fetchedApplication.permitId, documentId: IsNull() },
            {
              documentId: documentId,
              updatedDateTime: new Date(),
              updatedUser: currentUser.userName,
              updatedUserDirectory: currentUser.orbcUserDirectory,
              updatedUserGuid: currentUser.userGUID,
            },
          );
          if (updateResult.affected === 0) {
            throw new InternalServerErrorException(
              'Update permit document failed',
            );
          }

          try {
            const emailList = [
              permitDataForTemplate.permitData?.contactDetails?.email,
              permitDataForTemplate.permitData?.contactDetails?.additionalEmail,
              company?.email,
            ];

            const subject = `onRouteBC Permits - ${company?.legalName}`;
            this.emailDocument(
              NotificationTemplate.ISSUE_PERMIT,
              emailList,
              subject,
              documentId,
              currentUser,
            );
          } catch (error: unknown) {
            /**
             * Swallow the error as failure to send notification should not break the flow
             */
            this.logger.error(error);
          }

          resultDto.success.push(fetchedApplication.permitId);
          return Promise.resolve(fetchedApplication);
        } catch (error: unknown) {
          this.logger.error(error);
          resultDto.failure.push(fetchedApplication.permitId);
          // Return the error for failed operations
          return Promise.reject(error);
        }
      }),
    );

    if (resultDto?.failure?.length) {
      this.logger.error(
        `Failed Permit Document Generation: ${resultDto?.failure?.toString()}`,
      );
    }

    return resultDto;
  }

  /**
   * Generates receipt documents for the provided application IDs and optionally filters by company ID.
   * Each receipt document corresponds to a transaction within an application permit.
   * The method attempts to generate a receipt document for each permit associated with the provided application
   * IDs, handling document existence checks, data formatting for the document template, and updating receipt IDs with
   * the generated document IDs. It also attempts to send out emails with the generated document. Successes and failures
   * are tracked and returned in the result.
   *
   * @param currentUser - The user currently logged in.
   * @param applicationIds - Array of application IDs to generate receipt documents for.
   * @param companyId - Optional company ID to filter applications by.
   * @returns A Promise of a ResultDto indicating which operations succeeded or failed.
   */
  @LogAsyncMethodExecution()
  async generateReceiptDocuments(
    currentUser: IUserJWT,
    applicationIds: string[],
    companyId?: number,
  ): Promise<ResultDto> {
    if (!applicationIds?.length) {
      throw new InternalServerErrorException(
        'ApplicationId list cannot be empty',
      );
    }

    const resultDto: ResultDto = {
      success: [],
      failure: [],
    };

    const fetchedApplications = await this.findApplicationsForReceiptGeneration(
      applicationIds,
      companyId,
    );

    if (!fetchedApplications?.length) {
      resultDto.failure = applicationIds;
      return resultDto;
    }

    await Promise.allSettled(
      fetchedApplications?.map(async (fetchedApplication) => {
        const permits = fetchedApplication.permits;
        const permitIds = permits?.map((permit) => permit.permitId);
        if (permits?.length) {
          try {
            const permit = permits?.at(0);
            const company = permit?.company;
            const receipt =
              permit?.permitTransactions?.at(0)?.transaction?.receipt;
            if (receipt.receiptDocumentId) {
              throw new HttpException('Document already exists', 409);
            }

            const receiptNumber = receipt.receiptNumber;

            const fullNames = await fetchPermitDataDescriptionValuesFromCache(
              this.cacheManager,
              permit,
            );

            const permitDataForTemplate = formatTemplateData(
              permit,
              fullNames,
              company,
            );

            const dopsRequestData = {
              templateName: TemplateName.PAYMENT_RECEIPT,
              generatedDocumentFileName: `Receipt_No_${receiptNumber}`,
              templateData: {
                ...permitDataForTemplate,
                // transaction details still needs to be reworked to support multiple permits
                pgTransactionId:
                  permit?.permitTransactions[0].transaction.pgTransactionId,
                transactionOrderNumber:
                  permit?.permitTransactions[0].transaction
                    .transactionOrderNumber,
                transactionAmount: formatAmount(
                  permit?.permitTransactions[0].transaction.transactionTypeId,
                  permit?.permitTransactions[0].transactionAmount,
                ),
                totalTransactionAmount: formatAmount(
                  permit?.permitTransactions[0].transaction.transactionTypeId,
                  permit?.permitTransactions[0].transaction
                    .totalTransactionAmount,
                ),
                //Payer Name should be persisted in transacation Table so that it can be used for DocRegen
                payerName:
                  currentUser.orbcUserDirectory === Directory.IDIR
                    ? constants.PPC_FULL_TEXT
                    : currentUser.orbcUserFirstName +
                      ' ' +
                      currentUser.orbcUserLastName,
                issuedBy:
                  currentUser.orbcUserDirectory === Directory.IDIR
                    ? constants.PPC_FULL_TEXT
                    : constants.SELF_ISSUED,
                consolidatedPaymentMethod: (
                  await getPaymentCodeFromCache(
                    this.cacheManager,
                    permit?.permitTransactions[0].transaction
                      .paymentMethodTypeCode,
                    permit?.permitTransactions[0].transaction
                      .paymentCardTypeCode,
                  )
                ).consolidatedPaymentMethod,
                transactionDate: convertUtcToPt(
                  permit?.permitTransactions[0].transaction
                    .transactionSubmitDate,
                  'MMM. D, YYYY, hh:mm a Z',
                ),
                receiptNo: receiptNumber,
              },
            };

            const { documentId } = await this.dopsService.generateDocument(
              currentUser,
              dopsRequestData,
              company?.companyId,
            );

            await this.paymentService.updateReceiptDocument(
              currentUser,
              receipt?.receiptId,
              documentId,
            );

            try {
              const emailList = [
                permitDataForTemplate.permitData?.contactDetails?.email,
                permitDataForTemplate.permitData?.contactDetails
                  ?.additionalEmail,
                company?.email,
              ];
              const subject = `onRouteBC Permit Receipt - ${receiptNumber}`;
              this.emailDocument(
                NotificationTemplate.PAYMENT_RECEIPT,
                emailList,
                subject,
                documentId,
                currentUser,
              );
            } catch (error: unknown) {
              /**
               * Swallow the error as failure to send notification should not break the flow
               */
              this.logger.error(error);
            }
            resultDto.success.push(...permitIds);

            return Promise.resolve(fetchedApplication);
          } catch (error: unknown) {
            this.logger.error(error);
            resultDto.failure.push(...permitIds);
            // Return the error for failed operations
            return Promise.reject(error);
          }
        }
      }),
    );
    applicationIds?.forEach((id) => {
      if (
        !resultDto?.success?.includes(id) &&
        !resultDto.failure?.includes(id)
      ) {
        resultDto?.failure?.push(id);
      }
    });

    if (resultDto?.failure?.length) {
      this.logger.error(
        `Failed Permit Receipt Document Generation: ${resultDto?.failure?.toString()}`,
      );
    }

    return resultDto;
  }

  private emailDocument(
    notificationTemplate:
      | NotificationTemplate.ISSUE_PERMIT
      | NotificationTemplate.PAYMENT_RECEIPT,
    to: string[],
    subject: string,
    documentId: string,
    currentUser: IUserJWT,
  ) {
    const distinctEmailList = Array.from(new Set(to?.filter(Boolean)));

    const notificationDocument: INotificationDocument = {
      templateName: notificationTemplate,
      to: distinctEmailList,
      subject: subject,
      documentIds: [documentId],
    };

    void this.dopsService.notificationWithDocumentsFromDops(
      currentUser,
      notificationDocument,
    );
  }

  /**
   * Get Application Origin Code from database lookup table ORBC_VT_PERMIT_APPLICATION_ORIGIN
   * Retrieves all application origin records from the database.
   * @returns A promise that resolves with an array of PermitApplicationOrigin objects.
   */
  @LogAsyncMethodExecution()
  async findAllPermitApplicationOrigin(): Promise<PermitApplicationOrigin[]> {
    return await this.permitApplicationOriginRepository.find();
  }

  /**
   * Get Approval Source Code from database lookup table ORBC_VT_PERMIT_APPROVAL_SOURCE
   * Retrieves all permit approval source records from the database.
   * @returns A promise that resolves with an array of PermitApprovalSource objects.
   */
  @LogAsyncMethodExecution()
  async findAllPermitApprovalSource(): Promise<PermitApprovalSource[]> {
    return await this.permitApprovalSourceRepository.find();
  }

  @LogAsyncMethodExecution()
  async findCurrentAmendmentApplication(
    originalPermitId: string,
    currentUser: IUserJWT,
  ): Promise<ReadApplicationDto> {
    const application = await this.permitRepository
      .createQueryBuilder('permit')
      .leftJoinAndSelect('permit.company', 'company')
      .innerJoinAndSelect('permit.permitData', 'permitData')
      .leftJoinAndSelect('permit.applicationOwner', 'applicationOwner')
      .leftJoinAndSelect(
        'applicationOwner.userContact',
        'applicationOwnerContact',
      )
      .where('permit.originalPermitId = :originalPermitId', {
        originalPermitId: originalPermitId,
      })
      .andWhere('permit.permitStatus IN (:...applicationStatus)', {
        applicationStatus: Object.values(ApplicationStatus).filter(
          (x) =>
            x != ApplicationStatus.DELETED &&
            x != ApplicationStatus.CANCELLED &&
            x != ApplicationStatus.REJECTED &&
            x != ApplicationStatus.ISSUED &&
            x != ApplicationStatus.REVOKED &&
            x != ApplicationStatus.VOIDED &&
            x != ApplicationStatus.SUPERSEDED,
        ),
      })
      .orderBy('permit.revision', 'DESC')
      .getOne();

    return await this.classMapper.mapAsync(
      application,
      Permit,
      ReadApplicationDto,
      {
        extraArgs: () => ({
          currentUserAuthGroup: currentUser?.orbcUserAuthGroup,
        }),
      },
    );
  }

  @LogAsyncMethodExecution()
  async checkApplicationInProgress(originalPermitId: string): Promise<number> {
    const count = await this.permitRepository
      .createQueryBuilder('permit')
      .where('permit.originalPermitId = :originalPermitId', {
        originalPermitId: originalPermitId,
      })
      .andWhere('permit.permitStatus IN (:...applicationStatus)', {
        applicationStatus: ACTIVE_APPLICATION_STATUS_FOR_ISSUANCE,
      })
      .getCount();
    return count;
  }

  /**
   * Removes all specified applications for a given company and optionally by a user from the database.
   *
   * This method retrieves existing applications using their IDs, and company ID. It then identifies
   * which applications can be marked as deleted or cancelled, based on whether their IDs were found and the user's authorization group,
   * and updates their statuses accordingly. Finally, it constructs a response detailing which deletions (or cancellations) were successful and which were not.
   *
   * @param {string[]} applicationIds The IDs of the applications to be deleted/cancelled.
   * @param {number} companyId The ID of the company owning the applications.
   * @param {IUserJWT} currentUser The current user performing the operation, with their JWT details.
   * @returns {Promise<DeleteDto>} An object containing arrays of successful and failed deletions/cancellations.
   */
  @LogAsyncMethodExecution()
  async deleteApplicationInProgress(
    applicationIds: string[],
    companyId: number,
    currentUser: IUserJWT,
  ): Promise<DeleteDto> {
    // Build query to find applications matching certain criteria like company ID, application status, and undefined permit numbers
    const applicationsQB = this.permitRepository
      .createQueryBuilder('permit')
      .leftJoinAndSelect('permit.company', 'company')
      .leftJoinAndSelect('permit.applicationOwner', 'applicationOwner')
      .whereInIds(applicationIds)
      .andWhere('company.companyId = :companyId', {
        companyId: companyId,
      })
      .andWhere('permit.permitStatus IN (:...applicationStatus)', {
        applicationStatus: ACTIVE_APPLICATION_STATUS,
      })
      .andWhere('permit.permitNumber IS NULL');

    // Filter applications by user GUID if the current user is a PERMIT_APPLICANT or by ONLINE origin if the user is a COMPANY_ADMINISTRATOR
    if (
      ClientUserAuthGroup.PERMIT_APPLICANT === currentUser.orbcUserAuthGroup
    ) {
      applicationsQB.andWhere('applicationOwner.userGUID = :userGuid', {
        userGuid: currentUser.userGUID,
      });
    } else if (
      ClientUserAuthGroup.COMPANY_ADMINISTRATOR ===
      currentUser.orbcUserAuthGroup
    ) {
      applicationsQB.andWhere(
        'permit.permitApplicationOrigin = :permitApplicationOrigin',
        {
          permitApplicationOrigin: PermitApplicationOriginEnum.ONLINE,
        },
      );
    }

    // Execute the query to retrieve applications before deletion
    const applicationsBeforeDelete = await applicationsQB.getMany();

    // Map applications before deletion to their new status (either DELETED or CANCELLED), including auditing fields
    const applicationsToBeDeleted = applicationsBeforeDelete.map(
      (application) => {
        return (
          applicationIds.includes(application.permitId) &&
          ({
            ...application,
            permitStatus: doesUserHaveAuthGroup(
              currentUser.orbcUserAuthGroup,
              IDIR_USER_AUTH_GROUP_LIST,
            )
              ? ApplicationStatus.DELETED
              : ApplicationStatus.CANCELLED,
            updatedDateTime: new Date(),
            updatedUser: currentUser.userName,
            updatedUserDirectory: currentUser.orbcUserDirectory,
            updatedUserGuid: currentUser.userGUID,
          } as Permit)
        );
      },
    );

    // Determine which application IDs could not be found for deletion
    const failure = applicationIds?.filter(
      (id) =>
        !applicationsToBeDeleted.some(
          (application) => application.permitId === id,
        ),
    );

    // Persist changes to the applications, effectively deleting or cancelling them
    await this.permitRepository.save(applicationsToBeDeleted);

    // Determine which application IDs were successfully deleted or cancelled
    const success = applicationIds?.filter((id) => !failure?.includes(id));

    // Prepare the response DTO with details of successful and failed deletions
    const deleteDto: DeleteDto = {
      success: success,
      failure: failure,
    };

    // Return the response DTO
    return deleteDto;
  }
}
