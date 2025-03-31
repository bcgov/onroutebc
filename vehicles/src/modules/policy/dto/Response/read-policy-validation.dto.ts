import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationResults } from 'onroute-policy-engine/.';

export class ReadPolicyValidationDto extends ValidationResults {
  @AutoMap()
  @ApiProperty({
    description: 'Id of the Application/Permit.',
    example: '1',
  })
  id: string;
}
