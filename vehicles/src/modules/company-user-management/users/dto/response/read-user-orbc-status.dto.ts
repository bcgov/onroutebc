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
    description:
      'The metadata of companies associated with the user. ' +
      'Associated companies indicate a company that is already claimed and active',
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
    description: 'The metadata of unclaimed client associated with the user.',
    type: ReadCompanyDto,
  })
  unclaimedClient: ReadCompanyDto;
}
