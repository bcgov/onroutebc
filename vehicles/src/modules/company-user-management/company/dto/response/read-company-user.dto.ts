import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadUserDto } from '../../../users/dto/response/read-user.dto';
import { ReadCompanyDto } from './read-company.dto';

/**
 * JSON representation of response object when retrieving a company and its
 * associated admin user from the server.
 */
export class ReadCompanyUserDto extends ReadCompanyDto {
  @AutoMap()
  @ApiProperty({
    description: 'The admin user of the company.',
    required: true,
  })
  adminUser: ReadUserDto;
}
