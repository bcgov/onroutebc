import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class UserCompanyDto {
  @AutoMap()
  @ApiProperty({
    description: 'The company GUID.',
    example: '6F9619FF8B86D011B42D00C04FC964FF',
  })
  companyGUID: string;

  @AutoMap()
  @ApiProperty({
    description: 'The legal name of the company.',
    example: 'ABC Carriers Inc.',
  })
  legalName: string;
}
