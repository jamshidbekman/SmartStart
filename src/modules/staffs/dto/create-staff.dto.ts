import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { Roles } from '../entities/staff.entity';

export class CreateStaffDto {
  @IsNotEmpty({ message: 'username kiritilishi shart' })
  @IsString({ message: "username stringda bo'lishi kerak" })
  @MinLength(5, {
    message: "username kamida 5 ta belgidan iborat bo'lishi kerak",
  })
  username: string;

  @IsNotEmpty({ message: 'password kiritilishi shart' })
  @IsString({ message: "password stringda bo'lishi kerak" })
  @IsStrongPassword(
    { minLength: 6 },
    { message: 'password yetarlicha kuchli emas' },
  )
  password: string;

  @IsString({ message: "role stringda bo'lishi kerak" })
  @IsEnum(Roles, { message: 'Bunday role mavjud emas' })
  role?: Roles;
}
