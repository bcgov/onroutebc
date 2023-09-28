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
import { IReceipt } from 'src/common/interface/receipt.interface';
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

@Injectable()
export class PermitService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
    @InjectRepository(PermitType)
    private permitTypeRepository: Repository<PermitType>,
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
    private dataSource: DataSource,
    private readonly dopsService: DopsService,
    private companyService: CompanyService,
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => ApplicationService))
    private readonly applicationService: ApplicationService,
  ) {}

  async create(createPermitDto: CreatePermitDto): Promise<ReadPermitDto> {
    const permitEntity = await this.classMapper.mapAsync(
      createPermitDto,
      CreatePermitDto,
      Permit,
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

  private async findOneWithTransactions(permitId: string): Promise<Permit> {
    return this.permitRepository.findOne({
      where: { permitId: permitId },
      relations: {
        transactions: true,
      },
    });
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

  async findReceipt(permit: Permit): Promise<Receipt> {
    if (!permit.transactions || permit.transactions.length === 0) {
      throw new Error('No transactions associated with this permit');
    }

    // Find the latest transaction for the permit, but not necessarily an approved transaction
    let latestTransaction = permit.transactions[0];
    let latestSubmitDate = latestTransaction.transactionSubmitDate;
    permit.transactions.forEach((transaction) => {
      if (
        new Date(transaction.transactionSubmitDate) >=
        new Date(latestSubmitDate)
      ) {
        latestSubmitDate = transaction.transactionSubmitDate;
        latestTransaction = transaction;
      }
    });

    const receipt = await this.receiptRepository.findOne({
      where: {
        transactionId: latestTransaction.transactionId,
      },
    });

    if (!receipt) {
      throw new Error(
        "No receipt generated for this permit's latest transaction",
      );
    }
    return receipt;
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
  ): Promise<ReadFileDto> {
    const permit = await this.findOneWithTransactions(permitId);
    const receipt = await this.findReceipt(permit);

    const file: ReadFileDto = null;
    await this.dopsService.download(
      currentUser,
      receipt.receiptDocumentId,
      FileDownloadModes.PROXY,
      res,
      permit.companyId,
    );
    return file;
  }

  public async findPermitHistory(
    originalPermitId: string,
  ): Promise<PermitHistoryDto[]> {
    const permits = await this.permitRepository
      .createQueryBuilder('permit')
      .innerJoinAndSelect('permit.transactions', 'transaction')
      .where('permit.permitNumber IS NOT NULL')
      .andWhere('permit.originalPermitId = :originalPermitId', {
        originalPermitId: originalPermitId,
      })
      .getMany();
    return this.classMapper.mapArrayAsync(permits, Permit, PermitHistoryDto);
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
  ): Promise<ResultDto> {
    const transactionDetails: IReceipt = {
      transactionAmount: voidPermitDto.transactionAmount,
      transactionDate: voidPermitDto.transactionDate,
      transactionOrderNumber: voidPermitDto.transactionOrderNumber,
      paymentMethod: voidPermitDto.paymentMethod,
    };
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
    let success = '';
    let failure = '';

    const companyInfo = await this.companyService.findOne(permit.companyId);

    const fullNames = await this.applicationService.getFullNamesFromCache(
      permit,
    );
    const permitDataForTemplate = formatTemplateData(
      permit,
      fullNames,
      companyInfo,
    );
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let dopsRequestData: DopsGeneratedDocument = {
        templateName: TemplateName.PERMIT_TROS,
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

      //Generate receipt number for the permit to be created in database.
      const receiptNo = await this.applicationService.generateReceiptNumber();
      dopsRequestData = {
        templateName: TemplateName.PAYMENT_RECEIPT,
        generatedDocumentFileName: `Receipt_No_${receiptNo}`,
        templateData: {
          ...permitDataForTemplate,
          ...transactionDetails,
          transactionDate: convertUtcToPt(
            new Date(),
            'MMM. D, YYYY, hh:mm a Z',
          ),
          receiptNo,
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
      permit.permitStatus = ApplicationStatus.SUPERSEDED;
      // to create new permit
      let newPermit = permit;
      newPermit.permitId = null;
      newPermit.permitStatus = voidPermitDto.status;
      newPermit.revision = permit.revision + 1;
      newPermit.previousRevision = +permitId;
      newPermit.documentId = generatedDocuments.at(0).dmsId;

      newPermit.applicationNumber = applicationNumber;
      /* Create application to generate permit id. 
      this permit id will be used to generate permit number based this id's application number.*/
      newPermit = await queryRunner.manager.save(newPermit);

      const receiptEntity: Receipt = new Receipt();
      const transaction =
        await this.applicationService.findOneTransactionByOrderNumber(
          transactionDetails.transactionOrderNumber,
        );
      receiptEntity.transactionId = transaction.transactionId;
      receiptEntity.receiptNumber = receiptNo;
      receiptEntity.receiptDocumentId = generatedDocuments.at(1).dmsId;
      await queryRunner.manager.save(receiptEntity);
      /* const permitNumber = await this.applicationService.generatePermitNumber(
        newPermit.permitId,
      );
      newPermit.permitNumber = permitNumber;*/
      // Save new permit
      await queryRunner.manager
        .createQueryBuilder()
        .update('Permit')
        .set({ permitStatus: voidPermitDto.status })
        .where('permitId = :permitId', { permitId: newPermit.permitId })
        .execute();
      //Update old permit status to SUPERSEDED.
      await queryRunner.manager
        .createQueryBuilder()
        .update('Permit')
        .set({ permitStatus: ApplicationStatus.SUPERSEDED })
        .where('permitId = :permitId', { permitId: permitId })
        .execute();
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
            filename: `Receipt_No_${receiptNo}.pdf`,
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