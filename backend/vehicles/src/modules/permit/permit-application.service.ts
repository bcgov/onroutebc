import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermitStatus } from 'src/common/enum/permit-status.enum';
import { Repository } from 'typeorm';
import { CreatePermitApplicationDto } from './dto/request/create-permit-application.dto';
import { ReadPermitApplicationDto } from './dto/response/read-permit-application.dto';
import { Permit } from './entities/permit.entity';

@Injectable()
export class PermitApplicationService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
  ) {}

  async create(
    createPermitApplicationDto: CreatePermitApplicationDto,
    userGuid: string,
    company_id: string,
  ): Promise<ReadPermitApplicationDto> {
    createPermitApplicationDto.userGuid = userGuid;
    createPermitApplicationDto.companyId = company_id;
    createPermitApplicationDto.permitStatus = PermitStatus.IN_PROGRESS;
    const permitApplication = this.classMapper.map(
      createPermitApplicationDto,
      CreatePermitApplicationDto,
      Permit,
    );
    const savedPermitEntity = await this.permitRepository.save(
      permitApplication,
    );
    const refreshedPermitEntity = await this.findOne(
      savedPermitEntity.permitId,
    );
    return await this.classMapper.mapAsync(
      refreshedPermitEntity,
      Permit,
      ReadPermitApplicationDto,
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

  async findApplication(permitId: string): Promise<ReadPermitApplicationDto> {
    const application = await this.findOne(permitId);
    const readPermitApplicationdto = await this.classMapper.mapAsync(
      application,
      Permit,
      ReadPermitApplicationDto,
    );
    return readPermitApplicationdto;
  }

  ///get all application for a company. Initially written to facilitate get application in progress for IDIR user.
  async findAllApplicationCompany(
    companyId: string,
  ): Promise<ReadPermitApplicationDto[]> {
    const applications = await this.permitRepository.find({
      where: { companyId: +companyId, permitStatus: PermitStatus.IN_PROGRESS },
    });

    return this.classMapper.mapArrayAsync(
      applications,
      Permit,
      ReadPermitApplicationDto,
    );
  }
  //get all application in progress for a specific user of a specific company. Initially written to facilitate get application in progress for company User.
  async findAllApplicationUser(
    companyId: string,
    userGuid: string,
  ): Promise<ReadPermitApplicationDto[]> {
    const applications: Permit[] = await this.permitRepository.find({
      where: {
        companyId: +companyId,
        userGuid: userGuid,
        permitStatus: PermitStatus.IN_PROGRESS,
      },
    });

    return this.classMapper.mapArrayAsync(
      applications,
      Permit,
      ReadPermitApplicationDto,
    );
  }
}
