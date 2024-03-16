/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationStatus } from '../../common/enum/application-status.enum';
import { Permit as Application } from '../permit-application-payment/permit/entities/permit.entity';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { ResultDto } from './dto/response/result.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';

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
