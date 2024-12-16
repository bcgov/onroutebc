import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';

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

  @IsString({ each: true })
  @IsArray()
  errors: string[];
}
