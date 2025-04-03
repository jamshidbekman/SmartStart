import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Kategoriyaning noyob identifikatori' })
  id: number;

  @ApiProperty({ description: 'Kategoriyaning nomi' })
  @IsString()
  @IsNotEmpty({ message: "Kategoriya nomi bo'sh bo'lmasligi kerak" })
  name: string;

  @ApiProperty({ description: 'Kategoriyaning tavsifi' })
  @IsString()
  @IsNotEmpty({ message: "Kategoriya tavsifi bo'sh bo'lmasligi kerak" })
  text: string;
}
