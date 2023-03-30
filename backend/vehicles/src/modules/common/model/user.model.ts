import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserDirectory } from 'src/common/enum/directory.enum';
import { UserStatus } from 'src/common/enum/user-status.enum';
import { UserDetailModel } from './user-detail.model';

export class UserModel {
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
    example: 'BCEID',
  })
  userDirectory: UserDirectory;

  @AutoMap()
  @ApiProperty({
    enum: UserDirectory,
    description: 'The user directory.',
    example: 'ADMIN',
  })
  userAuthGroup: string;

  @AutoMap()
  @ApiProperty({
    description: 'The status of the user.',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  statusCode: UserStatus;

  @AutoMap()
  userCompany: UserDetailModel;

  @AutoMap()
  roles: string[];
}
