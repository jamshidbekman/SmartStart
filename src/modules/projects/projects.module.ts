import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), UsersModule, CategoryModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersService, CategoryService],
})
export class ProjectsModule {}
