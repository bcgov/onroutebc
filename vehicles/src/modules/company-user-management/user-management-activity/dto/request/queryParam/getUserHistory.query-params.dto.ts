import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class GetUserHistoryQueryParamsDto {
  @ApiPropertyOptional({
    description:
      "The username of a pending or invited user. Used to retrieve that user's activity history when userGUID is not provided.",
    example: 'ASMITH',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  userName?: string;

  @ApiPropertyOptional({
    description:
      'The GUID of a registered user. When provided, it takes precedence over userName.',
    example: '6F9619FF8B86D011B42D00C04FC964FF',
    required: false,
  })
  @IsOptional()
  @IsString()
  userGUID?: string;
}
