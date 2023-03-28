import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserDirectory } from 'src/common/enum/directory.enum';
import { UserAuthGroup } from 'src/common/enum/user-auth-group.enum';
import { UserStatus } from 'src/common/enum/user-status.enum';

export class UserDto {
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
    enum: UserDirectory,
    description: 'The user directory.',
    example: UserDirectory.BBCEID,
  })
  userDirectory: UserDirectory;

  @AutoMap()
  @ApiProperty({
    description: 'The status of the user.',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  statusCode: UserStatus;

  @AutoMap()
  @ApiProperty({
    description: 'The auth group of the user.',
    example: 'PUBLIC',
  })
  userAuthGroup: string;
}
