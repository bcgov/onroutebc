import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreditAccountUserType } from '../../../../common/enum/credit-accounts.enum';
import { ReadCompanyMetadataDto } from '../../../company-user-management/company/dto/response/read-company-metadata.dto';

export class ReadCreditAccountUserDto extends ReadCompanyMetadataDto {
  @AutoMap()
  @ApiProperty({
    description: 'The credit account user type.',
    example: CreditAccountUserType.ACCOUNT_OWNER,
  })
  userType: CreditAccountUserType;
}
