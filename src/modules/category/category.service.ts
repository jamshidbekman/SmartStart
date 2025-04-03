import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ILike, Repository } from 'typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const findCategoryByName = await this.categoryRepository.findOne({
      where: { name: ILike(createCategoryDto.name) },
    });

    if (findCategoryByName)
      throw new ConflictException('Kategoriya nomi allaqachon mavjud');

    const category = this.categoryRepository.create(createCategoryDto);
    const createdCategory = await this.categoryRepository.save(category);

    return {
      message: 'Kategoriya muvaffaqqiyatli yaratildi',
      data: {
        ...createdCategory,
      },
    };
  }
  async createSubcategory(createSubcategoryDto: CreateSubcategoryDto) {
    const findSubcategoryByName = await this.subcategoryRepository.findOne({
      where: { name: ILike(createSubcategoryDto.name) },
    });

    if (findSubcategoryByName)
      throw new ConflictException('Subkategoriya nomi allaqachon mavjud');

    const findCategoryById = await this.categoryRepository.findOne({
      where: { id: createSubcategoryDto.category_id },
    });

    if (!findCategoryById)
      throw new NotFoundException(
        'Subkategoriyani biriktirish uchun kategoriya topilmadi',
      );

    const category = this.subcategoryRepository.create({
      ...createSubcategoryDto,
      category: { id: createSubcategoryDto.category_id },
    });
    const createCategory = await this.subcategoryRepository.save(category);
    const createdCategory = await this.subcategoryRepository.findOne({
      where: { id: createCategory.id },
      relations: ['category'],
    });

    return {
      message: 'Subkategoriya muvaffaqqiyatli yaratildi',
      data: {
        ...createdCategory,
      },
    };
  }
  async getAllCategories() {
    const categories = await this.categoryRepository.find({
      relations: ['subcategories'],
    });

    if (categories.length < 1)
      throw new BadRequestException('Kategoriyalar mavjud emas');
    return {
      message: `${categories.length} ta kategoriya topildi`,
      data: categories,
    };
  }
}
