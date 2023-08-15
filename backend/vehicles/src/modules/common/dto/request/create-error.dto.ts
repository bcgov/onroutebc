import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * JSON representation of an error
 */
export class CreateErrorDto {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description:
      'The error type id of the error',
    required: true,
  })
  @IsString()
  errorTypeId: string;

  @AutoMap()
  @ApiProperty({
    example: '2023-08-15 19:24:55.3380000',
    description:
      'The error occured time in utc',
    required: true,
  })
  @IsString()
  errorOccuredTime: string;

  @AutoMap()
  @ApiProperty({
    example: 'd257d886-9201-48ae-a557-045bea9c1d26',
    description:
      'The session id related to the error',
    required: true,
  })
  @IsString()
  sessionId: string;

  @AutoMap()
  @ApiProperty({
    example: '06267945F2EB4E31B585932F78B76269',
    description:
      'The user guid related to the error',
    required: true,
  })
  @IsString()
  userGuid: string;

  @AutoMap()
  @ApiProperty({
    example: '1692029525089-738381',
    description:
      'The corelation id of the error',
    required: true,
  })
  @IsString()
  corelationId: string;
}
