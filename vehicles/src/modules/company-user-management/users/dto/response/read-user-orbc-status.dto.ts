import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadCompanyMetadataDto } from '../../../company/dto/response/read-company-metadata.dto';
import { ReadUserDto } from './read-user.dto';
import { ReadCompanyDto } from '../../../company/dto/response/read-company.dto';

/**
 * JSON representation of response object when retrieving user information and
 * associated company details from the server after login.
 */
export class ReadUserOrbcStatusDto {
  @AutoMap()
  @ApiProperty({
    description: 'The user details.',
  })
  user: ReadUserDto;

  @AutoMap()
  @ApiProperty({
    description: 'The metadata of companies associated with the user.',
    type: [ReadCompanyMetadataDto],
  })
  associatedCompanies: ReadCompanyMetadataDto[];

  @AutoMap()
  @ApiProperty({
    description:
      'The metadata of companies where the user has been added and pending registration.',
    type: [ReadCompanyMetadataDto],
  })
  pendingCompanies: ReadCompanyMetadataDto[];

  @AutoMap()
  @ApiProperty({
    description: 'The metadata of migrated client associated with the user.',
    type: ReadCompanyDto,
  })
  migratedClient: ReadCompanyDto;
}
