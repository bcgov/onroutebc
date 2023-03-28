import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadUserDto } from 'src/modules/company-user-management/users/dto/response/read-user.dto';
import { ReadCompanyDto } from './read-company.dto';

export class ReadUsercompanyDetailsDto {
  @AutoMap()
  @ApiProperty({
    description: 'The user',
    required: true,
  })
  user: ReadUserDto;
  @AutoMap()
  @ApiProperty({
    description: 'The companies of the user.',
    required: true,
  })
  company: ReadCompanyDto[];
}
