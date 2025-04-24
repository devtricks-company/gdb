import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { AuthProvider, UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The firstName of the user',
    example: 'Amir'
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The lastName of the user',
    example: 'Azarbashi'
  })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The fullName of the user',
    example: 'Amir Azarbashi'
  })
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'amirm.azarbashi@gmail.com'
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'The password of the user',
    example: '123456',
    minLength:6
  })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({
    description: 'The UserRole of the user',
    example: 'Super'
  })
  role?: UserRole;

  @IsOptional()
  @IsEnum(AuthProvider)
  @ApiProperty({
      description: 'The AuthProvider of the user',
      example: 'GOOGLE'
  })
  provider?: AuthProvider;

  @IsOptional()
  @IsString()
  @ApiProperty({
      description: 'The providerId of the user',
      example: 'hashcode'
  })
  providerId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
      description: 'The Picture of the user',
      example: 'picture url'
  })
  profilePicture?: string;
}
