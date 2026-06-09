import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadCreditAccountLimitDto } from './read-credit-account-limit.dto';

export class ReadCreditAccountDetailsDto {
  @AutoMap()
  @ApiProperty({
    description: 'Indicates whether the account exists in ORBC.',
    example: false,
  })
  isExistingInORBC: boolean;

  @AutoMap()
  @ApiProperty({
    description: 'The credit account limits if available .',
    required: true,
  })
  creditAccountLimits: ReadCreditAccountLimitDto;
}
