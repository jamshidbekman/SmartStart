import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

@ApiTags('Kategoriyalar')
@Controller('category')
@UseGuards(AuthGuard, RoleGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(Role.ADMIN)
  @Post('create')
  @ApiOperation({ summary: 'Kategoriya yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Kategoriya muvaffaqqiyatli yaratildi',
    schema: {
      example: {
        message: 'Kategoriya muvaffaqqiyatli yaratildi',
        data: {
          id: 1,
          name: 'Yangi kategoriya',
          text: 'tavsif',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Kategoriya nomi allaqachon mavjud',
    type: ConflictException,
  })
  async CreateCategoryController(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @Roles(Role.ADMIN)
  @Post('sub/create')
  @ApiOperation({ summary: 'Subkategoriya yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Subkategoriya muvaffaqqiyatli yaratildi',
    schema: {
      example: {
        message: 'Subkategoriya muvaffaqqiyatli yaratildi',
        data: {
          id: 1,
          name: 'Yangi subkategoriya',
          text: 'tavsif',
          category: {
            id: 1,
            name: 'Yangi kategoriya',
            text: 'tavsif',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Subkategoriya nomi allaqachon mavjud',
    type: ConflictException,
  })
  @ApiResponse({
    status: 404,
    description: 'Kategoriya topilmadi',
    type: NotFoundException,
  })
  async CreateSubcategoryController(
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ) {
    return await this.categoryService.createSubcategory(createSubcategoryDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Barcha kategoriyalarni olish' })
  @ApiResponse({
    status: 200,
    description: "Kategoriya va subkategoriyalar ro'yxati",
    schema: {
      example: {
        message: '3 ta kategoriya topildi',
        data: [
          {
            id: 1,
            name: 'Kategoriya 1',
            text: 'tavsif',
            subcategories: [
              { id: 1, name: 'Subkategoriya 1', text: 'tavsif' },
              { id: 2, name: 'Subkategoriya 2', text: 'tavsif' },
            ],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Kategoriyalar mavjud emas',
    type: BadRequestException,
  })
  async GetAllCategories() {
    return await this.categoryService.getAllCategories();
  }
}
