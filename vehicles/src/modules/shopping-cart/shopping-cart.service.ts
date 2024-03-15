/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';
import { ApplicationService } from '../permit/application.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Permit as Application } from '../permit/entities/permit.entity';
import { Repository } from 'typeorm';
import { PermitStatus } from '../../common/enum/permit-status.enum';
import { ApplicationStatus } from '../../common/enum/application-status.enum';
import { application } from 'express';
import { ResultDto } from './dto/response/result.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}
  create(createShoppingCartDto: CreateShoppingCartDto) {}

  findAll() {
    return `This action returns all shoppingCart`;
  }

  async remove({
    applicationIds,
    companyId,
  }: UpdateShoppingCartDto): Promise<ResultDto> {
    const { success, failure } = new ResultDto();
    for (const applicationId of applicationIds) {
      try {
        const { affected } = await this.applicationRepository.update(
          { permitId: applicationId, company: { companyId } },
          {
            permitStatus: ApplicationStatus.IN_PROGRESS,
          },
        );
        if (affected === 1) {
          success.push(applicationId);
        } else {
          failure.push(applicationId);
        }
      } catch (e) {
        console.log('error::', e);
        failure.push(applicationId);
      }
    }
    return { success, failure };
  }
}
