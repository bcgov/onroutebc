import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IDIRUserAuthGroup } from '../../../../../common/enum/user-auth-group.enum';
import { IsEnum } from 'class-validator';

/**
 * JSON representation of the request object for updating the new user added to
 * the company.
 */
export class UpdatePendingIdirUserDto {
  @AutoMap()
  @ApiProperty({
    enum: IDIRUserAuthGroup,
    description: 'The user auth group.',
    example: IDIRUserAuthGroup.SYSTEM_ADMINISTRATOR,
  })
  @IsEnum(IDIRUserAuthGroup)
  userAuthGroup: IDIRUserAuthGroup;
}
