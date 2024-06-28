import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreditAccountActivityType } from '../../../../common/enum/credit-account-activity-type.enum';

export class ReadCreditAccountActivityDto {
  @AutoMap()
  @ApiProperty({
    description: 'The unique credit account acitivty id.',
    example: 1,
  })
  activityId: number;

  @AutoMap()
  @ApiProperty({
    description: 'The user name of id linked to credit account activity.',
    example: 'JSMITH',
  })
  userName: string;

  @AutoMap()
  @ApiProperty({
    description: 'The credit account acitivty date time.',
    example: '2023-10-11T23:26:51.170Z',
  })
  creditAccountActivityDateTime?: string;

  @AutoMap()
  @ApiProperty({
    description: 'The credit account status update activity',
    example: CreditAccountActivityType.ACCOUNT_ON_HOLD,
    enum: CreditAccountActivityType,
  })
  creditAccountActivityType: CreditAccountActivityType;

  @AutoMap()
  @ApiProperty({
    description: 'The reason for credit account status update.',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  })
  comment?: string;
}
