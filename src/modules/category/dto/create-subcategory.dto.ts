import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSubcategoryDto {
  @ApiProperty({ description: 'Subkategoriyaning nomi' })
  @IsString({ message: "Subkategoriya nomi string bo'lishi kerak" })
  @IsNotEmpty({ message: "Subkategoriya nomi bo'sh bo'lmasligi kerak" })
  name: string;

  @ApiProperty({ description: 'Subkategoriyaning tavsifi' })
  @IsString({ message: "Subkategoriya tavsifi stringda bo'lishi kerak" })
  @IsNotEmpty({ message: "Subkategoriya tavsifi bo'sh bo'lmasligi kerak" })
  text: string;

  @ApiProperty({ description: 'Kategoriyaning UUID identifikatori' })
  @IsNotEmpty({ message: "Kategoriya id bo'sh bo'lmasligi kerak" })
  @IsString({ message: "Kategoriya id string bo'lishi kerak" })
  @IsUUID('all', {
    message: "Kategoriya ID to'g'ri UUID formatida bo'lishi kerak",
  })
  category_id: string;
}
