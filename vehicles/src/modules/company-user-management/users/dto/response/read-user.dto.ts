import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  ClientUserRole,
  IDIRUserRole,
  UserRole,
} from '../../../../../common/enum/user-role.enum';
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
    enum: ClientUserRole,
    description: 'The user auth group.',
    example: ClientUserRole.COMPANY_ADMINISTRATOR,
  })
  userRole: UserRole | ClientUserRole | IDIRUserRole;

  @AutoMap()
  @ApiProperty({
    description: 'The status of the user.',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  statusCode: UserStatus;

  @AutoMap()
  @ApiProperty({
    description: 'Created Date and Time',
  })
  createdDateTime: string;

  @AutoMap()
  @ApiProperty({
    description: 'Updated Date and Time',
  })
  updatedDateTime: string;
}
