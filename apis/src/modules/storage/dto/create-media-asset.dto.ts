import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaAssetType } from '../../../../generated/prisma/client';

export class CreateMediaAssetDto {
  @ApiProperty({ enum: MediaAssetType })
  @IsEnum(MediaAssetType)
  assetType!: MediaAssetType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  context?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  entityType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiProperty()
  @IsUrl()
  url!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  secureUrl?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(240)
  publicId!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(40)
  resourceType!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  format?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  mimeType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  bytes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  width?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  height?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(240)
  folder?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
