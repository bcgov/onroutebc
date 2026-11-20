import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@common/enum/user-status.enum';
import { UserManagementActivityType } from '@common/enum/user-management-activity-type.enum';
import { IDIRUserRole } from '@common/enum/user-role.enum';

/**
 * JSON representation of response object when retrieving user history information from the server.
 */
export class ReadUserManagementActivityDto {
  @AutoMap()
  @ApiProperty({
    description: 'The unique activity id.',
    example: '1',
  })
  activityId: string;

  @AutoMap()
  @ApiProperty({
    description: 'The user GUID.',
    example: '6F9619FF8B86D011B42D00C04FC964FF',
    required: false,
  })
  userGUID?: string;

  @AutoMap()
  @ApiProperty({
    description: 'The username of the user.',
    example: 'JSMITH',
  })
  userName: string;

  @AutoMap()
  @ApiProperty({
    description: 'The status of the user.',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    required: false,
  })
  statusCode?: UserStatus;

  @AutoMap()
  @ApiProperty({
    description: 'The username who performed the action.',
    example: 'Adam',
  })
  updatedStaffUserName: string;

  @AutoMap()
  @ApiProperty({
    description: 'The action performed on the user account.',
    enum: UserManagementActivityType,
    example: UserManagementActivityType.USER_ADDED,
  })
  userManagementActivityType: UserManagementActivityType;

  @AutoMap()
  @ApiProperty({
    description: 'The role assigned to the user.',
    enum: IDIRUserRole,
    example: IDIRUserRole.SYSTEM_ADMINISTRATOR,
    required: false,
  })
  assignedUserRole?: IDIRUserRole;

  @AutoMap()
  @ApiProperty({
    description: 'Date and Time the action was performed',
  })
  userManagementActivityDateTime: Date;

  @AutoMap()
  @ApiProperty({
    description: 'Comment/description of the action performed.',
    example: 'User was added to onRouteBC',
    required: false,
  })
  comment?: string;
}
