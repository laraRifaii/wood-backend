import { IsString, IsOptional, IsInt, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGalleryImageDto {
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  alt?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsInt()
  order?: number;
}

export class ReorderGalleryDto {
  @ApiProperty({ example: [{ id: 'uuid', order: 1 }] })
  @IsArray()
  items: { id: string; order: number }[];
}
