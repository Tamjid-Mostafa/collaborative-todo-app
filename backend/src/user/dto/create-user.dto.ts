import {
  IsString,
  IsEmail,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsIn,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Match } from '../decorator/match.decorator';

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
  @MinLength(8)
  @MaxLength(64)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
    { message: "Password too weak" }
  )
  password: string;
  
  
  @Match("password", { message: "Passwords do not match" })
  passwordConfirm: string;

  @IsOptional()
  @IsIn(['admin', 'viewer', 'editor'], {
    message: 'Role must be one of: admin, viewer, editor',
  })
  role?: string;
}
