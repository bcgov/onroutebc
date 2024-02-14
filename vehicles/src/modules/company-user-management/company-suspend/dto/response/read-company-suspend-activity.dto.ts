import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCompanySuspendDto } from '../request/create-company-suspend.dto';

/**
 * JSON representation of response object when retrieving a company suspend acitivty.
 */
export class ReadCompanySuspendActivityDto extends CreateCompanySuspendDto {
  @AutoMap()
  @ApiProperty({
    description: 'The unique suspend acitivty id.',
    example: 1,
  })
  activityId: number;

  @AutoMap()
  @ApiProperty({
    description: 'The user name of id linked to suspend activity.',
    example: 'JSMITH',
  })
  userName: string;

  @AutoMap()
  @ApiProperty({
    description: 'The suspend acitivty date time.',
    example: '2023-10-11T23:26:51.170Z',
  })
  suspendActivityDateTime?: string;
}
