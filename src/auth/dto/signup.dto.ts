import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'Name is not completed.' })
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name must contain only letters and spaces.' })
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email.' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is not completed.' })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/, {
    message:
      'Password must contain at least one letter, one number, and one special character.',
  })
  readonly password: string;
}
