import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UpsertSpecialAuthDto } from '../request/upsert-special-auth.dto';

export class ReadSpecialAuthDto extends UpsertSpecialAuthDto {
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
