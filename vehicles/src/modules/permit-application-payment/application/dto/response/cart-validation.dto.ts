import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';

// Error description DTO
export class ErrorDescriptionDto {
  @IsString()
  errorDescription: string;
}
export enum Status {
  SUCCESS = 'Success',
  ERROR = 'Error',
}

// Validation DTO
export class CartValidationDto {
  @IsEnum(Status)
  status: Status;

  @IsString()
  error: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicationDataValidationDto)
  applicationValidationResult: ApplicationDataValidationDto[];
}

// Validation DTO
export class ApplicationDataValidationDto {
  @IsString()
  applicationNumber: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ErrorDescriptionDto)
  errors: ErrorDescriptionDto[];
}
