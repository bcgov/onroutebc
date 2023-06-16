import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';
import { DataSource, IsNull, Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/request/create-application.dto';
import { ReadApplicationDto } from './dto/response/read-application.dto';
import { Permit } from './entities/permit.entity';
import { UpdateApplicationDto } from './dto/request/update-application.dto';
import { ResultDto } from './dto/response/result.dto';
import { PdfService } from '../pdf/pdf.service';
import { PermitApplicationOrigin } from './entities/permit-application-origin.entity';
import { PermitApprovalSource } from './entities/permit-approval-source.entity';
import { IDP } from 'src/common/enum/idp.enum';
import { PdfReturnType } from 'src/common/enum/pdf.enum';
import { PermitApplicationOrigin as PermitApplicationOriginEnum } from 'src/common/enum/permit-application-origin.enum';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { PermitApprovalSource as PermitApprovalSourceEnum } from 'src/common/enum/permit-approval-source.enum';
import { callDatabaseSequence } from 'src/common/helper/database.helper';
import { randomInt } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FullNames } from './interface/fullNames.interface';
import { PermitData } from 'src/common/interface/permit.template.interface';
import { getFullNameFromCache } from 'src/common/helper/cache.helper';
import { CompanyService } from '../company-user-management/company/company.service';
import { formatTemplateData } from './helpers/formatTemplateData.helper';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
    private dataSource: DataSource,
    private readonly pdfService: PdfService,
    @InjectRepository(PermitApplicationOrigin)
    private permitApplicationOriginRepository: Repository<PermitApplicationOrigin>,
    @InjectRepository(PermitApprovalSource)
    private permitApprovalSourceRepository: Repository<PermitApprovalSource>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private companyService: CompanyService,
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
      createApplicationDto.permitId,
    );
    createApplicationDto.applicationNumber = applicationNumber;
    //If permit id exists assign it to null to create new application.
    if (createApplicationDto.permitId) {
      const permit = await this.findOne(createApplicationDto.permitId);
      createApplicationDto.revision = permit.revision + 1;
      createApplicationDto.previousRevision = createApplicationDto.permitId;
      createApplicationDto.permitId = null;
    }

    const permitApplication = this.classMapper.map(
      createApplicationDto,
      CreateApplicationDto,
      Permit,
    );
    const applicationData: Permit = {
      ...permitApplication,
      createdDateTime: new Date(),
      updatedDateTime: new Date(),
    };
    const savedPermitEntity = await this.permitRepository.save(applicationData);
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
        return await this.issuePermit(currentUser, applicationIds[0]);
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
        'Bulk status update is only allowed for Cancellation',
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
      .andWhere('permitNumber is null')
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
   * It commits the transaction if successful, or rolls back the transaction and logs an error if an exception occurs during permit or pdf generation.
   * @param currentUser // TODO: protect endpoint
   * @param applicationId applicationId to identify the application to be issued. It is the same as permitId.
   * @returns a resultDto that describes if the transaction was successful or if it failed
   */
  private async issuePermit(currentUser: IUserJWT, applicationId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let success = '';
    let failure = '';

    const tempPermit = await this.findOne(applicationId);

    // Check if a PDF document already exists for the permit.
    // It's important that a PDF does not get overwritten.
    // Once its created, it is a permanent legal document.
    if (tempPermit.documentId || tempPermit.permitStatus === ApplicationStatus.ISSUED) {
      throw new HttpException('Document already exists', 409);
    }

    try {
      const permitNumber = await this.generatePermitNumber(applicationId);
      tempPermit.permitNumber = permitNumber;
      tempPermit.permitStatus = ApplicationStatus.ISSUED;

      const dmsDocumentId = await this.generatePDF(
        currentUser.access_token,
        tempPermit,
      );

      // Update Permit record with an ISSUED status, new permit number, and new DMS Document ID
      await queryRunner.manager
        .getRepository(Permit)
        .createQueryBuilder()
        .update(Permit)
        .set({
          permitStatus: ApplicationStatus.ISSUED,
          ...(permitNumber && { permitNumber: permitNumber }),
          ...{ documentId: dmsDocumentId },
        })
        .where('ID = :applicationId', { applicationId })
        .andWhere('permitNumber IS NULL')
        .execute();

      success = applicationId;
      failure = '';

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('Error Issuing Application: ', err);
      success = '';
      failure = applicationId;
      await queryRunner.rollbackTransaction();
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
   * Generates a PDF of an issued permit.
   * First, format the permit data so that it complies with the .docx template, then generate the PDF
   * @param accessToken the access token for authorization.
   * @param permit the permit entity
   */
  async generatePDF(accessToken: string, permit: Permit) {

    // Provide the permit json data required to populate the .docx template that is used to generate a PDF
    const fullNames = await this.getFullNamesFromCache(permit);
    const companyInfo = await this.companyService.findOne(permit.companyId);
    const permitDataForTemplate = formatTemplateData(
      permit,
      fullNames,
      companyInfo,
    );

    // DMS Reference ID for the generated PDF of the Permit
    // TODO: write helper to determine 'latest' template version
    const dmsDocumentId: string = await this.pdfService.generatePDF(
      accessToken,
      permitDataForTemplate,
      1,
      PdfReturnType.DMS_DOC_ID,
    );

    return dmsDocumentId;
  }

  /**
   * Converts code names to full names by calling the cache manager.
   * Example: 'TROS' to 'Oversize: Term'
   * @param permit
   * @returns a json object of the full names
   */
  private async getFullNamesFromCache(permit: Permit): Promise<FullNames> {
    const permitData = JSON.parse(permit.permitData.permitData) as PermitData;

    const vehicleTypeName = (await getFullNameFromCache(
      this.cacheManager,
      permitData.vehicleDetails.vehicleType,
    )) as string;
    const vehicleSubTypeName = (await getFullNameFromCache(
      this.cacheManager,
      permitData.vehicleDetails.vehicleSubType,
    )) as string;

    const mailingCountryName = (await getFullNameFromCache(
      this.cacheManager,
      permitData.vehicleDetails.countryCode,
    )) as string;
    const mailingProvinceName = (await getFullNameFromCache(
      this.cacheManager,
      permitData.vehicleDetails.provinceCode,
    )) as string;

    const vehicleCountryName = (await getFullNameFromCache(
      this.cacheManager,
      permitData.mailingAddress.countryCode,
    )) as string;
    const vehicleProvinceName = (await getFullNameFromCache(
      this.cacheManager,
      permitData.mailingAddress.provinceCode,
    )) as string;

    const permitName = (await getFullNameFromCache(
      this.cacheManager,
      permit.permitType,
    )) as string;

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
        seq = await callDatabaseSequence(
          'permit.ORBC_PERMIT_NUMBER_SEQ',
          this.dataSource,
        );
        rnd = randomInt(100, 1000);
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
}
