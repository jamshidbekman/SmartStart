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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
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
}
