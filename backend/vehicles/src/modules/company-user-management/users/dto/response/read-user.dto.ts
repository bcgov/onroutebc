import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadContactDto } from '../../../../common/dto/response/read-contact.dto';

/**
 * JSON representation for response object to create a user.
 */
export class ReadUserDto extends ReadContactDto {
  @AutoMap()
  @ApiProperty({
    description: 'The user GUID.',
    example: '6F9619FF8B86D011B42D00C04FC964FF',
  })
  userGUID: string;

  @AutoMap()
  @ApiProperty({
    description: 'The user name grabbed from BCeID.',
    example: 'John Smith',
  })
  userName: string;

  @AutoMap()
  @ApiProperty({
    description: 'The user auth group.',
    example: 'ADMIN',
  })
  userAuthGroup: string;

  @AutoMap()
  @ApiProperty({
    description: 'The status of the user.',
    example: 'ACTIVE',
  })
  statusCode: string;
}
