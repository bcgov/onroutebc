import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  ArrayMinSize,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { EmailTemplate } from '../../../../enum/email-template.enum';

export class EmailDto {
  @ApiProperty({
    description: 'The subject of the email.',
    example: 'onRouteBC Suspended',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Emails of recipients.',
    example: ['someguy@mycompany.co', 'somegirl@mycompany.co'],
  })
  @IsEmail(undefined, {
    each: true,
  })
  @ArrayMinSize(1)
  to: string[];

  @ApiProperty({
    description: 'Emails of CC.',
    example: ['someguy@mycompany.co', 'somegirl@mycompany.co'],
  })
  @IsOptional()
  @IsEmail(undefined, {
    each: true,
  })
  cc: string[];

  @ApiProperty({
    enum: EmailTemplate,
    example: EmailTemplate.COMPANY_SUSPEND,
    description: 'The template that will be used to render the email.',
  })
  @IsEnum(EmailTemplate)
  templateName: EmailTemplate;

  @ApiProperty({
    example: {
      companyName: 'PARISIAN LLC TRUCKING',
      onRoutebBcClientNumber: ' B3-000005-722',
    },
    description: 'Data to be inserted into the template',
  })
  @Allow()
  data: object;
}
