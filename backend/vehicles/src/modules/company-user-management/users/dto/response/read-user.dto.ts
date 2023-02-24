import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserAuthGroup } from '../../../../../common/enum/user-auth-group.enum';
import { UserStatus } from '../../../../../common/enum/user-status.enum';
import { ReadContactDto } from '../../../../common/dto/response/read-contact.dto';

/**
 * JSON representation of response object when retrieving user information from the server.
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
    description: 'The username of the user.',
    example: 'JSMITH',
  })
  userName: string;

  @AutoMap()
  @ApiProperty({
    enum: UserAuthGroup,
    description: 'The user auth group.',
    example: UserAuthGroup.ADMIN,
  })
  userAuthGroup: UserAuthGroup;

  @AutoMap()
  @ApiProperty({
    description: 'The status of the user.',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  statusCode: UserStatus;
}
