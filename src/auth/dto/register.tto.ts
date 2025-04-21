import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
        description: 'The first name of the user',
       
    })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
        description: 'The last name of the user',
       
    })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
        description: 'The full name of the user',
       
    })
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
        description: 'The email of the user',
       
    })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({
        description: 'The password of the user',
       
    })
  password: string;
}
