import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHeroDto {
  @ApiProperty({ example: 'SOLID\nWOOD\nPRODUCTS', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ctaText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ctaLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  backgroundImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image1?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image2?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image3?: string;
}
