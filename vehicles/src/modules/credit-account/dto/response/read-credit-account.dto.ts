import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreditAccountUserDto } from './credit-account-user.dto';

export class ReadCreditAccountDto {
  @AutoMap()
  @ApiProperty({
    description: 'Id of the company requesting the permit.',
    example: 74,
  })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the company requesting the permit.',
    example: 74,
  })
  creditLimit: number;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the company requesting the permit.',
    example: 74,
  })
  creditBalance: number;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the company requesting the permit.',
    example: 74,
  })
  availableCredit: number;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the application.',
    example: 74,
  })
  creditAccountNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the application.',
    example: 74,
  })
  creditAccountUsers: CreditAccountUserDto[];
}
