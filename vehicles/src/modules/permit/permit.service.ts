import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  DataSource,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { ReadPermitDto } from './dto/response/read-permit.dto';
import { Permit } from './entities/permit.entity';
import { PermitType } from './entities/permit-type.entity';
import { DopsService } from '../common/dops.service';
import { FileDownloadModes } from '../../common/enum/file-download-modes.enum';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { Response } from 'express';
import { PermitStatus } from 'src/common/enum/permit-status.enum';
import { Receipt } from '../payment/entities/receipt.entity';
import { PaginationDto } from 'src/common/dto/paginate/pagination';
import { PermitHistoryDto } from './dto/response/permit-history.dto';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';
import { ApplicationService } from './application.service';
import { formatTemplateData } from './helpers/formatTemplateData.helper';
import { CompanyService } from '../company-user-management/company/company.service';
import { DopsGeneratedDocument } from 'src/common/interface/dops-generated-document.interface';
import { TemplateName } from 'src/common/enum/template-name.enum';
import { convertUtcToPt } from 'src/common/helper/date-time.helper';
import { IFile } from 'src/common/interface/file.interface';
import { IssuePermitEmailData } from 'src/common/interface/issue-permit-email-data.interface';
import { AttachementEmailData } from 'src/common/interface/attachment-email-data.interface';
import { EmailService } from '../email/email.service';
import { EmailTemplate } from 'src/common/enum/email-template.enum';
import { ResultDto } from './dto/response/result.dto';
import { VoidPermitDto } from './dto/request/void-permit.dto';
import { PaymentService } from '../payment/payment.service';
import { CreateTransactionDto } from '../payment/dto/request/create-transaction.dto';
import { Transaction } from '../payment/entities/transaction.entity';
import { Directory } from 'src/common/enum/directory.enum';
import { PermitData } from './entities/permit-data.entity';
import { Base } from '../common/entities/base.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheKey } from 'src/common/enum/cache-key.enum';
import { getMapFromCache } from 'src/common/helper/cache.helper';
import { Cache } from 'cache-manager';
import { PermitIssuedBy } from '../../common/enum/permit-issued-by.enum';
import {
  formatAmount,
  getPaymentCodeFromCache,
} from '../../common/helper/payment.helper';
import { PaymentMethodType } from 'src/common/enum/payment-method-type.enum';
import { PageMetaDto } from 'src/common/dto/paginate/page-meta';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import * as constants from '../../common/constants/api.constant';
import { PermitApprovalSource } from '../../common/enum/permit-approval-source.enum';
import { PermitSearch } from '../../common/enum/permit-search.enum';
import { paginate, sortQuery } from '../../common/helper/database.helper';
import {
  UserAuthGroup,
  idirUserAuthGroupList,
} from '../../common/enum/user-auth-group.enum';
import { User } from '../company-user-management/users/entities/user.entity';

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
    private companyService: CompanyService,
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => ApplicationService))
    private readonly applicationService: ApplicationService,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findOne(permitId: string): Promise<Permit> {
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
      !idirUserAuthGroupList.includes(
        currentUser.orbcUserAuthGroup as UserAuthGroup,
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
      !idirUserAuthGroupList.includes(
        currentUser.orbcUserAuthGroup as UserAuthGroup,
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
  }): Promise<PaginationDto<ReadPermitDto>> {
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
      startDate: 'permitData.startDate',
      expiryDate: 'permitData.expiryDate',
      unitNumber: 'permitData.unitNumber',
      plate: 'permitData.plate',
      applicant: 'permitData.applicant',
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
    const readPermitDto: ReadPermitDto[] =
      await this.mapEntitiesToReadPermitDto(
        permits,
        findPermitOptions.currentUser,
      );
    // Return paginated result
    return new PaginationDto(readPermitDto, pageMetaDto);
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
            `JSON_VALUE(permitData.permitData, '$.vehicleDetails.plate') like :searchString`,
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
        case PermitSearch.CLIENT_NUMBER:
          permitsQuery = permitsQuery.andWhere(
            `JSON_VALUE(permitData.permitData, '$.clientNumber') like :searchString'`,
            {
              searchString: `%${searchString}%`,
            },
          );
          break;
        case PermitSearch.COMPANY_NAME:
          permitsQuery = permitsQuery.andWhere(
            `JSON_VALUE(permitData.permitData, '$.companyName') like :searchString`,
            {
              searchString: `%${searchString}%`,
            },
          );
          break;
        case PermitSearch.APPLICATION_NUMBER:
          permitsQuery = permitsQuery.andWhere(
            `permit.applicationNumber like :searchString`,
            {
              searchString: `%${searchString}%`,
            },
          );
          break;
      }
    }

    // Handle cases where only searchString is provided
    if (!searchColumn && searchString) {
      permitsQuery = permitsQuery.andWhere(
        new Brackets((query) => {
          query
            .where(
              `JSON_VALUE(permitData.permitData, '$.vehicleDetails.plate') like :searchString`,
              {
                searchString: `%${searchString}%`,
              },
            )
            .orWhere(
              `JSON_VALUE(permitData.permitData, '$.vehicleDetails.unitNumber') like :searchString`,
              {
                searchString: `%${searchString}%`,
              },
            );
        }),
      );
    }

    return permitsQuery;
  }

  private async mapEntitiesToReadPermitDto(
    entities: Permit[],
    currentUser: IUserJWT,
  ): Promise<ReadPermitDto[]> {
    const readPermitDto: ReadPermitDto[] = await this.classMapper.mapArrayAsync(
      entities,
      Permit,
      ReadPermitDto,
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
      !idirUserAuthGroupList.includes(
        currentUser.orbcUserAuthGroup as UserAuthGroup,
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
    nestedQueryRunner?: QueryRunner,
  ): Promise<PermitHistoryDto[]> {
    let permits: Permit[];
    if (nestedQueryRunner) {
      permits = await nestedQueryRunner.manager
        .createQueryBuilder()
        .select('Permit')
        .from(Permit, 'Permit')
        .innerJoinAndSelect('permit.permitTransactions', 'permitTransactions')
        .innerJoinAndSelect('permitTransactions.transaction', 'transaction')
        .where('permit.permitNumber IS NOT NULL')
        .andWhere('permit.originalPermitId = :originalPermitId', {
          originalPermitId: originalPermitId,
        })
        .orderBy('transaction.transactionSubmitDate', 'DESC')
        .getMany();
    } else {
      permits = await this.permitRepository
        .createQueryBuilder('permit')
        .innerJoinAndSelect('permit.permitTransactions', 'permitTransactions')
        .innerJoinAndSelect('permitTransactions.transaction', 'transaction')
        .where('permit.permitNumber IS NOT NULL')
        .andWhere('permit.originalPermitId = :originalPermitId', {
          originalPermitId: originalPermitId,
        })
        .orderBy('transaction.transactionSubmitDate', 'DESC')
        .getMany();
    }

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
    const applicationCount =
      await this.applicationService.checkApplicationInProgress(
        permit.originalPermitId,
      );
    if (applicationCount > 0) {
      throw new InternalServerErrorException(
        'An application exists for this permit. Please cancel application before voiding permit.',
      );
    }
    const applicationNumber =
      await this.applicationService.generateApplicationNumber(
        currentUser.identity_provider,
        permitId,
      );
    const permitNumber = await this.applicationService.generatePermitNumber(
      null,
      permitId,
    );
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
      newPermit = await this.permitRepository.save(newPermit);

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
      const voidStatus = voidPermitDto.status;
      const transactionDto = await this.paymentService.createTransactions(
        currentUser,
        createTransactionDto,
        null,
        voidStatus,
      );
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

      const fetchedTransaction = await queryRunner.manager.findOne(
        Transaction,
        {
          where: { transactionId: transactionDto.transactionId },
          relations: ['receipt'],
        },
      );

      const companyInfo = newPermit.company;
      const fullNames =
        await this.applicationService.getFullNamesFromCache(newPermit);

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
            ? TemplateName.PERMIT_TROS_VOID
            : TemplateName.PERMIT_TROS_REVOKED,
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
      const generatedPermitDocumentPromise =
        this.applicationService.generateDocument(
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

      const generatedReceiptDocumentPromise =
        this.applicationService.generateDocument(
          currentUser,
          dopsRequestData,
          companyInfo.companyId,
        );

      const generatedDocuments: IFile[] = await Promise.all([
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
          documentId: generatedDocuments.at(0).dmsId,
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
          receiptDocumentId: generatedDocuments.at(1).dmsId,
          updatedDateTime: new Date(),
          updatedUser: currentUser.userName,
          updatedUserDirectory: currentUser.orbcUserDirectory,
          updatedUserGuid: currentUser.userGUID,
        },
      );

      await queryRunner.commitTransaction();
      success = permit.permitId;

      try {
        const emailData: IssuePermitEmailData = {
          companyName: companyInfo.legalName,
        };

        const attachments: AttachementEmailData[] = [
          {
            filename: newPermit.permitNumber + '.pdf',
            contentType: 'application/pdf',
            encoding: 'base64',
            content: generatedDocuments.at(0).buffer.toString('base64'),
          },
          {
            filename: `Receipt_No_${fetchedTransaction.receipt.receiptNumber}.pdf`,
            contentType: 'application/pdf',
            encoding: 'base64',
            content: generatedDocuments.at(1).buffer.toString('base64'),
          },
        ];

        const emailList = [
          permitDataForTemplate.permitData?.contactDetails?.email,
          permitDataForTemplate.permitData?.contactDetails?.additionalEmail,
          voidPermitDto.additionalEmail,
          companyInfo.email,
        ].filter((email) => Boolean(email));

        const distinctEmailList = Array.from(new Set(emailList));

        void this.emailService.sendEmailMessage(
          EmailTemplate.ISSUE_PERMIT,
          emailData,
          'onRouteBC Permits - ' + companyInfo.legalName,
          distinctEmailList,
          attachments,
        );
      } catch (error: unknown) {
        /**
         * Swallow the error as failure to send email should not break the flow
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
}
