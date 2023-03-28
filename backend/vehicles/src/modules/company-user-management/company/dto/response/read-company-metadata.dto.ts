import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

/**
 * JSON representation of response object when retrieving a company metadata.
 */
export class ReadCompanyMetadataDto {
  @AutoMap()
  @ApiProperty({
    description: 'The company ID.',
    example: '1',
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
}
