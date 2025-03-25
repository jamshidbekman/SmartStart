import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Foydalanuvchi emaili',
  })
  @IsString({ message: "email string bo'lishi kerak" })
  @IsNotEmpty({ message: 'email kiritilishi majburiy' })
  email: string;

  @ApiProperty({ example: 'Qwerty123@+', description: 'Parol' })
  @IsString({ message: "password string bo'lishi kerak" })
  @IsNotEmpty({ message: 'password kiritilishi majburiy' })
  password: string;
}
