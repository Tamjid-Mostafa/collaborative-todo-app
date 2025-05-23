import {
  IsString,
  IsEmail,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined({ message: 'First name is required' })
  @IsString()
  @IsNotEmpty({ message: 'First name cannot be empty' })
  firstName: string;

  @IsDefined({ message: 'Last name is required' })
  @IsString()
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  lastName: string;

  @IsDefined({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsDefined({ message: 'Username is required' })
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @IsDefined({ message: 'Password is required' })
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
