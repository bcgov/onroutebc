import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadCreditAccountUserDto } from './read-credit-account-user.dto';

export class ReadCreditAccountUserDetailsDto extends ReadCreditAccountUserDto {
  @AutoMap()
  @ApiProperty({
    description: 'The credit account number.',
    example: 'WS5667',
  })
  creditAccountNumber: string;
}
