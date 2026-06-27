import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAboutDto {
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  brandName?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  image1?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  image2?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  image3?: string;
}
