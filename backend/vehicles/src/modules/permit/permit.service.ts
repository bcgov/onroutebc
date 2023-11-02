import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import { CreatePermitDto } from './dto/request/create-permit.dto';
import { ReadPermitDto } from './dto/response/read-permit.dto';
import { Permit } from './entities/permit.entity';
import { PermitType } from './entities/permit-type.entity';
import { DopsService } from '../common/dops.service';
import { FileDownloadModes } from '../../common/enum/file-download-modes.enum';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { Response } from 'express';
import { ReadFileDto } from '../common/dto/response/read-file.dto';
import { PermitStatus } from 'src/common/enum/permit-status.enum';
import { Receipt } from '../payment/entities/receipt.entity';
import {
  IPaginationMeta,
  IPaginationOptions,
} from 'src/common/interface/pagination.interface';
import { PaginationDto } from 'src/common/class/pagination';
import { paginate } from 'src/common/helper/paginate';
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
import { TransactionType } from '../../common/enum/transaction-type.enum';
import { Transaction } from '../payment/entities/transaction.entity';
import { Directory } from 'src/common/enum/directory.enum';
import { PermitData } from './entities/permit-data.entity';
import { Base } from '../common/entities/base.entity';

@Injectable()
export class PermitService {
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
    private paymentService: PaymentService,
  ) {}

  async create(
    createPermitDto: CreatePermitDto,
    currentUser: IUserJWT,
    directory: Directory,
  ): Promise<ReadPermitDto> {
    const permitEntity = await this.classMapper.mapAsync(
      createPermitDto,
      CreatePermitDto,
      Permit,
      {
        extraArgs: () => ({
          userName: currentUser.userName,
          directory: directory,
          userGUID: currentUser.userGUID,
          timestamp: new Date(),
        }),
      },
    );

    const savedPermitEntity = await this.permitRepository.save(permitEntity);

    const refreshedPermitEntity = await this.findOne(
      savedPermitEntity.permitId,
    );

    const readPermitDto = await this.classMapper.mapAsync(
      refreshedPermitEntity,
      Permit,
      ReadPermitDto,
    );

    return readPermitDto;
  }

  private async findOne(permitId: string): Promise<Permit> {
    return this.permitRepository.findOne({
      where: { permitId: permitId },
      relations: {
        permitData: true,
      },
    });
  }

  /**
   * Find single permit with associated data by permit id.
   * @param permitId permit id
   * @returns permit with data
   */
  public async findByPermitId(permitId: string): Promise<ReadPermitDto> {
    const permit = await this.findOne(permitId);
    return this.classMapper.mapAsync(permit, Permit, ReadPermitDto);
  }

  /**
   * Finds permits by permit number.
   * @param permitNumber partial or full permit number to search
   * @returns an array of permits
   */
  public async findByPermitNumber(
    permitNumber: string,
  ): Promise<ReadPermitDto[]> {
    const permits = await this.permitRepository.find({
      where: { permitNumber: Like(`%${permitNumber}%`) },
    });
    return this.classMapper.mapArrayAsync(permits, Permit, ReadPermitDto);
  }

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
  public async findPDFbyPermitId(
    currentUser: IUserJWT,
    permitId: string,
    downloadMode: FileDownloadModes,
    res?: Response,
  ): Promise<ReadFileDto> {
    // Retrieve the permit details using the permit ID
    const permit = await this.findOne(permitId);

    let file: ReadFileDto = null;
    if (downloadMode === FileDownloadModes.PROXY) {
      await this.dopsService.download(
        currentUser,
        permit.documentId,
        downloadMode,
        res,
        permit.companyId,
      );
    } else {
      file = (await this.dopsService.download(
        currentUser,
        permit.documentId,
        downloadMode,
        res,
        permit.companyId,
      )) as ReadFileDto;
    }
    return file;
  }

  async findPermit(
    options: IPaginationOptions,
    searchColumn: string,
    searchString: string,
  ): Promise<PaginationDto<ReadPermitDto, IPaginationMeta>> {
    const permits = this.permitRepository
      .createQueryBuilder('permit')
      .innerJoinAndSelect('permit.permitData', 'permitData')
      .where('permit.permitNumber IS NOT NULL');
    if (searchColumn.toLowerCase() === 'plate') {
      permits.andWhere(
        `JSON_VALUE(permitData.permitData, '$.vehicleDetails.plate') like '%${searchString}%'`,
      );
    }
    if (searchColumn.toLowerCase() === 'permitnumber') {
      permits.andWhere(`permit.permitNumber like '%${searchString}%'`);
    }
    if (searchColumn.toLowerCase() === 'clientnumber') {
      permits.andWhere(
        `JSON_VALUE(permitData.permitData, '$.clientNumber') like '%${searchString}%'`,
      );
    }
    if (searchColumn.toLowerCase() === 'companyname') {
      permits.andWhere(
        `JSON_VALUE(permitData.permitData, '$.companyName') like '%${searchString}%'`,
      );
    }
    if (searchColumn.toLowerCase() === 'applicationnumber') {
      permits.andWhere(`permit.applicationNumber like '%${searchString}%'`);
    }
    const permit: PaginationDto<Permit, IPaginationMeta> = await paginate(
      permits,
      options,
    );
    const readPermitDto: ReadPermitDto[] = await this.classMapper.mapArrayAsync(
      permit.items,
      Permit,
      ReadPermitDto,
    );
    const readPermitDtoItems: PaginationDto<ReadPermitDto, IPaginationMeta> =
      new PaginationDto<ReadPermitDto, IPaginationMeta>(
        readPermitDto,
        permit.meta,
      );
    return readPermitDtoItems;
  }

  /**
   * Finds permits for user.
   * @param userGUID if present get permits for this user
   *  @param companyId if present get permits for this company
   * @param expired if true get expired premits else get active permits
   *
   */
  public async findUserPermit(
    options: IPaginationOptions,
    userGUID: string,
    companyId: number,
    expired: string,
  ): Promise<PaginationDto<ReadPermitDto, IPaginationMeta>> {
    const permits = this.permitRepository
      .createQueryBuilder('permit')
      .innerJoinAndSelect('permit.permitData', 'permitData')
      .where('permit.permitNumber IS NOT NULL')
      .andWhere('permit.companyId = :companyId', {
        companyId: companyId,
      })
      .andWhere(userGUID ? 'permit.userGuid = :userGUID' : '1=1', {
        userGUID: userGUID,
      })
      .andWhere(
        expired === 'true'
          ? '(permit.permitStatus IN (:...expiredStatus)OR(permit.permitStatus = :activeStatus AND permitData.expiryDate < :expiryDate))'
          : '(permit.permitStatus = :activeStatus AND permitData.expiryDate >= :expiryDate)',
        {
          expiredStatus: Object.values(PermitStatus).filter(
            (x) => x != PermitStatus.ISSUED && x != PermitStatus.SUPERSEDED,
          ),
          activeStatus: PermitStatus.ISSUED,
          expiryDate: new Date(),
        },
      );

    const permit: PaginationDto<Permit, IPaginationMeta> = await paginate(
      permits,
      options,
    );
    const readPermitDto: ReadPermitDto[] = await this.classMapper.mapArrayAsync(
      permit.items,
      Permit,
      ReadPermitDto,
    );
    const readPermitDtoItems: PaginationDto<ReadPermitDto, IPaginationMeta> =
      new PaginationDto<ReadPermitDto, IPaginationMeta>(
        readPermitDto,
        permit.meta,
      );
    return readPermitDtoItems;
  }

  /**
   * Finds a receipt PDF document associated with a specific permit ID.
   * @param currentUser - The current User Details.
   * @param permitId - The ID of the permit for which to find the receipt PDF document.
   * @returns A Promise resolving to a ReadFileDto object representing the found PDF document.
   */
  public async findReceiptPDF(
    currentUser: IUserJWT,
    permitId: string,
    res?: Response,
  ): Promise<void> {
    const permit = await this.permitRepository
      .createQueryBuilder('permit')
      .innerJoinAndSelect('permit.permitTransactions', 'permitTransactions')
      .innerJoinAndSelect('permitTransactions.transaction', 'transaction')
      .innerJoinAndSelect('transaction.receipt', 'receipt')
      .where('permit.permitId = :permitId', {
        permitId: permitId,
      })
      .andWhere('receipt.receiptNumber IS NOT NULL')
      .getOne();

    if (!permit) {
      throw new NotFoundException('Receipt Not Found!');
    }

    await this.dopsService.download(
      currentUser,
      permit.permitTransactions[0].transaction.receipt.receiptDocumentId,
      FileDownloadModes.PROXY,
      res,
      permit.companyId,
    );
  }

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
        pgCardType: permitTransaction.transaction.pgCardType,
        commentUsername: permit.createdUser,
        permitId: +permit.permitId,
        transactionSubmitDate: permitTransaction.transaction.transactionSubmitDate,
      })),
    ) as PermitHistoryDto[];
  }

  /**
   *
   * @param permitId ex: 1
   * @param status ex: VOIDED|REVOKED
   * Description: This method will update the permit status for given permit id and will set it to either REVOKED or VOIDED stauts.
   */
  public async voidPermit(
    permitId: string,
    voidPermitDto: VoidPermitDto,
    currentUser: IUserJWT,
    directory: Directory,
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
        createdUserDirectory: directory,
        createdUserGuid: currentUser.userGUID,
        updatedDateTime: new Date(),
        updatedUser: currentUser.userName,
        updatedUserDirectory: directory,
        updatedUserGuid: currentUser.userGUID,
      };

      // to create new permit
      let newPermit = new Permit();
      newPermit = Object.assign(newPermit, permit);
      newPermit.permitId = null;
      newPermit.permitNumber = permitNumber;
      newPermit.applicationNumber = applicationNumber;
      newPermit.permitStatus = voidPermitDto.status;
      newPermit.permitIssueDateTime = new Date();
      newPermit.revision = permit.revision + 1;
      newPermit.previousRevision = +permitId;
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
          updatedUserDirectory: directory,
          updatedUserGuid: currentUser.userGUID,
        },
      );

      const createTransactionDto = new CreateTransactionDto();
      createTransactionDto.pgTransactionId = voidPermitDto.pgTransactionId;
      createTransactionDto.pgPaymentMethod = voidPermitDto.pgPaymentMethod;
      createTransactionDto.pgCardType = voidPermitDto.pgCardType;
      createTransactionDto.paymentMethodId = voidPermitDto.paymentMethodId;
      createTransactionDto.transactionTypeId =
        voidPermitDto.transactionAmount === 0
          ? TransactionType.ZERO_AMOUNT
          : TransactionType.REFUND;
      createTransactionDto.applicationDetails = [
        {
          applicationId: newPermit.permitId,
          transactionAmount: voidPermitDto.transactionAmount,
        },
      ];
      const transactionDto = await this.paymentService.createTransactions(
        currentUser,
        createTransactionDto,
        directory,
        queryRunner,
      );

      const fetchedTransaction = await queryRunner.manager.findOne(
        Transaction,
        {
          where: { transactionId: transactionDto.transactionId },
          relations: ['receipt'],
        },
      );

      const companyInfo = await this.companyService.findOne(
        newPermit.companyId,
      );

      const fullNames = await this.applicationService.getFullNamesFromCache(
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
          transactionOrderNumber: fetchedTransaction.transactionOrderNumber,
          transactionAmount: fetchedTransaction.totalTransactionAmount,
          paymentMethod: fetchedTransaction.pgPaymentMethod,
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
          updatedUserDirectory: directory,
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
          updatedUserDirectory: directory,
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

        void this.emailService.sendEmailMessage(
          EmailTemplate.ISSUE_PERMIT,
          emailData,
          'onRouteBC Permits - ' + companyInfo.legalName,
          [
            permitDataForTemplate.permitData?.contactDetails?.email,
            companyInfo.email,
          ],
          attachments,
        );
      } catch (error: unknown) {
        console.log('Error in Email Service', error);
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.log(err);
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
}
