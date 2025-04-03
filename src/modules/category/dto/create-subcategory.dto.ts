import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSubcategoryDto {
  @ApiProperty({ description: 'Subkategoriyaning noyob identifikatori' })
  id: number;

  @ApiProperty({ description: 'Subkategoriyaning nomi' })
  @IsString()
  @IsNotEmpty({ message: "Subcategory nomi bo'sh bo'lmasligi kerak" })
  name: string;

  @ApiProperty({ description: 'Kategoriyaning UUID identifikatori' })
  @IsUUID('all', {
    message: "Kategoriya ID to'g'ri UUID formatida bo'lishi kerak",
  })
  category_id: string;
}
