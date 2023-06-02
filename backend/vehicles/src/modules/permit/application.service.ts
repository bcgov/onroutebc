import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';
import { DataSource, IsNull, Repository, UpdateResult } from 'typeorm';
import { CreateApplicationDto } from './dto/request/create-application.dto';
import { ReadApplicationDto } from './dto/response/read-application.dto';
import { Permit } from './entities/permit.entity';
import { UpdateApplicationDto } from './dto/request/update-application.dto';
import { ResultDto } from './dto/response/result.dto';
import { PdfService } from '../pdf/pdf.service';
import { DatabaseHelper } from 'src/common/helper/database.helper';
import { PermitApplicationOrigin } from './entities/permit-application-origin.entity';
import { PermitApprovalSource } from './entities/permit-approval-source.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
    private datasource: DataSource,
    private readonly pdfService: PdfService,
    private databaseHelper: DatabaseHelper,
    @InjectRepository(PermitApplicationOrigin)
    private permitApplicationOriginRepository: Repository<PermitApplicationOrigin>,
    @InjectRepository(PermitApprovalSource)
    private permitApprovalSourceRepository: Repository<PermitApprovalSource>,
  ) {}

  /**
   * createApplicationDto.permitID null means new application for new permit
   * if createApplicationDto.permitID is not null then create new application for permit amendment.
   * @param createApplicationDto
   *
   */
  async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<ReadApplicationDto> {
    createApplicationDto.permitStatus = ApplicationStatus.IN_PROGRESS;
    //permitId Null means new application for
    createApplicationDto.previousRevId = createApplicationDto.permitId;

    //Generate appliction number for the application to be created in database.
    const applicationNumber = await this.generateApplicationNumber(
      createApplicationDto.permitApplicationOrigin,
      createApplicationDto.permitId,
    );
    createApplicationDto.applicationNumber = applicationNumber;
    //If permit id exists assign it to null to create new application.
    if (createApplicationDto.permitId) {
      const permit = await this.findOne(createApplicationDto.permitId);
      createApplicationDto.revision = permit.revision + 1;
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
   **/
  async updateApplicationStatus(
    applicationIds: string[],
    applicationStatus: ApplicationStatus,
  ): Promise<ResultDto> {
    let updateResult: UpdateResult;
    if (
      applicationIds.length === 1 &&
      applicationStatus === ApplicationStatus.ISSUED
    ) {
      const permitNumber = await this.generatePermitNumber(applicationIds[0]);
      updateResult = await this.permitRepository
        .createQueryBuilder()
        .update()
        .set({ permitStatus: applicationStatus, permitNumber: permitNumber })
        .whereInIds(applicationIds)
        .andWhere('permitNumber is null')
        .returning(['permitId'])
        .execute();
    } else {
      updateResult = await this.permitRepository
        .createQueryBuilder()
        .update()
        .set({ permitStatus: applicationStatus })
        .whereInIds(applicationIds)
        .andWhere('permitNumber is null')
        .returning(['permitId'])
        .execute();
    }

    const updatedApplications = Array.from(
      updateResult?.raw as [
        {
          ID: string;
        },
      ],
    );
    const success = updatedApplications?.map((permit) => permit.ID);
    const failure = applicationIds?.filter((id) => !success?.includes(id));

    // TODO: When to generate PDF?
    await this.generatePDFs(success);

    const resultDto: ResultDto = {
      success: success,
      failure: failure,
    };
    return resultDto;
  }

  /**
   * Generates PDF's of supplied permit ID's
   * If the status is updated to 'APPROVED' or 'AUTO-APPROVED', then create pdf and store it in DMS
   * @param permitIds array of permit ID's to be converted as PDF's and saved in DMS
   */
  async generatePDFs(permitIds: string[]) {
    for (const id of permitIds) {
      const permit = await this.findOne(id);
      if (
        permit.permitStatus === ApplicationStatus.APPROVED ||
        permit.permitStatus === ApplicationStatus.AUTO_APPROVED
      ) {
        // DMS Reference ID for the generated PDF of the Permit
        const dmsDocumentId: string = await this.pdfService.generatePDF(permit);
        // TODO: handle the DMS reference
        console.log('Completed pdf generation');
        console.log('DMS Document Id: ', dmsDocumentId);
      }
    }
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
        seq = await this.databaseHelper.callDatabaseSequence(
          'permit.ORBC_PERMIT_NUMBER_SEQ',
        );
        const { randomInt } = await import('crypto');
        rnd = randomInt(100, 1000);
      }
      source = await this.getPermitApplicationOrigin(
        permit.permitApplicationOrigin,
      );
    } else {
      //New permit application.
      seq = await this.databaseHelper.callDatabaseSequence(
        'permit.ORBC_PERMIT_NUMBER_SEQ',
      );
      source = await this.getPermitApplicationOrigin(permitApplicationOrigin);
      const { randomInt } = await import('crypto');
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
    permitApplicationOrigin: string,
  ): Promise<number> {
    const code = await this.permitApplicationOriginRepository.findOne({
      where: [{ id: permitApplicationOrigin }],
    });

    return code.code;
  }

  /**
   * Get Application Origin Code from database lookup table ORBC_VT_PERMIT_APPLICATION_ORIGIN
   * @param permitApplicationOrigin
   *
   */
  private async getPermitApprovalSource(
    permitApprovalSource: string,
  ): Promise<number> {
    const code = await this.permitApprovalSourceRepository.findOne({
      where: [{ id: permitApprovalSource }],
    });

    return code.code;
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
    const approvalSource = await this.permitApprovalSourceRepository.findOne({
      where: [{ id: permit.permitApprovalSource }],
    });
    if (!approvalSourceId) {
      approvalSourceId = 9;
    } else {
      approvalSourceId = approvalSource.code;
    }
    if (permit.revision == 0) {
      seq = await this.databaseHelper.callDatabaseSequence(
        'permit.ORBC_PERMIT_NUMBER_SEQ',
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
