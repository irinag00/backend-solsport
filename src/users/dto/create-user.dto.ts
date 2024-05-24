import { IsStrongPassword, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  username: string;

  @IsStrongPassword()
  password: string;
}
