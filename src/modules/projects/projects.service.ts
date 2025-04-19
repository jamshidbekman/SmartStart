import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getAllProjects(
    status: string,
    limit: number,
    page: number,
    category: string,
    search: string,
  ) {
    const query = this.projectRepository
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
      ]);

    const situations = [
      'active',
      'waiting',
      'successful',
      'failed',
      'canceled',
    ];

    if (status !== undefined && situations.includes(status)) {
      query.where('project.status = :status', { status: status });
    } else if (status !== undefined) {
      throw new BadRequestException('Bunday status mavjud emas');
    }

    const projects = await query
      .take(limit)
      .skip((page - 1) * limit)
      .getMany();

    if (projects.length < 1) throw new NotFoundException('Loyihalar topilmadi');

    const count = await query.getCount();
    return {
      message: `${count} ta loyihalar topildi`,
      totalItems: count,
      totalPages: count / limit,
      currentPage: Number(page),
      pageSize: Number(limit),
      data: projects,
    };
  }

  async getProject(id: number) {
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
      .where('project.id = :id', { id: id })
      .getOne();

    if (!project) throw new NotFoundException('Loyiha topilmadi');

    return {
      message: 'Loyiha topildi',
      data: project,
    };
  }

  async moderateProject(id: number) {
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
      .where('project.id = :id', { id: id })
      .getOne();

    if (!project) throw new NotFoundException('Loyiha topilmadi');

    if (project.is_moderate)
      return {
        message: 'Bu loyiha allaqachon moderatsiyadan o‘tgan',
        data: project,
      };

    project.is_moderate = true;
    project.status = 'active';
    await this.projectRepository.save(project);

    return {
      message: 'Loyiha muvaffaqiyatli moderatsiyadan o‘tkazildi',
      data: project,
    };
  }
}
