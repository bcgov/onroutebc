import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProfileRegistrationEmailData } from 'src/common/interface/profile-registration-email-data.interface';
import { EmailRequestDto } from './email-request.dto';

export class ProfileRegistrationEmailDto
  extends EmailRequestDto
  implements ProfileRegistrationEmailData
{
  @ApiProperty({
    description: 'The company name for registration.',
    example: 'My Company LLC',
  })
  @IsString()
  companyName: string;

  @ApiProperty({
    description: 'OnRouteBC client number for registration.',
    example: '02-04030689-000-BC',
  })
  @IsString()
  onRoutebBcClientNumber: string;

  @ApiProperty({
    description: 'The company address line 1.',
    example: '#124-2345 My Street',
  })
  @IsString()
  companyAddressLine1: string;

  @ApiProperty({
    description: 'The company address line 2 (if any).',
    example: 'Building A, Floor 2',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyAddressLine2?: string;

  @ApiProperty({
    description: 'The country that the company is located in.',
    example: 'Canada',
  })
  @IsString()
  companyCountry: string;

  @ApiProperty({
    description: 'The province or state that the company is located in.',
    example: 'British Columbia',
  })
  @IsString()
  companyProvinceState: string;

  @ApiProperty({
    description: 'The city that the company is located in.',
    example: 'Coquitlam',
  })
  @IsString()
  companyCity: string;

  @ApiProperty({
    description: 'The postal code for the company.',
    example: 'V1C 2B3',
  })
  @IsString()
  companyPostalCode: string;

  @ApiProperty({
    description: 'The company email used for registration.',
    example: 'mycompany@mycompany.co',
  })
  @IsEmail()
  companyEmail: string;

  @ApiProperty({
    description: 'The company phone number used for registration.',
    example: '+1 (604)-123-4567',
  })
  @IsString()
  companyPhoneNumber: string;

  @ApiProperty({
    description: 'The company fax number used for registration (if any).',
    example: '+1 (604)-123-4568',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyFaxNumber?: string;

  @ApiProperty({
    description: "The company primary contact's first name.",
    example: 'Mister',
  })
  @IsString()
  primaryContactFirstname: string;

  @ApiProperty({
    description: "The company primary contact's last name.",
    example: 'Manager',
  })
  @IsString()
  primaryContactLastname: string;

  @ApiProperty({
    description: "The company primary contact's email.",
    example: 'mrmanager@mycompany.co',
  })
  @IsEmail()
  primaryContactEmail: string;

  @ApiProperty({
    description: "The company primary contact's phone number.",
    example: '+1 (778)-123-4567',
  })
  @IsString()
  primaryContactPhoneNumber: string;

  @ApiProperty({
    description: "The company primary contact's phone extension (if any).",
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  @IsAlphanumeric()
  primaryContactExtension?: string;

  @ApiProperty({
    description:
      "The company primary contact's alternate phone number (if any).",
    example: '+1 (778)-123-4569',
    required: false,
  })
  @IsOptional()
  @IsString()
  primaryContactAlternatePhoneNumber?: string;

  @ApiProperty({
    description: "The country of company primary contact's location.",
    example: 'Canada',
  })
  @IsString()
  primaryContactCountry: string;

  @ApiProperty({
    description: "The province or state of company primary contact's location.",
    example: 'British Columbia',
  })
  @IsString()
  primaryContactProvinceState: string;

  @ApiProperty({
    description: "The city of company primary contact's location.",
    example: 'Coquitlam',
  })
  @IsString()
  primaryContactCity: string;
}
