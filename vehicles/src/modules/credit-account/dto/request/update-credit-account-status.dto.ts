import { ApiProperty } from '@nestjs/swagger';
import {
  CreditAccountStatusValid,
  CreditAccountStatusValidType,
} from '../../../../common/enum/credit-account-status-type.enum';
import { AutoMap } from '@automapper/classes';
import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { CreditAccountStatusCommentConstraint } from '../../../../common/constraint/credit-account-status-comment.constraint';

export class UpdateCreditAccountStatusDto {
  @AutoMap()
  @ApiProperty({
    description: 'The credit account status',
    example: CreditAccountStatusValid.ACCOUNT_ON_HOLD,
    enum: CreditAccountStatusValid,
  })
  @IsEnum(CreditAccountStatusValid)
  creditAccountStatusType: CreditAccountStatusValidType;

  @AutoMap()
  @ApiProperty({
    description: 'The reason for credit account status update.',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  })
  @IsOptional()
  @Validate(CreditAccountStatusCommentConstraint)
  @IsString()
  @Length(1, 4000)
  comment?: string;
}
