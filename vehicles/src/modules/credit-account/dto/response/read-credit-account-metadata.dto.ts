import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadCompanyMetadataDto } from '../../../company-user-management/company/dto/response/read-company-metadata.dto';

export class ReadCreditAccountMetadataDto extends ReadCompanyMetadataDto {
  @AutoMap()
  @ApiProperty({
    description: 'The credit account number.',
    example: 'WS5667',
  })
  creditAccountNumber: string;
}
