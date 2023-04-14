import { Injectable } from '@nestjs/common';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermitDto } from './dto/request/create-permit.dto';
import { ReadPermitDto } from './dto/response/read-permit.dto';
import { Permit } from './entities/permit.entity';

@Injectable()
export class PermitService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
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
}
