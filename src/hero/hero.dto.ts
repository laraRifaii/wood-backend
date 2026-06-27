import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHeroDto {
  @ApiProperty({ example: 'SOLID\nWOOD\nPRODUCTS', required: false })
  @IsOptional() @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  subtitle?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  ctaText?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  ctaLink?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  backgroundImage?: string;
}
