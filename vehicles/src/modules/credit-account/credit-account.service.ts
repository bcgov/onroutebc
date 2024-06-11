import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditAccount } from './entities/credit-account.entity';
import { Repository } from 'typeorm';
import { CreditAccountStatusType } from '../../common/enum/credit-account-status-type.enum';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { BadRequestExceptionDto } from '../../common/exception/badRequestException.dto';

@Injectable()
export class CreditAccountService {
  private readonly logger = new Logger(CreditAccountService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(CreditAccount)
    private readonly creditAccountRepository: Repository<CreditAccount>,
  ) {}

  public create() {
    return 'created';
  }

  async close(currentUser: IUserJWT, companyId: number) {
    return this.updateCreditAccountStatus(
      { companyId, statusToUpdateTo: CreditAccountStatusType.ACCOUNT_CLOSED },
      currentUser,
    );
  }

  async putOnHold(currentUser: IUserJWT, companyId: number) {
    return this.updateCreditAccountStatus(
      { companyId, statusToUpdateTo: CreditAccountStatusType.ACCOUNT_ON_HOLD },
      currentUser,
    );
  }

  async updateCreditAccountStatus(
    {
      companyId,
      statusToUpdateTo,
    }: { companyId: number; statusToUpdateTo: CreditAccountStatusType },
    currentUser: IUserJWT,
  ) {
    const { affected } = await this.creditAccountRepository
      .createQueryBuilder('creditAccount')
      .update()
      .set({
        creditAccountStatusType: statusToUpdateTo,
        updatedUser: currentUser.userName,
        updatedDateTime: new Date(),
        updatedUserDirectory: currentUser.orbcUserDirectory,
        updatedUserGuid: currentUser.userGUID,
      })
      .where('company.companyId = :companyId', {
        companyId,
      })
      .andWhere('creditAccountStatusType = :creditAccountStatusType', {
        creditAccountStatusType: CreditAccountStatusType.ACCOUNT_ACTIVE,
      })
      .execute();
    if (affected === 1) {
      // const sss = await this.creditAccountRepository
      //   .createQueryBuilder('creditAccount')
      //   .select();
    } else {
      throw new BadRequestExceptionDto();
    }
    return 'put on hold';
  }
}
