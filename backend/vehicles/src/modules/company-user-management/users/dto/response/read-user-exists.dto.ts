import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadCompanyDto } from '../../../company/dto/response/read-company.dto';
import { ReadUserDto } from './read-user.dto';

/**
 * JSON representation of response object when retrieving user information and
 * associated company details from the server after login.
 */
export class ReadUserExistsDto {
  @AutoMap()
  @ApiProperty({
    description:
      'A boolean value which is set to true if the user has been added to a company in ORBC by the company Admin.',
    example: 'true',
  })
  isPendingUser: boolean;

  @AutoMap()
  @ApiProperty({
    description:
      'A boolean value which is set to true if the user exists in ORBC.',
    example: 'true',
  })
  userExists: boolean;

  @AutoMap()
  @ApiProperty({
    description: 'The user details.',
  })
  user: ReadUserDto;

  @AutoMap()
  @ApiProperty({
    description:
      'A boolean value which is set to true if the company exists in ORBC.',
    example: 'true',
  })
  companyExists: boolean;

  @AutoMap()
  @ApiProperty({
    description: 'The companies associated with the user.',
    type: [ReadCompanyDto],
  })
  company: ReadCompanyDto[];
}
