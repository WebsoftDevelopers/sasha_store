import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiProperty({ description: 'Registered company / business name' })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  legalName!: string;

  @ApiProperty({ description: 'CAC RC or BN number' })
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  cacNumber!: string;

  @ApiPropertyOptional({ description: 'Tax Identification Number' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  tin?: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(240)
  businessAddress!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  city!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  state!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  phone!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ description: 'Uploaded CAC document Cloudinary URL' })
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
}
