import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
      description: 'The email of the user',
      example: 'amirm.azarbashi@gmail.com'
  })
  email: string;

  @IsOptional()
  @IsString()
   @ApiProperty({
      description: 'The password of the user',
      minLength:6
  })
  password: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
      description: 'The isAdminPanel of the user',
      
  })
  isAdminPanel?: boolean;
}
