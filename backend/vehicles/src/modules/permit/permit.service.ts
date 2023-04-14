import { Injectable } from '@nestjs/common';
import { CreatePermitDto } from './dto/request/create-permit.dto';
import { Permit } from './entities/permit.entity';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadPermitDto } from './dto/response/read-permit.dto';
import { PermitMetadata } from './entities/permit-metadata.entity';
import { ReadPermitMetadataDto } from './dto/response/read-permit-metadata.dto';

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

    const refreshedPermitEntity = await this.findOne(savedPermitEntity.permitId);
    
    const readPermitDto = await this.classMapper.mapAsync(
      refreshedPermitEntity,
      Permit,
      ReadPermitDto,
    );
   
    const readPermitMetadataDto = await this.classMapper.mapAsync(
      refreshedPermitEntity.permitMetadata,
      PermitMetadata,
      ReadPermitMetadataDto,
    );

    Object.assign(readPermitDto,readPermitMetadataDto);

    return readPermitDto;
  }

  findAll() {
    return `This action returns all permit`;
  }

  private async findOne(permitId: string): Promise<Permit> {
    return await this.permitRepository.findOne({
      where: { permitId: permitId },
      relations: {
        permitMetadata: true,
      },
    });
  }

  update(id: number, updatePermitDto: CreatePermitDto) {
    return `This action updates a #${id} permit`;
  }

  remove(id: number) {
    return `This action removes a #${id} permit`;
  }
}
