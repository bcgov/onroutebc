import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';
import { DataSource, IsNull, Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/request/create-application.dto';
import { ReadApplicationDto } from './dto/response/read-application.dto';
import { Permit } from './entities/permit.entity';
import { UpdateApplicationDto } from './dto/request/update-application.dto';
import { ResultDto } from './dto/response/result.dto';
import { PermitApplicationOrigin } from './entities/permit-application-origin.entity';
import { PermitApprovalSource } from './entities/permit-approval-source.entity';
import { IDP } from 'src/common/enum/idp.enum';
import { PermitApplicationOrigin as PermitApplicationOriginEnum } from 'src/common/enum/permit-application-origin.enum';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { PermitApprovalSource as PermitApprovalSourceEnum } from 'src/common/enum/permit-approval-source.enum';
import { callDatabaseSequence } from 'src/common/helper/database.helper';
import { randomInt } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FullNames } from './interface/fullNames.interface';
import { PermitData } from 'src/common/interface/permit.template.interface';
import { getFromCache } from 'src/common/helper/cache.helper';
import { CompanyService } from '../company-user-management/company/company.service';
import { formatTemplateData } from './helpers/formatTemplateData.helper';
import { EmailService } from '../email/email.service';
import { PermitService } from './permit.service';
import { EmailTemplate } from '../../common/enum/email-template.enum';
import { IssuePermitEmailData } from '../../common/interface/issue-permit-email-data.interface';
import { AttachementEmailData } from '../../common/interface/attachment-email-data.interface';
import { CacheKey } from '../../common/enum/cache-key.enum';
import { DopsService } from '../common/dops.service';
import { DopsGeneratedDocument } from '../../common/interface/dops-generated-document.interface';
import { TemplateName } from '../../common/enum/template-name.enum';
import { IReceipt } from 'src/common/interface/receipt.interface';
import { IFile } from '../../common/interface/file.interface';
import { ReadTransactionDto } from '../payment/dto/response/read-transaction.dto';
import { Transaction } from '../payment/entities/transaction.entity';
import { Receipt } from '../payment/entities/receipt.entity';
import { convertUtcToPt } from '../../common/helper/date-time.helper';

