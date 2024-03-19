import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsNumber,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { IDIR_USER_AUTH_GROUP_LIST } from '../../../../../common/enum/user-auth-group.enum';

export class IssuePermitDto {
  @AutoMap()
  @ApiProperty({
    description:
      'Application Ids. Note: Bulk issuance is not yet implemented even though we capture multiple Application Ids',
    isArray: true,
    type: String,
    example: ['1'],
  })
  @IsNumberString({}, { each: true })
  @ArrayMinSize(1)
  applicationIds: string[];

  @AutoMap()
  @ApiProperty({
    description: `Id of the company requesting the application issuance. Optional for ${IDIR_USER_AUTH_GROUP_LIST.join(', ')}`,
    example: 74,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  companyId?: number;
}
