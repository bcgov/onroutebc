import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreditAccountUserDto } from './credit-account-user.dto';
import { CreditAccountStatusType } from '../../../../common/enum/credit-account-status-type.enum';

export class ReadCreditAccountDto {
  @AutoMap()
  @ApiProperty({
    description: 'Id of the company.',
    example: 74,
  })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    description: 'The credit account id.',
    example: 74,
  })
  creditAccountId: number;

  @AutoMap()
  @ApiProperty({
    description: 'The credit limit of the account.',
    example: 74,
  })
  creditLimit: number;

  @AutoMap()
  @ApiProperty({
    description: 'The credit balance of the account.',
    example: 74,
  })
  creditBalance: number;

  @AutoMap()
  @ApiProperty({
    description: 'The available credit of the account.',
    example: 74,
  })
  availableCredit: number;

  @AutoMap()
  @ApiProperty({
    description: 'The credit account number.',
    example: 74,
  })
  creditAccountNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'The collection of companies using this credit account.',
    example: 74,
  })
  creditAccountUsers: CreditAccountUserDto[];

  @AutoMap()
  @ApiProperty({
    description: 'The status of the credit account.',
    example: 74,
  })
  creditAccountStatus: CreditAccountStatusType;
}
