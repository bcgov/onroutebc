import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { GetApplicationInQueueQueryParamsDto } from './getApplicationInQueue.query-params.dto';
import { Transform } from 'class-transformer';

export class ApplicationStaffSearchQueryParamsDto extends GetApplicationInQueueQueryParamsDto {
  @ApiProperty({
    description:
      'Setting to true confines results to applications in queue. If set to false, it returns applications in all statuses',
    example: true,
    required: true,
  })
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsBoolean()
  applicationsInQueue: boolean;
}
