import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly usersService: UsersService,
    private readonly categoryService: CategoryService,
  ) {}

  async createProject(createProjectDto: CreateProjectDto) {
    const findUser = await this.usersService.getUserById(
      createProjectDto.user_id,
    );

    if (!findUser) throw new BadRequestException('Foydalanuvchi topilmadi');

    const findCategory = await this.categoryService.getSubcategoryById(
      createProjectDto.subcategory_id,
    );

    if (!findCategory) throw new BadRequestException('Kategoriya topilmadi');

    const createProject = this.projectRepository.create({
      ...createProjectDto,
      user: { id: createProjectDto.user_id },
      subcategory: { id: createProjectDto.subcategory_id },
    });
    const savedProject = await this.projectRepository.save(createProject);

    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user')
      .leftJoinAndSelect('project.subcategory', 'subcategory')
      .leftJoinAndSelect('subcategory.category', 'category')
      .select([
        'project.id',
        'project.title',
        'project.description',
        'project.funding_goal',
        'project.current_amount',
        'project.created_at',
        'project.deadline',
        'project.status',
        'project.is_moderate',
        'user.id',
        'user.fullname',
        'user.email',
        'subcategory.id',
        'subcategory.name',
        'subcategory.category',
      ])
      .where('project.id = :id', { id: savedProject.id })
      .getOne();
    return {
      message: 'Loyiha muvaffaqqiyatli yaratildi',
      data: project,
    };
  }
}
