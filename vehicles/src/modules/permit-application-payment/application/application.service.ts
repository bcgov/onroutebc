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
import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
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
import { IssuePermitDataNotification } from '../../../common/interface/issue-permit-data.notification.interface';
import { DopsService } from '../../common/dops.service';
import { DopsGeneratedDocument } from '../../../common/interface/dops-generated-document.interface';
import { TemplateName } from '../../../common/enum/template-name.enum';
import { Receipt } from '../payment/entities/receipt.entity';
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
import { ReadFileDto } from '../../common/dto/response/read-file.dto';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
    private dataSource: DataSource,
    private readonly dopsService: DopsService,
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
    companyId: number,
  ): Promise<ReadApplicationDto> {
    const id = createApplicationDto.permitId;
    let fetchExistingApplication: Permit;
    //If permit id exists assign it to null to create new application.
    //Existing permit id also implies that this new application is an amendment.
    if (id) {
      fetchExistingApplication = await this.findOne(id, companyId);
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
          companyId: companyId,
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

  private async findOne(permitId: string, companyId?: number): Promise<Permit> {
    let query = this.permitRepository
      .createQueryBuilder('permit')
      .leftJoinAndSelect('permit.company', 'company')
      .innerJoinAndSelect('permit.permitData', 'permitData')
      .leftJoinAndSelect('permit.applicationOwner', 'applicationOwner')
      .leftJoinAndSelect(
        'applicationOwner.userContact',
        'applicationOwnerContact',
      )
      .where('permit.permitId = :permitId', {
        permitId: permitId,
      });
    if (companyId)
      query = query.andWhere('company.companyId = :companyId', {
        companyId: companyId,
      });
    return await query.getOne();
  }

  private async findOneWithSuccessfulTransaction(
    applicationId: string,
    companyId: number,
  ): Promise<Permit> {
    return await this.permitRepository
      .createQueryBuilder('permit')
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
      .andWhere('company.companyId = :companyId', {
        companyId: companyId,
      })
      .andWhere('receipt.receiptNumber IS NOT NULL')
      .getOne();
  }

  /* Get single application By Permit ID*/
  @LogAsyncMethodExecution()
  async findApplication(
    applicationId: string,
    currentUser: IUserJWT,
    companyId?: number,
  ): Promise<ReadApplicationDto> {
    const application = await this.findOne(applicationId, companyId);
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
   * Update an application
   * @param applicationNumber The key used to find the existing application
   * @param updateApplicationDto
   * @returns The updated application as a ReadApplicationDto
   */
  @LogAsyncMethodExecution()
  async update(
    applicationId: string,
    updateApplicationDto: UpdateApplicationDto,
    currentUser: IUserJWT,
    companyId: number,
  ): Promise<ReadApplicationDto> {
    const existingApplication = await this.findOne(applicationId, companyId);

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
          companyId: companyId,
        }),
      },
    );

    const applicationData: Permit = newApplication;
    await this.permitRepository.save(applicationData);
    return this.classMapper.mapAsync(
      await this.findOne(applicationId, companyId),
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
   * This function is responsible for issuing a permit based on a given application.
   * It performs various operations, including generating a permit number, calling the PDF generation service, and updating the permit record in the database.
   * @param currentUser
   * @param applicationId applicationId to identify the application to be issued. It is the same as permitId.
   * @returns a resultDto that describes if the transaction was successful or if it failed
   */
  @LogAsyncMethodExecution()
  async issuePermit(
    currentUser: IUserJWT,
    applicationId: string,
    companyId: number,
  ) {
    let success = '';
    let failure = '';
    const fetchedApplication = await this.findOneWithSuccessfulTransaction(
      applicationId,
      companyId,
    );
    // Check if a PDF document already exists for the permit.
    // It's important that a PDF does not get overwritten.
    // Once its created, it is a permanent legal document.
    if (!fetchedApplication) {
      throw new NotFoundException('Application not found for issuance!');
    }
    if (fetchedApplication.permitNumber) {
      throw new NotFoundException('Application has already been issued!');
    }
    if (fetchedApplication.documentId) {
      throw new HttpException('Document already exists', 409);
    } else if (
      fetchedApplication.permitStatus == ApplicationStatus.WAITING_PAYMENT
    ) {
      throw new BadRequestException(
        'Application must be ready for issuance with payment complete status!',
      );
    }

    const permitNumber = await generatePermitNumber(
      this.cacheManager,
      applicationId !== fetchedApplication.originalPermitId
        ? await this.findOne(fetchedApplication.previousRevision.toString())
        : fetchedApplication,
    );
    //Generate receipt number for the permit to be created in database.
    const receiptNumber =
      fetchedApplication.permitTransactions?.at(0).transaction.receipt
        .receiptNumber;
    fetchedApplication.permitNumber = permitNumber;
    fetchedApplication.permitStatus = ApplicationStatus.ISSUED;

    const companyInfo = fetchedApplication.company;

    const fullNames = await fetchPermitDataDescriptionValuesFromCache(
      this.cacheManager,
      fetchedApplication,
    );

    const revisionHistory = await this.permitRepository.find({
      where: [{ originalPermitId: fetchedApplication.originalPermitId }],
      order: { permitId: 'DESC' },
    });

    fetchedApplication.permitIssueDateTime = new Date();
    // Provide the permit json data required to populate the .docx template that is used to generate a PDF
    const permitDataForTemplate = formatTemplateData(
      fetchedApplication,
      fullNames,
      companyInfo,
      revisionHistory,
    );
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let dopsRequestData: DopsGeneratedDocument = {
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
      const generatedPermitDocumentPromise = this.generateDocument(
        currentUser,
        dopsRequestData,
        companyInfo.companyId,
      );

      dopsRequestData = {
        templateName: TemplateName.PAYMENT_RECEIPT,
        generatedDocumentFileName: `Receipt_No_${receiptNumber}`,
        templateData: {
          ...permitDataForTemplate,
          // transaction details still needs to be reworked to support multiple permits
          pgTransactionId:
            fetchedApplication.permitTransactions[0].transaction
              .pgTransactionId,
          transactionOrderNumber:
            fetchedApplication.permitTransactions[0].transaction
              .transactionOrderNumber,
          transactionAmount: formatAmount(
            fetchedApplication.permitTransactions[0].transaction
              .transactionTypeId,
            fetchedApplication.permitTransactions[0].transactionAmount,
          ),
          totalTransactionAmount: formatAmount(
            fetchedApplication.permitTransactions[0].transaction
              .transactionTypeId,
            fetchedApplication.permitTransactions[0].transaction
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
              fetchedApplication.permitTransactions[0].transaction
                .paymentMethodTypeCode,
              fetchedApplication.permitTransactions[0].transaction
                .paymentCardTypeCode,
            )
          ).consolidatedPaymentMethod,
          transactionDate: convertUtcToPt(
            fetchedApplication.permitTransactions[0].transaction
              .transactionSubmitDate,
            'MMM. D, YYYY, hh:mm a Z',
          ),
          receiptNo: receiptNumber,
        },
      };

      const generatedReceiptDocumentPromise = this.generateDocument(
        currentUser,
        dopsRequestData,
        companyInfo.companyId,
      );

      const generatedDocuments: ReadFileDto[] = await Promise.all([
        generatedPermitDocumentPromise,
        generatedReceiptDocumentPromise,
      ]);

      await queryRunner.manager.update(
        Permit,
        { permitId: fetchedApplication.permitId },
        {
          permitStatus: fetchedApplication.permitStatus,
          permitNumber: fetchedApplication.permitNumber,
          documentId: generatedDocuments.at(0).documentId,
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

      await queryRunner.manager.update(
        Receipt,
        {
          receiptId:
            fetchedApplication.permitTransactions[0].transaction.receipt
              .receiptId,
        },
        {
          receiptDocumentId: generatedDocuments.at(1).documentId,
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
      success = applicationId;
      try {
        const notificationData: IssuePermitDataNotification = {
          companyName: companyInfo.legalName,
        };

        const emailList = [
          permitDataForTemplate.permitData?.contactDetails?.email,
          permitDataForTemplate.permitData?.contactDetails?.additionalEmail,
          companyInfo.email,
        ].filter((email) => Boolean(email));

        const distinctEmailList = Array.from(new Set(emailList));

        const notificationDocument: INotificationDocument = {
          templateName: NotificationTemplate.ISSUE_PERMIT,
          to: distinctEmailList,
          subject: 'onRouteBC Permits - ' + companyInfo.legalName,
          data: notificationData,
          documentIds: [
            generatedDocuments?.at(0)?.documentId,
            generatedDocuments?.at(1)?.documentId,
          ],
        };

        void this.dopsService.notificationWithDocumentsFromDops(
          currentUser,
          notificationDocument,
        );
      } catch (error: unknown) {
        /**
         * Swallow the error as failure to send notification should not break the flow
         */
        this.logger.error(error);
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      success = '';
      failure = applicationId;
    } finally {
      await queryRunner.release();
    }

    const resultDto: ResultDto = {
      success: [success],
      failure: [failure],
    };

    return resultDto;
  }

  @LogAsyncMethodExecution()
  async generateDocument(
    currentUser: IUserJWT,
    dopsRequestData: DopsGeneratedDocument,
    companyId?: number,
  ) {
    return await this.dopsService.generateDocument(
      currentUser,
      dopsRequestData,
      companyId,
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
    companyId?: number,
  ): Promise<ReadApplicationDto> {
    let applicationQuery = this.permitRepository
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
      });
    applicationQuery = applicationQuery.andWhere(
      'permit.permitStatus IN (:...applicationStatus)',
      {
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
      },
    );
    if (companyId)
      applicationQuery = applicationQuery.andWhere(
        'company.companyId = :companyId',
        { companyId: companyId },
      );
    applicationQuery = applicationQuery.orderBy('permit.revision', 'DESC');
    const application = await applicationQuery.getOne();

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
