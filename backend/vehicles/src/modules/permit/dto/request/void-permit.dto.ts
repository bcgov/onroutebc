import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';

export class VoidPermitDto {
    @AutoMap()
    @ApiProperty({
    description: 'Revoke or void status for permit.',
    example: ApplicationStatus.REVOKED,
    required: false,
  })
  status: ApplicationStatus;

  @AutoMap()
  @ApiProperty({
    description: 'Permit Transaction ID.',
    example:'T000000A0W',
    required: false,
  })
  transactionOrderNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'Permit Transaction Date.',
    example:'2023-07-10T15:49:36.582Z',
    required: false,
  })
  transactionDate: Date;

  @AutoMap()
    @IsNumber()
    @ApiProperty({
      description: 'Permit Transaction Amount.',
      example:30,
      required: false,
    })
    transactionAmount: number;

  @AutoMap()
  @ApiProperty({
    description: 'Permit Transaction Method.',
    example:'CC',
    required: false,
  })
  paymentMethod: string;
}
