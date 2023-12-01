import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from '../../../../common/dto/request/create-address.dto';
import { CreateContactDto } from '../../../../common/dto/request/create-contact.dto';
import { CreateUserDto } from '../../../users/dto/request/create-user.dto';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * JSON representation of the request object for creating a new company and
 * admin user.
 */
export class CreateCompanyDto {
  @AutoMap()
  @ApiProperty({
    description: 'The legal name of the company.',
    example: 'ABC Carriers Inc.',
  })
  legalName: string;

  @AutoMap()
  @ApiProperty({
    description: 'The Alternate name of the company/Doing Business As (DBA).',
    example: 'ABC Carriers Inc.',
  })
  @IsOptional()
  @IsString()
  alternateName?: string;

  @AutoMap()
  @ApiProperty({
    description:
      'The mailing address of the company. ' +
      'The object must adhere to the individual field rules',
    required: true,
  })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  mailingAddress: CreateAddressDto;

  @AutoMap()
  @ApiProperty({
    description: 'The phone number of the company.',
    required: true,
    maxLength: 20,
    minLength: 10,
    example: '9999999999',
  })
  @IsString()
  @Length(10, 20)
  phone: string;

  @AutoMap()
  @ApiProperty({
    description: 'The phone extension of the company (if there is one).',
    required: false,
    maxLength: 5,
    example: '99999',
  })
  @IsOptional()
  @IsString()
  @Length(1, 5)
  extension?: string;

  @AutoMap()
  @ApiProperty({
    description: 'The fax number of the company (if there is one).',
    required: false,
    maxLength: 20,
    minLength: 10,
    example: '9999999999',
  })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  fax?: string;

  @AutoMap()
  @ApiProperty({
    description: 'The email address of the company.',
    required: true,
    example: 'test@test.gov.bc.ca',
  })
  @IsEmail()
  email: string;

  @AutoMap()
  @ApiProperty({
    description: 'The primary contact of the company.',
    required: true,
  })
  @ValidateNested()
  @Type(() => CreateContactDto)
  primaryContact: CreateContactDto;

  @AutoMap()
  @ApiProperty({
    description: 'The admin user of the company.',
    required: true,
  })
  @ValidateNested()
  @Type(() => CreateUserDto)
  adminUser: CreateUserDto;
}
