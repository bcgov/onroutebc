import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  @AutoMap()
  @ApiProperty({
    description: 'Created by',
    example: 'user1',
  })
  createdUser: string;

  @AutoMap()
  @ApiProperty({ description: 'Created User Directory' ,
example: 'user1',
})
  createdUserDirectory: string;

  @AutoMap()
  @ApiProperty({ description: 'Created User GUID', example:'06267945F2EB4E31B585932F78B76269', })
  createdUserGuid: string;

  @AutoMap()
  @ApiProperty({
    description: 'Created Date and Time',
  })
  createdDateTime: string;

  @AutoMap()
  @ApiProperty({
    description: 'Updated by',
    example: 'user1',
  })
  updatedUser: string;

  @AutoMap()
  @ApiProperty({
    description: 'Updated User Directory',
    example: 'user1',
  })
  updatedUserDirectory: string;

  @AutoMap()
  @ApiProperty({ description: 'Updated User GUID', example:'06267945F2EB4E31B585932F78B76269', })
  upatedUserGuid: string;

  @AutoMap()
  @ApiProperty({
    description: 'Updated Date and Time',
  })
  updatedDateTime: string;
}
