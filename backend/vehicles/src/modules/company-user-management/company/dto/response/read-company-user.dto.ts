import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadUserDto } from '../../../users/dto/response/read-user.dto';
import { ReadCompanyDto } from './read-company.dto';

/**
 * JSON representation of company user response object.
 */
export class ReadCompanyUserDto extends ReadCompanyDto {
  @AutoMap()
  @ApiProperty({
    description: 'The admin user of the company.',
    required: true,
  })
  adminUser: ReadUserDto;
}
