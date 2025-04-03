import { Category } from 'src/modules/category/entities/category.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Category, (category) => category.projects, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  category_id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  funding_goal: number;

  @Column({ type: 'int', default: 0, nullable: true })
  current_amount?: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'date' })
  deadline: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'successful', 'failed', 'canceled'],
    default: 'active',
  })
  status?: 'active' | 'successful' | 'failed' | 'canceled';
}
