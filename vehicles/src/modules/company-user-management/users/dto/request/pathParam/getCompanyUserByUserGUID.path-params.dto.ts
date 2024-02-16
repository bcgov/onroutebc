import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class GetCompanyUserByUserGUIDPathParamsDto {
  @ApiProperty({
    description: `Id of the company the user is associated with.`,
    example: 74,
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  companyId: number;

  @ApiProperty({
    description: `The user GUID.`,
    example: '6F9619FF8B86D011B42D00C04FC964FF',
    required: true,
  })
  @IsString()
  userGUID: string;
}
