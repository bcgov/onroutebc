import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { IDIRUserAuthGroup } from '../../../../../../common/enum/user-auth-group.enum';
import { Transform } from 'class-transformer';

export class GetStaffUserQueryParamsDto {
  @ApiProperty({
    description:
      'Filters the results to include only users belonging to the specified authentication group. This parameter is optional.',
    enum: IDIRUserAuthGroup,
    example: IDIRUserAuthGroup.PPC_CLERK,
    required: false,
  })
  @IsOptional()
  @IsEnum(IDIRUserAuthGroup)
  userAuthGroup?: IDIRUserAuthGroup;

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
