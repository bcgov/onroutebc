import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserAuthGroup } from '../../../../../common/enum/user-auth-group.enum';
import { CreateContactDto } from '../../../../common/dto/request/create-contact.dto';
import { IsEnum } from 'class-validator';

/**
 * JSON representation of the request object for creating a user.
 */
export class CreateUserDto extends CreateContactDto {
  @AutoMap()
  @ApiProperty({
    enum: UserAuthGroup,
    description: 'The user auth group.',
    example: UserAuthGroup.COMPANY_ADMINISTRATOR,
  })
  @IsEnum(UserAuthGroup)
  userAuthGroup: UserAuthGroup;
}
