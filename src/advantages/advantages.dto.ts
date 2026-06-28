import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdvantagesDto {
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  image?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  cta?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsArray()
  items?: { description: string; order?: number }[];
}