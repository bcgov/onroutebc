import { Injectable, StreamableFile } from '@nestjs/common';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermitDto } from './dto/request/create-permit.dto';
import { ReadPermitDto } from './dto/response/read-permit.dto';
import { Permit } from './entities/permit.entity';
import { PermitType } from './entities/permit-type.entity';
import { PdfService } from '../pdf/pdf.service';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { DmsResponse } from 'src/common/interface/dms.interface';
import { DownloadMode } from 'src/common/enum/pdf-return-type.enum';

@Injectable()
export class PermitService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
    @InjectRepository(PermitType)
    private permitTypeRepository: Repository<PermitType>,
    private readonly pdfService: PdfService,
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
    return await this.permitRepository.findOne({
      where: { permitId: permitId },
      relations: {
        permitData: true,
      },
    });
  }

  public async findAllPermitTypes(): Promise<PermitType[]> {
    return await this.permitTypeRepository.find({});
  }

  public async findPDFbyPermitId(access_token: string, permitId: string, downloadMode?: DownloadMode): Promise<DmsResponse> {
    const permit = await this.findOne(permitId);
    const response = await this.pdfService.findPDFbyDocumentId(access_token, permit.documentId, downloadMode);
    response.fileName = permit.applicationNumber; // TODO: change to permit number
    return response;
  }
}
