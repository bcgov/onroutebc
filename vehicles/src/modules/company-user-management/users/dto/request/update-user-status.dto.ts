import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserStatus } from '../../../../../common/enum/user-status.enum';

/**
 * JSON representation of request object for updating user status.
 */
export class UpdateUserStatusDto {
  @AutoMap()
  @ApiProperty({
    enum: UserStatus,
    description: 'The status of the user.',
    example: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus)
  statusCode: UserStatus;
}
