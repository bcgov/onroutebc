import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { SuspendActivity } from '../../../../../common/enum/suspend-activity.enum';
import { SuspendCommentConstraint } from '../../../../../common/constraint/suspend-comment.constraint';

/**
 * JSON representation of the request object for capturing a companies suspend
 * activity
 */
export class CreateCompanySuspendDto {
  @AutoMap()
  @ApiProperty({
    description: 'The reason for company suspension.',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  })
  @IsOptional()
  @Validate(SuspendCommentConstraint)
  @IsString()
  @Length(1, 4000)
  comment?: string;

  @AutoMap()
  @ApiProperty({
    enum: SuspendActivity,
    required: true,
    example: SuspendActivity.SUSPEND_COMPANY,
    description: 'Company Suspend/unsuspend activity type.',
  })
  @IsEnum(SuspendActivity)
  suspendActivityType: SuspendActivity;
}
