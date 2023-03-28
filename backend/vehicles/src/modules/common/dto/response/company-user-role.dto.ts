import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserAuthGroup } from 'src/common/enum/user-auth-group.enum';
import { UserCompanyDto } from './user-company.dto';
import { UserRoleDto } from './user-role.dto';
import { UserDto } from './user.dto';

export class CompanyUserRoleDto {
  // @AutoMap()
  // role: UserRoleDto;
  @AutoMap()
  @ApiProperty({
    example: '1234',
    description: 'The company user id',
    required: true,
  })
  companyUserId: number;
  @AutoMap()
  @ApiProperty({
    enum: UserAuthGroup,
    description: 'The user auth group.',
    example: 'ADMIN',
  })
  userAuthGroup: string;

  @AutoMap()
  public company: UserCompanyDto;

  @AutoMap()
  public user: UserDto;

  @AutoMap()
  public userRoles: UserRoleDto[];
}
