import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CreditAccountLimit, CreditAccountLimitType } from '../../../../common/enum/credit-account-limit.enum';

export class CreateCreditAccountDto {
  @AutoMap()
  @ApiProperty({
    description: 'The credit limit',
    type: String,
    example: '10000',
    enum: CreditAccountLimit,
  })
  @IsEnum(CreditAccountLimit)
  creditLimit: CreditAccountLimitType;
}
