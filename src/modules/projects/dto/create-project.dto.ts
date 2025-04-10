import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsUUID,
  Min,
  IsNotEmpty,
  IsDate,
  IsNumber,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Loyihani yaratgan foydalanuvchining UUID identifikatori',
  })
  @IsNotEmpty({ message: 'User id kiritilishi kerak' })
  @IsUUID('4', {
    message: "Foydalanuvchi ID to'g'ri UUID formatida bo'lishi kerak",
  })
  user_id: string;

  @ApiProperty({
    description:
      "Loyihaning tegishli bo'lgan kategoriyaning UUID identifikatori",
  })
  @IsNotEmpty({ message: 'Kategoriya tanlanishi kerak' })
  @IsUUID('4', {
    message: "Kategoriya ID to'g'ri UUID formatida bo'lishi kerak",
  })
  subcategory_id: string;

  @ApiProperty({ description: 'Loyihaning nomi' })
  @IsString({ message: "Loyiha nomi stringda bo'lishi kerak" })
  @IsNotEmpty({ message: "Loyiha nomi bo'sh bo'lmasligi kerak" })
  title: string;

  @ApiProperty({ description: 'Loyihaning batafsil tavsifi' })
  @IsString({ message: "Loyiha tavsifi stringda bo'lishi kerak" })
  @IsNotEmpty({ message: "Loyiha tavsifi bo'sh bo'lmasligi kerak" })
  description: string;

  @ApiProperty({ description: 'Loyiha uchun belgilangan moliyaviy maqsad' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Moliyaviy maqsad raqamlarda kiritilishi kerak' })
  @IsNotEmpty({ message: 'Moliyaviy maqsad kiritlishi kerak' })
  @Min(0, { message: "Moliyaviy maqsad manfiy bo'lishi mumkin emas" })
  funding_goal: number;

  @ApiProperty({ description: "Hozirda to'plangan mablag'" })
  @Type(() => Number)
  @IsNumber({}, { message: "To'plangan mablag' raqamlarda kiritilishi kerak" })
  @IsNotEmpty({ message: "To'plangan mablag' kiritlishi kerak" })
  @Min(0, { message: "To'plangan mablag' manfiy bo'lishi mumkin emas" })
  current_amount?: number;

  @Type(() => Date)
  @ApiProperty({ description: 'Loyihaning tugash sanasi' })
  @IsNotEmpty({ message: 'Loyiha tugash sanasi kiritilishi kerak' })
  @IsDate({ message: "Sanani to'g'ri formatda kiriting" })
  deadline: Date;

  @ApiProperty({
    description: 'Loyihaning holati',
    enum: ['active', 'successful', 'failed', 'canceled'],
  })
  status?: 'active' | 'successful' | 'failed' | 'canceled';
}
