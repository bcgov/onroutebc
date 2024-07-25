import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreditAccountUserType } from '../../../../common/enum/credit-accounts.enum';

export class ReadCreditAccountUserDto {
  @AutoMap()
  @ApiProperty({
    description: 'The company ID.',
    example: 1,
  })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    description: 'The ORBC client number.',
    example: '1234',
  })
  clientNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'The legal name of the company.',
    example: 'ABC Carriers Inc.',
  })
  legalName: string;

  @AutoMap()
  @ApiProperty({
    description: 'The Alternate name of the company/Doing Business As (DBA).',
    example: 'ABC Carriers Inc.',
  })
  alternateName?: string;

  @AutoMap()
  @ApiProperty({
    description: 'The credit account user type.',
    example: CreditAccountUserType.ACCOUNT_HOLDER,
  })
  userType: CreditAccountUserType;
}
