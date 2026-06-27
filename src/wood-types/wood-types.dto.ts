import { IsString, IsArray, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWoodTypeDto {
  @ApiProperty({ example: 'Oak' })
  @IsString()
  name: string;

  @ApiProperty({ example: ['Durability', 'Beautiful texture'] })
  @IsArray()
  pros: string[];

  @ApiProperty({ example: ['Expensive'] })
  @IsArray()
  cons: string[];

  @ApiProperty({ required: false })
  @IsOptional() @IsInt()
  order?: number;
}

export class UpdateWoodTypeDto {
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsArray()
  pros?: string[];

  @ApiProperty({ required: false })
  @IsOptional() @IsArray()
  cons?: string[];

  @ApiProperty({ required: false })
  @IsOptional() @IsInt()
  order?: number;
}

export class ReorderImagesDto {
  @ApiProperty({ example: [{ id: 'uuid', order: 1 }] })
  @IsArray()
  items: { id: string; order: number }[];
}
