import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { IDIRUserRole } from '@common/enum/user-role.enum';
import { Transform } from 'class-transformer';
import { Directory } from '@common/enum/directory.enum';

export class GetStaffUserQueryParamsDto {
  @ApiProperty({
    description:
      'Filters the results to include only users belonging to the specified authentication group. This parameter is optional.',
    enum: IDIRUserRole,
    example: IDIRUserRole.PPC_CLERK,
    required: false,
  })
  @IsOptional()
  @IsEnum(IDIRUserRole)
  userRole?: IDIRUserRole;

  @ApiProperty({
    description:
      'Filters the results to include only users belonging to the specified directory group. This parameter is optional.',
    enum: Directory,
    example: Directory.IDIR,
    required: false,
  })
  @IsOptional()
  @IsEnum(Directory)
  userDirectory?: Directory;

  @ApiProperty({
    description:
      'Applies a filter to return all active and inactive users. Pending users are not included in this list. If not specified, the API returns only active users.',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsOptional()
  @IsBoolean()
  includeInactiveUsers?: boolean;

  @ApiProperty({
    description:
      'Applies a filter to return only the details of PPC users who have issued a permit. This is optional and, when specified, takes precedence over other fields.',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsBoolean()
  permitIssuerPPCUser?: boolean;
}
