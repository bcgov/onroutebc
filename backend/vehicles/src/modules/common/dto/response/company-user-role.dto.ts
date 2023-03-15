import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserAuthGroup } from 'src/common/enum/user-auth-group.enum';
import { UserCompanyDto } from './user-company.dto';
//import { UserRoleDto } from './user-role.dto';
import { UserDto } from './user.dto';

export class CompanyUserRoleDto {
  // @AutoMap()
  // role: UserRoleDto;

  @AutoMap()
  @ApiProperty({
    enum: UserAuthGroup,
    description: 'The user auth group.',
    example: UserAuthGroup.ADMIN,
  })
  userAuthGroup: UserAuthGroup;

  @AutoMap()
  public company: UserCompanyDto;

  @AutoMap()
  public user: UserDto;
}
