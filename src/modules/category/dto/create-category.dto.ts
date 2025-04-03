import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Kategoriyaning nomi' })
  @IsString({ message: "Kategoriya nomi string bo'lishi kerak" })
  @IsNotEmpty({ message: "Kategoriya nomi bo'sh bo'lmasligi kerak" })
  name: string;

  @ApiProperty({ description: 'Kategoriyaning tavsifi' })
  @IsString({ message: "Kategoriya tavsifi stringda bo'lishi kerak" })
  @IsNotEmpty({ message: "Kategoriya tavsifi bo'sh bo'lmasligi kerak" })
  text: string;
}
