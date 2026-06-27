import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Custom Furniture' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  icon?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  image?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsInt()
  order?: number;
}

export class UpdateServiceDto {
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  icon?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  image?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsInt()
  order?: number;
}
