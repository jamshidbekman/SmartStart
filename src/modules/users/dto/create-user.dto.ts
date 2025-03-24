import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Jamshidbek Mansurov Muxsinjonovich',
    description: 'Foydalanuvchi ismi',
  })
  @IsString({ message: "fullname string bo'lishi kerak" })
  @IsNotEmpty({ message: 'fullname kiritilishi majburiy' })
  @MinLength(5, { message: "fullname kamida 5 belgidan iborat bo'lishi kerak" })
  @MaxLength(100, { message: 'fullname 30 belgidan oshmasligi kerak' })
  fullname: string;

  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Foydalanuvchi emaili',
  })
  @IsString({ message: "email string bo'lishi kerak" })
  @IsNotEmpty({ message: 'email kiritilishi majburiy' })
  @MinLength(5, { message: "email kamida 5 belgidan iborat bo'lishi kerak" })
  @MaxLength(50, { message: 'email 30 belgidan oshmasligi kerak' })
  @IsEmail({}, { message: "email to'g'ri kiritilganiga ishonch hosil qiling" })
  email: string;

  @ApiProperty({ example: 'Qwerty123@+', description: 'Parol' })
  @IsString({ message: "password string bo'lishi kerak" })
  @IsNotEmpty({ message: 'password kiritilishi majburiy' })
  @MinLength(6, { message: "password kamida 5 belgidan iborat bo'lishi kerak" })
  @MaxLength(30, { message: 'password 30 belgidan oshmasligi kerak' })
  @IsStrongPassword(
    { minLength: 6 },
    {
      message: 'password yetarlicha kuchli emas',
    },
  )
  password: string;
}
