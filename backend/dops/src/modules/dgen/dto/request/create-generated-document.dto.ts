import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { Allow, IsEnum, IsJSON, IsNumber, IsString } from 'class-validator';
import { TemplateName } from '../../../../enum/template-name.enum';

export class CreateGeneratedDocumentDto {
  @AutoMap()
  @ApiProperty({
    enum: TemplateName,
    example: TemplateName.PERMIT_TROS,
    description: 'The template that will be used to render the document.',
  })
  @IsEnum(TemplateName)
  templateName: TemplateName;

  @AutoMap()
  @ApiProperty({
    required: false,
    example: 1,
    description:
      'The template versions. By default, the latest template version will be used.',
  })
  @IsNumber()
  templateVersion?: number;

  @AutoMap()
  @ApiProperty({
    description: 'The template data.',
    required: true,
  })
  @IsJSON()
  templateData: JSON;


  @AutoMap()
  @ApiProperty({
    example: 'permit-A-2-3-4-5',
    description: 'The generated file name. Do not include file extentions.',    
    required: true,
  })
  @IsString()
  generatedDocumentFileName: string;

}


