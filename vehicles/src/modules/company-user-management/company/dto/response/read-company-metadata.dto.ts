import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Directory } from '../../../../../common/enum/directory.enum';

/**
 * JSON representation of response object when retrieving a company metadata.
 */
export class ReadCompanyMetadataDto {
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
    description: 'The email address of the company.',
    required: true,
    example: 'test@test.gov.bc.ca',
  })
  email: string;

  @AutoMap()
  @ApiProperty({
    description: 'Indicates whether the company is currently suspended.',
    example: false,
  })
  isSuspended: boolean;

  @AutoMap()
  @ApiProperty({
    description: `A property that represents the company's directory`,
    example: Directory.BBCEID,
  })
  directory: Directory;
}
