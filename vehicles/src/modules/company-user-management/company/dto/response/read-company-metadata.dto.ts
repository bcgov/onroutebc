import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'src/modules/common/entities/address.entity';
import { Contact } from 'src/modules/common/entities/contact.entity';

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
    description: 'The company mailing address.',
    example: '123 Test Dr, Victoria, BC, Canada',
  })
  mailingAddress?: Address;

  @AutoMap()
  @ApiProperty({
    description: 'The primary contact of the company.',
    example: 'Miltie',
  })
  primaryContact?: Contact;


}
