import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  DataSource,
  LessThanOrEqual,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { ReadPermitDto } from './dto/response/read-permit.dto';
import { Permit } from './entities/permit.entity';
import { PermitType } from './entities/permit-type.entity';
import { DopsService } from '../../common/dops.service';
import { FileDownloadModes } from '../../../common/enum/file-download-modes.enum';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { Response } from 'express';
import { PermitStatus } from 'src/common/enum/permit-status.enum';
import { Receipt } from '../payment/entities/receipt.entity';
import { PaginationDto } from 'src/common/dto/paginate/pagination';
import { PermitHistoryDto } from './dto/response/permit-history.dto';
import {
  ACTIVE_APPLICATION_STATUS_FOR_ISSUANCE,
  ApplicationStatus,
} from 'src/common/enum/application-status.enum';
import { DopsGeneratedDocument } from 'src/common/interface/dops-generated-document.interface';
import { TemplateName } from 'src/common/enum/template-name.enum';
import { convertUtcToPt } from 'src/common/helper/date-time.helper';
import { IssuePermitDataNotification } from 'src/common/interface/issue-permit-data.notification.interface';
import { NotificationTemplate } from 'src/common/enum/notification-template.enum';
import { ResultDto } from './dto/response/result.dto';
import { VoidPermitDto } from './dto/request/void-permit.dto';
import { PaymentService } from '../payment/payment.service';
import { CreateTransactionDto } from '../payment/dto/request/create-transaction.dto';
import { Transaction } from '../payment/entities/transaction.entity';
import { Directory } from 'src/common/enum/directory.enum';
import { PermitData } from './entities/permit-data.entity';
import { Base } from '../../common/entities/base.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheKey } from 'src/common/enum/cache-key.enum';
import { getMapFromCache } from 'src/common/helper/cache.helper';
import { Cache } from 'cache-manager';
import { PermitIssuedBy } from '../../../common/enum/permit-issued-by.enum';
import {
  formatAmount,
  getPaymentCodeFromCache,
} from '../../../common/helper/payment.helper';
import { PaymentMethodType } from 'src/common/enum/payment-method-type.enum';
import { PageMetaDto } from 'src/common/dto/paginate/page-meta';
import { LogAsyncMethodExecution } from '../../../common/decorator/log-async-method-execution.decorator';
import * as constants from '../../../common/constants/api.constant';
import { PermitApprovalSource } from '../../../common/enum/permit-approval-source.enum';
import { PermitSearch } from '../../../common/enum/permit-search.enum';
import { paginate, sortQuery } from '../../../common/helper/database.helper';
import { IDIR_USER_AUTH_GROUP_LIST } from '../../../common/enum/user-auth-group.enum';
import { User } from '../../company-user-management/users/entities/user.entity';
import { ReadPermitMetadataDto } from './dto/response/read-permit-metadata.dto';
import { doesUserHaveAuthGroup } from '../../../common/helper/auth.helper';
import { formatTemplateData } from '../../../common/helper/format-template-data.helper';
import {
  fetchPermitDataDescriptionValuesFromCache,
  generateApplicationNumber,
  generatePermitNumber,
} from '../../../common/helper/permit-application.helper';
import { IDP } from '../../../common/enum/idp.enum';
import { PermitApplicationOrigin as PermitApplicationOriginEnum } from '../../../common/enum/permit-application-origin.enum';
import { INotificationDocument } from '../../../common/interface/notification-document.interface';
import { ReadFileDto } from '../../common/dto/response/read-file.dto';
import { CreateNotificationDto } from '../../common/dto/request/create-notification.dto';
import { ReadNotificationDto } from '../../common/dto/response/read-notification.dto';

