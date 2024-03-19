import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsOptional, IsString } from 'class-validator';
import { EmailDto } from './email.dto';

export class EmailDocumentDto extends EmailDto {
  @ApiProperty({
    description: 'An array of document IDs to be attached with the email',
    example: ['5', '6'],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @ArrayMinSize(1)
  documentIds?: string[];
}
