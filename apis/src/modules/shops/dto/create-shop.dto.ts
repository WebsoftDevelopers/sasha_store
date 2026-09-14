import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateShopDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  bannerUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  ownerFirstName!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  ownerLastName!: string;

  @ApiProperty()
  @IsEmail()
  ownerEmail!: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  ownerPhone!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  alternativePhone?: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  identificationType!: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  identificationNumber!: string;

  @ApiProperty({ description: 'Registered company / business name' })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  legalName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  registeredBusinessName?: string;

  @ApiProperty({ description: 'CAC RC or BN number' })
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  cacNumber!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  businessRegistrationType?: string;

  @ApiPropertyOptional({ description: 'Tax Identification Number' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  tin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  registrationDate?: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(240)
  businessAddress!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  city!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  state!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  lga?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(240)
  streetAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  phone!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  businessPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  businessEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  socialLinks?: string[];

  @ApiPropertyOptional({ description: 'Uploaded CAC document URL' })
  @IsOptional()
  @IsUrl()
  cacDocumentUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  idDocumentUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  proofOfAddressUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  businessRegistrationDocumentUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  taxCertificateUrl?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  additionalDocumentUrls?: string[];
}
