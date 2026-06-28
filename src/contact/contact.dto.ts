import { IsString, IsNotEmpty,  Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @ApiProperty({ example: '+961 70 000 000' })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone!: string;

  @ApiProperty({ example: 'I would like a quote for a custom table' })
  @IsString()
  @IsNotEmpty({ message: 'Question is required' })
  question!: string;
}