@Injectable()
export class PermitService {
  private readonly logger = new Logger(PermitService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
    @InjectRepository(PermitType)
    private permitTypeRepository: Repository<PermitType>,
    private dataSource: DataSource,
    private readonly dopsService: DopsService,
    private paymentService: PaymentService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private async findOne(permitId: string): Promise<Permit> {
    return this.permitRepository.findOne({
      where: { permitId: permitId },
      relations: {
        company: true,
        permitData: true,
        applicationOwner: { userContact: true },
        issuer: { userContact: true },
      },
    });
  }

  /**
   * Finds a permit by its ID and verifies if the current user has authorization
   * to access it. Throws a ForbiddenException if the user does not have the
   * proper authorization. Returns a mapped ReadPermitDto object of the found
   * permit.
   * @param permitId The ID of the permit to find.
   * @param currentUser The current user's JWT details.
   * @returns A mapped ReadPermitDto object of the found permit.
   */
  public async findByPermitId(
    permitId: string,
    currentUser: IUserJWT,
  ): Promise<ReadPermitDto> {
    const permit = await this.findOne(permitId);
    // Check if the current user has the proper authorization to access this receipt.
    // Throws ForbiddenException if user does not belong to the specified user auth group or does not own the company.
    if (
      !doesUserHaveAuthGroup(
        currentUser.orbcUserAuthGroup,
        IDIR_USER_AUTH_GROUP_LIST,
      ) &&
      permit?.company?.companyId != currentUser.companyId
    ) {
      throw new ForbiddenException();
    }

    return this.classMapper.mapAsync(permit, Permit, ReadPermitDto, {
      extraArgs: () => ({
        currentUserAuthGroup: currentUser?.orbcUserAuthGroup,
      }),
    });
  }

  @LogAsyncMethodExecution()
  public async findAllPermitTypes(): Promise<PermitType[]> {
    return this.permitTypeRepository.find({});
  }

  /**
   * Finds a PDF document associated with a specific permit ID.
   * @param currentUser - The current User Details.
   * @param permitId - The ID of the permit for which to find the PDF document.
   * @param downloadMode - The mode for downloading the document (optional).
   * @returns A Promise resolving to a ReadFileDto object representing the found PDF document.
   */

  @LogAsyncMethodExecution()
  public async findPDFbyPermitId(
    currentUser: IUserJWT,
    permitId: string,
    downloadMode: FileDownloadModes,
    res?: Response,
  ): Promise<void> {
    // Retrieve the permit details using the permit ID
    const permit = await this.findOne(permitId);

    // Check if current user is in the allowed auth group or owns the company, else throw ForbiddenException
    if (
      !doesUserHaveAuthGroup(
        currentUser.orbcUserAuthGroup,
        IDIR_USER_AUTH_GROUP_LIST,
      ) &&
      permit?.company?.companyId != currentUser.companyId
    ) {
      throw new ForbiddenException();
    }

    // Use the DOPS service to download the document associated with the permit
    await this.dopsService.download(
      currentUser,
      permit.documentId,
      downloadMode,
      res,
      permit.company?.companyId,
    );
  }

  /**
   * Retrieves permits based on user GUID, company ID, and expiration status. It allows for sorting, pagination, and filtering of the permit results.
   * @param findPermitOptions - Optional object containing query parameters such as page, take, orderBy, companyId, expired, searchColumn, searchString, and userGUID for filtering, pagination, and sorting.
   * @returns Promise of PaginationDto containing an array of ReadPermitDto.
   */
  @LogAsyncMethodExecution()
  public async findPermit(findPermitOptions?: {
    page: number;
    take: number;
    orderBy?: string;
    companyId?: number;
    expired?: boolean;
    searchColumn?: PermitSearch;
    searchString?: string;
    userGUID?: string;
    currentUser?: IUserJWT;
  }): Promise<PaginationDto<ReadPermitMetadataDto>> {
    // Construct the base query to find permits
    const permitsQB = this.buildPermitQuery(
      findPermitOptions.companyId,
      findPermitOptions.expired,
      findPermitOptions.searchColumn,
      findPermitOptions.searchString,
      findPermitOptions.userGUID,
    );

    // total number of items
    const totalItems = await permitsQB.getCount();

    // Mapping of frontend orderBy parameter to database columns
    const orderByMapping: Record<string, string> = {
      permitNumber: 'permit.permitNumber',
      permitType: 'permit.permitType',
      updatedDateTime: 'permit.updatedDateTime',
      startDate: 'permitData.startDate',
      expiryDate: 'permitData.expiryDate',
      unitNumber: 'permitData.unitNumber',
      plate: 'permitData.plate',
      vin: 'permitData.vin',
    };

    // Apply sorting if orderBy parameter is provided
    if (findPermitOptions.orderBy) {
      sortQuery<Permit>(permitsQB, orderByMapping, findPermitOptions.orderBy);
    }
    // Apply pagination if page and take parameters are provided
    if (findPermitOptions.page && findPermitOptions.take) {
      paginate<Permit>(
        permitsQB,
        findPermitOptions.page,
        findPermitOptions.take,
      );
    }

    // Get the paginated list of permits
    const permits = await permitsQB.getMany();

    // Prepare pagination metadata
    const pageMetaDto = new PageMetaDto({
      totalItems,
      pageOptionsDto: {
        page: findPermitOptions.page,
        take: findPermitOptions.take,
        orderBy: findPermitOptions.orderBy,
      },
    });
    // Map permit entities to ReadPermitDto objects
    const readPermitMetadataDto: ReadPermitMetadataDto[] =
      await this.mapEntitiesToReadPermitMetadataDto(
        permits,
        findPermitOptions.currentUser,
      );
    // Return paginated result
    return new PaginationDto(readPermitMetadataDto, pageMetaDto);
  }

  private buildPermitQuery(
    companyId: number,
    expired: boolean,
    searchColumn: PermitSearch,
    searchString: string,
    userGUID: string,
  ): SelectQueryBuilder<Permit> {
    let permitsQuery = this.permitRepository
      .createQueryBuilder('permit')
      .leftJoinAndSelect('permit.company', 'company')
      .innerJoinAndSelect('permit.permitData', 'permitData')
      .leftJoinAndSelect('permit.applicationOwner', 'applicationOwner')
      .leftJoinAndSelect(
        'applicationOwner.userContact',
        'applicationOwnerContact',
      )
      .leftJoinAndSelect('permit.issuer', 'issuer')
      .leftJoinAndSelect('issuer.userContact', 'issuerContact');

    // Ensure permit number is not null
    permitsQuery = permitsQuery.where('permit.permitNumber IS NOT NULL');

    // Filter by companyId if provided
    if (companyId) {
      permitsQuery = permitsQuery.andWhere('company.companyId = :companyId', {
        companyId: companyId,
      });
    }

    // Filter by userGUID if provided
    if (userGUID) {
      permitsQuery = permitsQuery.andWhere(
        'applicationOwner.userGUID = :userGUID',
        {
          userGUID,
        },
      );
    }

    // Handle expired permits query condition
    if (expired === true) {
      permitsQuery = permitsQuery.andWhere(
        new Brackets((qb) => {
          qb.where(
            'permit.permitStatus IN (:...expiredStatus) OR (permit.permitStatus = :activeStatus AND permitData.expiryDate < :expiryDate)',
            {
              expiredStatus: Object.values(PermitStatus).filter(
                (x) => x != PermitStatus.ISSUED && x != PermitStatus.SUPERSEDED,
              ),
              activeStatus: PermitStatus.ISSUED,
              expiryDate: new Date(),
            },
          );
        }),
      );
    }

    // Handle active permits query condition
    if (expired === false) {
      permitsQuery = permitsQuery.andWhere(
        new Brackets((qb) => {
          qb.where(
            '(permit.permitStatus = :activeStatus AND permitData.expiryDate >= :expiryDate)',
            {
              activeStatus: PermitStatus.ISSUED,
              expiryDate: new Date(),
            },
          );
        }),
      );
    }

    // Handle search conditions
    if (searchColumn) {
      switch (searchColumn) {
        case PermitSearch.PLATE:
          permitsQuery = permitsQuery.andWhere(
            'permitData.plate like :searchString',
            { searchString: `%${searchString}%` },
          );
          break;
        case PermitSearch.PERMIT_NUMBER:
          permitsQuery = permitsQuery.andWhere(
            new Brackets((query) => {
              query
                .where(`permit.permitNumber like :searchString`, {
                  searchString: `%${searchString}%`,
                })
                .orWhere(`permit.migratedPermitNumber like :searchString`, {
                  searchString: `%${searchString}%`,
                });
            }),
          );
          break;
      }
    }

    // Handle cases where only searchString is provided
    if (!searchColumn && searchString) {
      permitsQuery = permitsQuery.andWhere(
        new Brackets((query) => {
          query
            .where('permitData.plate like :searchString', {
              searchString: `%${searchString}%`,
            })
            .orWhere('permitData.unitNumber like :searchString', {
              searchString: `%${searchString}%`,
            });
        }),
      );
    }

    return permitsQuery;
  }

  private async mapEntitiesToReadPermitMetadataDto(
    entities: Permit[],
    currentUser: IUserJWT,
  ): Promise<ReadPermitMetadataDto[]> {
    const readPermitDto: ReadPermitMetadataDto[] =
      await this.classMapper.mapArrayAsync(
        entities,
        Permit,
        ReadPermitMetadataDto,
        {
          extraArgs: () => ({
            currentUserAuthGroup: currentUser?.orbcUserAuthGroup,
          }),
        },
      );
    return readPermitDto;
  }

  /**
   * Finds a receipt PDF document associated with a specific permit ID.
   * @param currentUser - The current User Details.
   * @param permitId - The ID of the permit for which to find the receipt PDF document.
   * @returns A Promise resolving to a ReadFileDto object representing the found PDF document.
   */
  @LogAsyncMethodExecution()
  public async findReceiptPDF(
    currentUser: IUserJWT,
    permitId: string,
    res?: Response,
  ): Promise<void> {
    // Query the database to find a permit and its related transactions and receipt based on the permit ID.
    const permit = await this.permitRepository
      .createQueryBuilder('permit')
      .leftJoinAndSelect('permit.company', 'company')
      .innerJoinAndSelect('permit.permitTransactions', 'permitTransactions')
      .innerJoinAndSelect('permitTransactions.transaction', 'transaction')
      .innerJoinAndSelect('transaction.receipt', 'receipt')
      .where('permit.permitId = :permitId', {
        permitId: permitId,
      })
      .andWhere('receipt.receiptNumber IS NOT NULL')
      .getOne();

    // If no permit is found, throw a NotFoundException indicating the receipt is not found.
    if (!permit) {
      throw new NotFoundException('Receipt Not Found!');
    }

    // Check if the current user has the proper authorization to access this receipt.
    // Throws ForbiddenException if user does not belong to the specified user auth group or does not own the company.
    if (
      !doesUserHaveAuthGroup(
        currentUser.orbcUserAuthGroup,
        IDIR_USER_AUTH_GROUP_LIST,
      ) &&
      permit?.company?.companyId != currentUser.companyId
    ) {
      throw new ForbiddenException();
    }

    // If authorized, proceed to download the receipt PDF using the dopsService.
    // This method delegates the request handling based on the provided download mode and sends the file as a response if applicable.
    await this.dopsService.download(
      currentUser,
      permit.permitTransactions[0].transaction.receipt.receiptDocumentId,
      FileDownloadModes.PROXY,
      res,
      permit.company?.companyId,
    );
  }

  @LogAsyncMethodExecution()
  public async findPermitHistory(
    originalPermitId: string,
  ): Promise<PermitHistoryDto[]> {
    const permits = await this.permitRepository
      .createQueryBuilder('permit')
      .innerJoinAndSelect('permit.permitTransactions', 'permitTransactions')
      .innerJoinAndSelect('permitTransactions.transaction', 'transaction')
      .where('permit.permitNumber IS NOT NULL')
      .andWhere('permit.originalPermitId = :originalPermitId', {
        originalPermitId: originalPermitId,
      })
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

  @LogAsyncMethodExecution()
  async checkApplicationInProgressForIssuance(
    originalPermitId: string,
  ): Promise<number> {
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
   *
   * @param permitId ex: 1
   * @param status ex: VOIDED|REVOKED
   * Description: This method will update the permit status for given permit id and will set it to either REVOKED or VOIDED stauts.
   */
  @LogAsyncMethodExecution()
  public async voidPermit(
    permitId: string,
    voidPermitDto: VoidPermitDto,
    currentUser: IUserJWT,
  ): Promise<ResultDto> {
    const permit = await this.findOne(permitId);
    /**
     * If permit not found raise error.
     */
    if (!permit)
      throw new NotFoundException('Permit id ' + permitId + ' not found.');
    /**
     * If permit is not active, raise error.
     */
    if (permit.permitStatus != ApplicationStatus.ISSUED)
      throw new InternalServerErrorException(
        'Cannot void a permit in ' + permit.permitStatus + ' status',
      );
    /**
     * If application in progress for permit then raise error.
     */
    const applicationCount = await this.checkApplicationInProgressForIssuance(
      permit.originalPermitId,
    );
    if (applicationCount > 0) {
      throw new InternalServerErrorException(
        'An application exists for this permit. Please cancel application before voiding permit.',
      );
    }

    //Generate appliction number for the application to be created in database.
    const applicationNumber = await generateApplicationNumber(
      this.dataSource,
      this.cacheManager,
      currentUser.identity_provider === IDP.IDIR
        ? PermitApplicationOriginEnum.PPC
        : PermitApplicationOriginEnum.ONLINE,
      permit,
    );

    const permitNumber = await generatePermitNumber(this.cacheManager, permit);

    let success = '';
    let failure = '';

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userMetadata: Base = {
        createdDateTime: new Date(),
        createdUser: currentUser.userName,
        createdUserDirectory: currentUser.orbcUserDirectory,
        createdUserGuid: currentUser.userGUID,
        updatedDateTime: new Date(),
        updatedUser: currentUser.userName,
        updatedUserDirectory: currentUser.orbcUserDirectory,
        updatedUserGuid: currentUser.userGUID,
      };

      // to create new permit
      let newPermit = new Permit();
      newPermit = Object.assign(newPermit, permit);
      newPermit.permitId = null;
      newPermit.permitNumber = permitNumber;
      newPermit.applicationNumber = applicationNumber;
      newPermit.permitStatus = voidPermitDto.status;
      newPermit.permitApprovalSource = PermitApprovalSource.PPC;
      newPermit.permitIssuedBy =
        currentUser.orbcUserDirectory == Directory.IDIR
          ? PermitIssuedBy.PPC
          : PermitIssuedBy.SELF_ISSUED;
      newPermit.applicationOwner = new User();
      newPermit.applicationOwner.userGUID = currentUser.userGUID;
      newPermit.issuer = new User();
      newPermit.issuer.userGUID = currentUser.userGUID;
      newPermit.permitIssueDateTime = new Date();
      newPermit.revision = permit.revision + 1;
      newPermit.previousRevision = permitId;
      newPermit.comment = voidPermitDto.comment;
      newPermit = Object.assign(newPermit, userMetadata);

      let permitData = new PermitData();
      permitData.permitData = permit.permitData.permitData;
      permitData = Object.assign(permitData, userMetadata);
      newPermit.permitData = permitData;

      /* Create application to generate permit id. 
      this permit id will be used to generate permit number based this id's application number.*/
      newPermit = await queryRunner.manager.save(newPermit);

      //Update old permit status to SUPERSEDED.
      await queryRunner.manager.update(
        Permit,
        {
          permitId: newPermit.previousRevision,
        },
        {
          permitStatus: ApplicationStatus.SUPERSEDED,
          updatedDateTime: new Date(),
          updatedUser: currentUser.userName,
          updatedUserDirectory: currentUser.orbcUserDirectory,
          updatedUserGuid: currentUser.userGUID,
        },
      );

      const createTransactionDto = new CreateTransactionDto();
      createTransactionDto.transactionTypeId = voidPermitDto.transactionTypeId;
      createTransactionDto.paymentMethodTypeCode =
        voidPermitDto.paymentMethodTypeCode;
      createTransactionDto.paymentCardTypeCode = voidPermitDto.pgCardType;
      createTransactionDto.pgCardType = voidPermitDto.pgCardType;
      createTransactionDto.pgTransactionId = voidPermitDto.pgTransactionId;
      createTransactionDto.pgPaymentMethod = voidPermitDto.pgPaymentMethod;

      // Refund for void should automatically set this flag to approved for payment gateway payment methods
      // Otherwise, the flag is not applicable
      if (voidPermitDto.paymentMethodTypeCode === PaymentMethodType.WEB) {
        createTransactionDto.pgApproved = 1;
      }

      createTransactionDto.applicationDetails = [
        {
          applicationId: newPermit.permitId,
          transactionAmount: voidPermitDto.transactionAmount,
        },
      ];
      const transactionDto = await this.paymentService.createTransactions(
        currentUser,
        createTransactionDto,
        queryRunner,
      );

      const fetchedTransaction = await queryRunner.manager.findOne(
        Transaction,
        {
          where: { transactionId: transactionDto.transactionId },
          relations: ['receipt'],
        },
      );

      const companyInfo = newPermit.company;

      const fullNames = await fetchPermitDataDescriptionValuesFromCache(
        this.cacheManager,
        newPermit,
      );

      const revisionHistory = await queryRunner.manager.find(Permit, {
        where: { originalPermitId: permit.originalPermitId },
        order: { permitId: 'DESC' },
      });

      const permitDataForTemplate = formatTemplateData(
        newPermit,
        fullNames,
        companyInfo,
        revisionHistory,
      );

      let dopsRequestData: DopsGeneratedDocument = {
        templateName:
          voidPermitDto.status == ApplicationStatus.VOIDED
            ? TemplateName.PERMIT_VOID
            : TemplateName.PERMIT_REVOKED,
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
        generatedDocumentFileName: `Receipt_No_${fetchedTransaction.receipt.receiptNumber}`,
        templateData: {
          ...permitDataForTemplate,
          pgTransactionId: fetchedTransaction.pgTransactionId,
          transactionOrderNumber: fetchedTransaction.transactionOrderNumber,
          transactionAmount: formatAmount(
            fetchedTransaction.transactionTypeId,
            fetchedTransaction.totalTransactionAmount,
          ),
          totalTransactionAmount: formatAmount(
            fetchedTransaction.transactionTypeId,
            fetchedTransaction.totalTransactionAmount,
          ),
          //Payer Name should be persisted in transacation Table so that it can be used for DocRegen
          payerName:
            currentUser.orbcUserDirectory === Directory.IDIR
              ? 'Provincial Permit Centre'
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
              fetchedTransaction.paymentMethodTypeCode,
              fetchedTransaction.paymentCardTypeCode,
            )
          ).consolidatedPaymentMethod,
          transactionDate: convertUtcToPt(
            fetchedTransaction.transactionSubmitDate,
            'MMM. D, YYYY, hh:mm a Z',
          ),
          receiptNo: fetchedTransaction.receipt.receiptNumber,
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

      // Update Document Id on new permit
      await queryRunner.manager.update(
        Permit,
        {
          permitId: newPermit.permitId,
        },
        {
          documentId: generatedDocuments.at(0).documentId,
          updatedDateTime: new Date(),
          updatedUser: currentUser.userName,
          updatedUserDirectory: currentUser.orbcUserDirectory,
          updatedUserGuid: currentUser.userGUID,
        },
      );

      // Update Document Id on new receipt
      await queryRunner.manager.update(
        Receipt,
        {
          receiptId: fetchedTransaction.receipt.receiptId,
        },
        {
          receiptDocumentId: generatedDocuments.at(1).documentId,
          updatedDateTime: new Date(),
          updatedUser: currentUser.userName,
          updatedUserDirectory: currentUser.orbcUserDirectory,
          updatedUserGuid: currentUser.userGUID,
        },
      );

      await queryRunner.commitTransaction();
      success = permit.permitId;

      try {
        const notificationData: IssuePermitDataNotification = {
          companyName: companyInfo.legalName,
        };

        const emailList = [
          permitDataForTemplate.permitData?.contactDetails?.email,
          permitDataForTemplate.permitData?.contactDetails?.additionalEmail,
          voidPermitDto.additionalEmail,
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
      failure = permitId;
    } finally {
      await queryRunner.release();
    }
    const resultDto: ResultDto = {
      success: [success],
      failure: [failure],
    };
    return resultDto;
  }
  /**
   * Retrieves permit type information from cache.
   * @returns A Promise resolving to a map of permit types.
   */
  @LogAsyncMethodExecution()
  async getPermitType(): Promise<Record<string, string>> {
    return await getMapFromCache(this.cacheManager, CacheKey.PERMIT_TYPE);
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
   * Sends a notification associated with a permit, including generating and sending document(s) based on permit details and transactions.
   * It handles fetching the permit details, generating required documents if they don't exist, and constructing a notification request.
   *
   * @param currentUser The current user's JWT details.
   * @param permitId The permit ID for which the notification will be sent.
   * @param createNotificationDto DTO containing details such as recipients for the notification.
   * @returns The result of the notification sending operation wrapped in a Promise.
   */
  @LogAsyncMethodExecution()
  public async sendNotification(
    currentUser: IUserJWT,
    permitId: string,
    createNotificationDto: CreateNotificationDto,
  ): Promise<ReadNotificationDto> {
    let permitDocumentId: string;
    let receiptDocumentId: string;
    // Retrieve detailed information about the permit, including company, transactions, and the receipt for notifications
    const permit = await this.permitRepository
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
      .leftJoinAndSelect('permit.issuer', 'issuer')
      .leftJoinAndSelect('issuer.userContact', 'issuerOwnerContact')
      .where('permit.permitId = :permitId', {
        permitId: permitId,
      })
      .andWhere('permit.permitNumber IS NOT NULL')
      .andWhere('transaction.pgApproved = 1')
      .getOne();

    /**
     * If permit not found raise error.
     */
    if (!permit) throw new NotFoundException('Valid permit not found.');

    const companyInfo = permit.company;

    const notificationData: IssuePermitDataNotification = {
      companyName: companyInfo.legalName,
    };

    permitDocumentId = permit?.documentId;
    receiptDocumentId =
      permit?.permitTransactions?.at(0)?.transaction?.receipt
        ?.receiptDocumentId;

    //If permit Document or receipt is not attached to the permit
    if (!permitDocumentId || !receiptDocumentId) {
      const fullNames = await fetchPermitDataDescriptionValuesFromCache(
        this.cacheManager,
        permit,
      );

      const revisionHistory = await this.permitRepository.find({
        where: [
          {
            originalPermitId: permit.originalPermitId,
            permitId: LessThanOrEqual(permit.permitId),
          },
        ],
        order: { permitId: 'DESC' },
      });

      const permitDataForTemplate = formatTemplateData(
        permit,
        fullNames,
        companyInfo,
        revisionHistory,
      );
      //Regenerate permit document if not available
      if (!permitDocumentId) {
        const dopsRequestData: DopsGeneratedDocument = {
          templateName: (() => {
            switch (permit.permitStatus) {
              case ApplicationStatus.ISSUED:
                return TemplateName.PERMIT;
              case ApplicationStatus.VOIDED:
                return TemplateName.PERMIT_VOID;
              case ApplicationStatus.REVOKED:
                return TemplateName.PERMIT_REVOKED;
            }
          })(),
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
        const permitDocument = await this.generateDocument(
          currentUser,
          dopsRequestData,
          companyInfo.companyId,
        );

        permitDocumentId = permitDocument.documentId;

        await this.permitRepository
          .createQueryBuilder()
          .update()
          .set({
            documentId: permitDocumentId,
            updatedUser: currentUser.userName,
            updatedDateTime: new Date(),
            updatedUserDirectory: currentUser.orbcUserDirectory,
            updatedUserGuid: currentUser.userGUID,
          })
          .where('permitId = :permitId', { permitId: permit.permitId })
          .execute();
      }
      //Regenerate receipt document if not available
      if (!receiptDocumentId) {
        const receiptNumber =
          permit.permitTransactions?.at(0).transaction.receipt.receiptNumber;

        const dopsRequestData: DopsGeneratedDocument = {
          templateName: TemplateName.PAYMENT_RECEIPT,
          generatedDocumentFileName: `Receipt_No_${receiptNumber}`,
          templateData: {
            ...permitDataForTemplate,
            // transaction details still needs to be reworked to support multiple permits
            pgTransactionId:
              permit.permitTransactions[0].transaction.pgTransactionId,
            transactionOrderNumber:
              permit.permitTransactions[0].transaction.transactionOrderNumber,
            transactionAmount: formatAmount(
              permit.permitTransactions[0].transaction.transactionTypeId,
              permit.permitTransactions[0].transactionAmount,
            ),
            totalTransactionAmount: formatAmount(
              permit.permitTransactions[0].transaction.transactionTypeId,
              permit.permitTransactions[0].transaction.totalTransactionAmount,
            ),
            payerName:
              permit.permitIssuedBy === PermitIssuedBy.PPC
                ? constants.PPC_FULL_TEXT
                : `${permit?.issuer?.userContact?.firstName} ${permit?.issuer?.userContact?.lastName}`,
            issuedBy:
              permit.permitIssuedBy === PermitIssuedBy.PPC
                ? constants.PPC_FULL_TEXT
                : constants.SELF_ISSUED,
            consolidatedPaymentMethod: (
              await getPaymentCodeFromCache(
                this.cacheManager,
                permit.permitTransactions[0].transaction.paymentMethodTypeCode,
                permit.permitTransactions[0].transaction.paymentCardTypeCode,
              )
            ).consolidatedPaymentMethod,
            transactionDate: convertUtcToPt(
              permit.permitTransactions[0].transaction.transactionSubmitDate,
              'MMM. D, YYYY, hh:mm a Z',
            ),
            receiptNo: receiptNumber,
          },
        };
        const receiptDocument = await this.generateDocument(
          currentUser,
          dopsRequestData,
          companyInfo.companyId,
        );
        receiptDocumentId = receiptDocument.documentId;

        await this.paymentService.updateReceiptDocument(
          currentUser,
          permit?.permitTransactions[0]?.transaction?.receipt?.receiptId,
          receiptDocumentId,
        );
      }
    }

    // Construct the notification document including template name, recipients, subject, data, and related document IDs
    const notificationDocument: INotificationDocument = {
      templateName: NotificationTemplate.ISSUE_PERMIT,
      to: createNotificationDto.to,
      subject: 'onRouteBC Permits - ' + companyInfo.legalName,
      data: notificationData,
      documentIds: [permitDocumentId, receiptDocumentId],
    };

    // Send the constructed notification via the DOPS service and return the result
    return await this.dopsService.notificationWithDocumentsFromDops(
      currentUser,
      notificationDocument,
    );
  }
}
