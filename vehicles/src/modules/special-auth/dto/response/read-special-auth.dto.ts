import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSpecialAuthDto } from '../request/create-special-auth.dto';

export class ReadSpecialAuthDto extends CreateSpecialAuthDto {
  @AutoMap()
  @ApiProperty({
    example: 1,
    description: 'Unique Identifier for special authorization.',
  })
  specialAuthId: number;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the company requesting the LoA.',
    example: 74,
    required: false,
  })
  companyId: number;
}
