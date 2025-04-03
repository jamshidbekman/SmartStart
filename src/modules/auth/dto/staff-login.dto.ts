import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StaffLoginDto {
  @ApiProperty({
    example: 'username',
    description: 'Foydalanuvchi usernamei',
  })
  @IsString({ message: "username string bo'lishi kerak" })
  @IsNotEmpty({ message: 'username kiritilishi majburiy' })
  username: string;

  @ApiProperty({ example: 'Qwerty123@+', description: 'Parol' })
  @IsString({ message: "password string bo'lishi kerak" })
  @IsNotEmpty({ message: 'password kiritilishi majburiy' })
  password: string;
}
