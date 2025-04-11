import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Loyiha yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Loyiha yaratildi',
  })
  @ApiResponse({
    status: 400,
    description: 'Validatsiya xatolari',
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  @Post('create')
  async CreateProjectController(@Body() createProjectDto: CreateProjectDto) {
    return await this.projectsService.createProject(createProjectDto);
  }

  @Get('admin/all')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Status bilan filter qilish',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Pagination uchun limit',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Pagination uchun page',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Returns list of projects with pagination info',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '25 ta loyihalar topildi' },
        totalItems: { type: 'number', example: 25 },
        totalPages: { type: 'number', example: 3 },
        currentPage: { type: 'number', example: 1 },
        pageSize: { type: 'number', example: 10 },
        data: {
          type: 'array',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Bunday status mavjud emas' })
  @ApiNotFoundResponse({ description: 'Loyihalar topilmadi' })
  async GetAllProjectsController(
    @Query('status') status: string,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    return await this.projectsService.getAllProjects(status, limit, page);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiOkResponse({
    description: 'Loyiha topildi',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Loyiha topildi' },
        data: { type: 'object' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Loyiha topilmadi' })
  async GetProjectController(@Param('id') id: number) {
    return await this.projectsService.getProject(id);
  }

  @Patch(':id/moderate')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiOkResponse({ description: 'Loyiha moderatsiyadan o‘tkazildi' })
  @ApiOkResponse({
    description: 'Bu loyiha allaqachon moderatsiyadan o‘tgan',
  })
  @ApiNotFoundResponse({ description: 'Loyiha topilmadi' })
  async moderateProject(@Param('id') id: number) {
    return await this.projectsService.moderateProject(id);
  }
}
