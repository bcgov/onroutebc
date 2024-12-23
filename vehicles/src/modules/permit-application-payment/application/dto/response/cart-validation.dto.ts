import { Type } from 'class-transformer';
import { IsArray, IsDate, IsString, ValidateNested } from 'class-validator';

// Validation DTO
export class CartValidationDto {
  @IsString()
  hash: string;

  @IsDate()
  validationDateTime: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicationDataValidationDto)
  applicationValidationResult: ApplicationDataValidationDto[];
}

// Validation DTO
export class ApplicationDataValidationDto {
  @IsString()
  applicationNumber: string;

  @IsString({ each: true })
  @IsArray()
  errors: string[];
}