@Injectable()
export class ApplicationService {
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
    private companyService: CompanyService,
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => PermitService))
    private readonly permitService: PermitService,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
  ) {}

  /**
   * createApplicationDto.permitID null means new application for new permit
   * if createApplicationDto.permitID is not null then create new application for permit amendment.
   * @param createApplicationDto
   *
   */
  async create(
    createApplicationDto: CreateApplicationDto,
    currentUser: IUserJWT,
  ): Promise<ReadApplicationDto> {
    const id = createApplicationDto.permitId;
    //If permit id exists assign it to null to create new application.
    //Existing permit id also implies that this new application is an amendment.
    if (id) {
      const permit = await this.findOne(id);
      //to check if there is already an appliation in database
      const count = await this.checkApplicationInProgress(
        permit.originalPermitId,
      );
      // If an application already exists throw error.
      //As there should not be multiple amendment applications for one permit
      if (count > 0)
        throw new InternalServerErrorException(
          'An application already exists for this permit.',
        );
      createApplicationDto.revision = permit.revision + 1;
      createApplicationDto.previousRevision = id;
      createApplicationDto.permitId = null;
      createApplicationDto.originalPermitId = permit.originalPermitId;
    }

    createApplicationDto.permitStatus = ApplicationStatus.IN_PROGRESS;
    //Assign Permit Application Origin
    if (currentUser.identity_provider == IDP.IDIR)
      createApplicationDto.permitApplicationOrigin =
        PermitApplicationOriginEnum.PPC;
    else
      createApplicationDto.permitApplicationOrigin =
        PermitApplicationOriginEnum.ONLINE;

    //Generate appliction number for the application to be created in database.
    const applicationNumber = await this.generateApplicationNumber(
      currentUser.identity_provider,
      id,
    );
    createApplicationDto.applicationNumber = applicationNumber;
    const permitApplication = this.classMapper.map(
      createApplicationDto,
      CreateApplicationDto,
      Permit,
    );
    const savedPermitEntity = await this.permitRepository.save(
      permitApplication,
    );
    // In case of new application assign original permit ID
    if (id === undefined || id === null) {
      await this.permitRepository
        .createQueryBuilder()
        .update()
        .set({ originalPermitId: savedPermitEntity.permitId })
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
    );
  }

  private async findOne(permitId: string): Promise<Permit> {
    return await this.permitRepository.findOne({
      where: [{ permitId: permitId }],
      relations: {
        permitData: true,
      },
    });
  }

  /* Get single application By Permit ID*/
  async findApplication(permitId: string): Promise<ReadApplicationDto> {
    const application = await this.findOne(permitId);
    const readPermitApplicationdto = await this.classMapper.mapAsync(
      application,
      Permit,
      ReadApplicationDto,
    );
    return readPermitApplicationdto;
  }

  /* Get all application for a company. 
     Initially written to facilitate get application in progress for IDIR user.*/
  async findAllApplicationCompany(
    companyId: number,
    status: ApplicationStatus,
  ): Promise<ReadApplicationDto[]> {
    const applications = await this.permitRepository.find({
      where: {
        companyId: +companyId,
        permitStatus: status,
        permitNumber: IsNull(),
      },
      relations: {
        permitData: true,
      },
    });

    return this.classMapper.mapArrayAsync(
      applications,
      Permit,
      ReadApplicationDto,
    );
  }

  /*Get all application in progress for a specific user of a specific company.
    Initially written to facilitate get application in progress for company User. */
  async findAllApplicationUser(
    companyId: number,
    userGuid: string,
    status: ApplicationStatus,
  ): Promise<ReadApplicationDto[]> {
    const applications: Permit[] = await this.permitRepository.find({
      where: {
        companyId: +companyId,
        userGuid: userGuid,
        permitStatus: status,
        permitNumber: IsNull(),
      },
      relations: {
        permitData: true,
      },
    });

    return this.classMapper.mapArrayAsync(
      applications,
      Permit,
      ReadApplicationDto,
    );
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
        permitData: true,
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
  async update(
    applicationNumber: string,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<ReadApplicationDto> {
    const existingApplication = await this.findByApplicationNumber(
      applicationNumber,
    );

    const newApplication = this.classMapper.map(
      updateApplicationDto,
      UpdateApplicationDto,
      Permit,
      {
        extraArgs: () => ({
          permitId: existingApplication.permitId,
          permitDataId: existingApplication.permitData.permitDataId,
        }),
      },
    );

    const applicationData: Permit = {
      ...newApplication,
      updatedDateTime: new Date(),
    };
    await this.permitRepository.save(applicationData);
    return this.classMapper.mapAsync(
      await this.findByApplicationNumber(applicationNumber),
      Permit,
      ReadApplicationDto,
    );
  }

  /**
   * Update status of applications
   * @param applicationIds array of applications ids to be updated. ex ['1','2']
   * @param applicationStatus application status to be set to this values. And
   * can be picked from enum ApplicationStatus i.e. allowed status for an application.
   *
   * Assumption has been made that @param applicationIds length > 1 is only applicable for bulk delete.
   * which means move all the applications to Cancelled status. For every other status length will be one.
   **/
  async updateApplicationStatus(
    applicationIds: string[],
    applicationStatus: ApplicationStatus,
    currentUser: IUserJWT,
  ): Promise<ResultDto> {
    let permitApprovalSource: PermitApprovalSourceEnum = null;
    if (applicationIds.length === 1) {
      if (applicationStatus === ApplicationStatus.ISSUED)
        throw new ForbiddenException(
          'Status Change to ISSUE permit is prohibited on this endpoint.',
        );
      else if (
        applicationStatus === ApplicationStatus.APPROVED ||
        applicationStatus === ApplicationStatus.AUTO_APPROVED
      ) {
        if (currentUser.identity_provider == IDP.IDIR)
          permitApprovalSource = PermitApprovalSourceEnum.PPC;
        else if (currentUser.identity_provider == IDP.BCEID)
          permitApprovalSource = PermitApprovalSourceEnum.AUTO;
      }
    } else if (
      applicationIds.length > 1 &&
      applicationStatus != ApplicationStatus.CANCELLED
    ) {
      throw new ForbiddenException(
        'Bulk status update is only allowed for Cancellation.',
      );
    }
    const updateResult = await this.permitRepository
      .createQueryBuilder()
      .update()
      .set({
        permitStatus: applicationStatus,
        ...(permitApprovalSource && {
          permitApprovalSource: permitApprovalSource,
        }),
      })
      .whereInIds(applicationIds)
      .returning(['permitId'])
      .execute();

    const updatedApplications = Array.from(
      updateResult?.raw as [
        {
          ID: string;
        },
      ],
    );
    const success = updatedApplications?.map((permit) => permit.ID);
    const failure = applicationIds?.filter((id) => !success?.includes(id));

    const resultDto: ResultDto = {
      success: success,
      failure: failure,
    };
    return resultDto;
  }

  /**
   * This function is responsible for issuing a permit based on a given application.
   * It performs various operations, including generating a permit number, calling the PDF generation service, and updating the permit record in the database.
   * @param currentUser // TODO: protect endpoint
   * @param applicationId applicationId to identify the application to be issued. It is the same as permitId.
   * @returns a resultDto that describes if the transaction was successful or if it failed
   */
  async issuePermit(
    currentUser: IUserJWT,
    applicationId: string,
    transactionDetails?: IReceipt,
  ) {
    let success = '';
    let failure = '';
    const tempPermit = await this.findOne(applicationId);
    // Check if a PDF document already exists for the permit.
    // It's important that a PDF does not get overwritten.
    // Once its created, it is a permanent legal document.
    if (
      tempPermit.documentId ||
      tempPermit.permitStatus === ApplicationStatus.ISSUED
    ) {
      throw new HttpException('Document already exists', 409);
    }

    const permitNumber = await this.generatePermitNumber(applicationId);
    tempPermit.permitNumber = permitNumber;
    tempPermit.permitStatus = ApplicationStatus.ISSUED;

    const companyInfo = await this.companyService.findOne(tempPermit.companyId);

    const fullNames = await this.getFullNamesFromCache(tempPermit);

    // Provide the permit json data required to populate the .docx template that is used to generate a PDF
    const permitDataForTemplate = formatTemplateData(
      tempPermit,
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
      const generatedPermitDocumentPromise = this.generateDocument(
        currentUser,
        dopsRequestData,
        companyInfo.companyId,
      );

      //Generate receipt number for the permit to be created in database.
      const receiptNo = await this.generateReceiptNumber();
      dopsRequestData = {
        templateName: TemplateName.PAYMENT_RECEIPT,
        generatedDocumentFileName: `Receipt_No_${receiptNo}`,
        templateData: {
          ...permitDataForTemplate,
          ...transactionDetails,
          transactionDate: convertUtcToPt(
            transactionDetails.transactionDate,
            'MMM. D, YYYY, hh:mm a Z',
          ),
          receiptNo,
        },
      };

      const generatedReceiptDocumentPromise = this.generateDocument(
        currentUser,
        dopsRequestData,
        companyInfo.companyId,
      );

      const generatedDocuments: IFile[] = await Promise.all([
        generatedPermitDocumentPromise,
        generatedReceiptDocumentPromise,
      ]);

      const permitEntity = await this.permitRepository.findOne({
        where: [{ applicationNumber: tempPermit.applicationNumber }],
        relations: {
          permitData: true,
        },
      });
      permitEntity.permitStatus = ApplicationStatus.ISSUED;
      permitEntity.permitNumber = permitNumber;
      permitEntity.documentId = generatedDocuments.at(0).dmsId;
      await queryRunner.manager.save(permitEntity);
      const receiptEntity: Receipt = new Receipt();
      const transaction = await this.findOneTransactionByOrderNumber(
        transactionDetails.transactionOrderNumber,
      );
      receiptEntity.transactionId = transaction.transactionId;
      receiptEntity.receiptNumber = receiptNo;
      receiptEntity.receiptDocumentId = generatedDocuments.at(1).dmsId;
      await queryRunner.manager.save(receiptEntity);
      // In case of amendment move the parent permit to SUPERSEDED Status.
      if (
        tempPermit.previousRevision != null ||
        tempPermit.previousRevision != undefined
      ) {
        const parentPermit = await this.findOne(
          String(tempPermit.previousRevision),
        );
        parentPermit.permitStatus = ApplicationStatus.SUPERSEDED;
        await queryRunner.manager.save(parentPermit);
      }
      await queryRunner.commitTransaction();
      success = applicationId;
      try {
        const emailData: IssuePermitEmailData = {
          companyName: companyInfo.legalName,
        };

        const attachments: AttachementEmailData[] = [
          {
            filename: tempPermit.permitNumber + '.pdf',
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

  async generateDocument(
    currentUser: IUserJWT,
    dopsRequestData: DopsGeneratedDocument,
    companyId?: number,
  ) {
    return await this.dopsService.generateDocument(
      currentUser,
      dopsRequestData,
      undefined,
      companyId,
    );
  }

  /**
   * Converts code names to full names by calling the cache manager.
   * Example: 'TROS' to 'Oversize: Term'
   * @param permit
   * @returns a json object of the full names
   */
  async getFullNamesFromCache(permit: Permit): Promise<FullNames> {
    const permitData = JSON.parse(permit.permitData.permitData) as PermitData;

    const vehicleTypeName = await getFromCache(
      this.cacheManager,
      CacheKey.VEHICLE_TYPE,
      permitData.vehicleDetails.vehicleType,
    );

    const vehicleSubTypeName = await getFromCache(
      this.cacheManager,
      vehicleTypeName === 'Trailer'
        ? CacheKey.TRAILER_TYPE
        : CacheKey.POWER_UNIT_TYPE,
      permitData.vehicleDetails.vehicleSubType,
    );

    const mailingCountryName = await getFromCache(
      this.cacheManager,
      CacheKey.COUNTRY,
      permitData.vehicleDetails.countryCode,
    );
    const mailingProvinceName = await getFromCache(
      this.cacheManager,
      CacheKey.PROVINCE,
      permitData.vehicleDetails.provinceCode,
    );

    const vehicleCountryName = await getFromCache(
      this.cacheManager,
      CacheKey.COUNTRY,
      permitData.mailingAddress.countryCode,
    );
    const vehicleProvinceName = await getFromCache(
      this.cacheManager,
      CacheKey.PROVINCE,
      permitData.mailingAddress.provinceCode,
    );

    const permitName = await getFromCache(
      this.cacheManager,
      CacheKey.PERMIT_TYPE,
      permit.permitType,
    );

    return {
      vehicleTypeName,
      vehicleSubTypeName,
      mailingCountryName,
      mailingProvinceName,
      vehicleCountryName,
      vehicleProvinceName,
      permitName,
    };
  }

  /**
   * Generate Application Number
   * @param applicationSource to get the source code
   * @param permitId if permit id is present then it is a permit amendment
   * and application number will be generated from exisitng permit number.
   */
  async generateApplicationNumber(
    permitApplicationOrigin: string,
    permitId: string,
  ): Promise<string> {
    let seq: string;
    let source;
    let rnd;
    let rev = '-R00';
    let permit: Permit;
    if (permitId) {
      //Amendment to existing permit.//Get revision Id from database.
      permit = await this.findOne(permitId);
      //Format revision id
      rev = '-R' + String(permit.revision + 1).padStart(2, '0');
      if (permit.permitNumber) {
        seq = permit.permitNumber.substring(3, 11);
        rnd = permit.permitNumber.substring(12, 15);
      } else {
        throw new InternalServerErrorException('Permit number does not exist');
      }
      source = await this.getPermitApplicationOrigin(
        permit.permitApplicationOrigin,
      );
    } else {
      //New permit application.
      seq = await callDatabaseSequence(
        'permit.ORBC_PERMIT_NUMBER_SEQ',
        this.dataSource,
      );
      source = await this.getPermitApplicationOrigin(
        permitApplicationOrigin == IDP.IDIR
          ? PermitApplicationOriginEnum.PPC
          : PermitApplicationOriginEnum.ONLINE,
      );
      rnd = randomInt(100, 1000);
    }

    const applicationNumber = String(
      'A' +
        String(source) +
        '-' +
        String(seq.padStart(8, '0')) +
        '-' +
        String(rnd) +
        String(rev),
    );

    return applicationNumber;
  }

  /**
   * Get Application Origin Code from database lookup table ORBC_VT_PERMIT_APPLICATION_ORIGIN
   * @param permitApplicationOrigin
   *
   */
  private async getPermitApplicationOrigin(
    permitApplicationOrigin: PermitApplicationOriginEnum,
  ): Promise<string> {
    const applicationOrigin =
      await this.permitApplicationOriginRepository.findOne({
        where: [{ id: permitApplicationOrigin }],
      });

    return String(applicationOrigin.code);
  }

  /**
   * Generate permit number for a permit application.
   * @param permitId
   * @returns permitNumber
   */
  async generatePermitNumber(permitId: string): Promise<string> {
    const permit = await this.findOne(permitId);
    let approvalSourceId: number;
    let rnd;
    let seq: string;
    const approvalSource = await this.permitApprovalSourceRepository.find({
      where: { id: permit.permitApprovalSource },
    });
    if (!approvalSourceId) {
      approvalSourceId = 9;
    } else {
      approvalSourceId = approvalSource[0].code;
    }
    if (permit.revision == 0) {
      seq = await callDatabaseSequence(
        'permit.ORBC_PERMIT_NUMBER_SEQ',
        this.dataSource,
      );
      seq = seq.padStart(8, '0');
      const { randomInt } = await import('crypto');
      rnd = randomInt(100, 1000);
    } else {
      seq = permit.applicationNumber.substring(3, 15);
      rnd = 'A' + String(permit.revision).padStart(2, '0');
    }
    const permitNumber =
      'P' + String(approvalSourceId) + '-' + String(seq) + '-' + String(rnd);
    return permitNumber;
  }

  async findOneTransactionByOrderNumber(
    transactionOrderNumber: string,
  ): Promise<ReadTransactionDto> {
    return this.classMapper.mapAsync(
      await this.transactionRepository.findOne({
        where: {
          transactionOrderNumber: transactionOrderNumber,
        },
      }),
      Transaction,
      ReadTransactionDto,
    );
  }

  /**
   * Generate Receipt Number
   */
  async generateReceiptNumber(): Promise<string> {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    const source = dateString;
    const seq = await callDatabaseSequence(
      'permit.ORBC_RECEIPT_NUMBER_SEQ',
      this.dataSource,
    );
    const receiptNumber = String(String(source) + '-' + String(seq));

    return receiptNumber;
  }

  async checkApplicationInProgress(originalPermitId: string): Promise<number> {
    const count = await this.permitRepository
      .createQueryBuilder('permit')
      .where('permit.originalPermitId = :originalPermitId', {
        originalPermitId: originalPermitId,
      })
      .andWhere('permit.permitStatus IN (:...applicationStatus)', {
        applicationStatus: Object.values(ApplicationStatus).filter(
          (x) =>
            x != ApplicationStatus.CANCELLED &&
            x != ApplicationStatus.REJECTED &&
            x != ApplicationStatus.ISSUED &&
            x != ApplicationStatus.REVOKED &&
            x != ApplicationStatus.VOIDED,
        ),
      })
      .getCount();
    return count;
  }
}
