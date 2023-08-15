import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

/**
 * JSON representation of a error
 */
export class ReadErrorDto {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description:
      'The error type id related to the error',
    required: true,
  })
  errorTypeId: string;

  @AutoMap()
  @ApiProperty({
    example: '2023-08-15 19:24:55.3380000',
    description:
      'The error occured time',
    required: true,
  })
  errorOccuredTime: string;

  @AutoMap()
  @ApiProperty({
    example: '3a3cb08f-8cd9-421d-9ae7-860ec2ce0bd3',
    description:
      'Session id related to the error',
    required: true,

  })
  sessionId: string;

  @AutoMap()
  @ApiProperty({
    example: '06267945F2EB4E31B585932F78B76269',
    description: 'User GUID related to the error',
    required: true,
  })
  userGuid: string;

  @AutoMap()
  @ApiProperty({
    example: '1692127495337-825108',
    description: 'A unique id generated for each error instance to facilitate easy tracking and correlation',
    required: false,
  })
  corelationId: string;
}
