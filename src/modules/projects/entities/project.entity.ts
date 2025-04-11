import { Category } from 'src/modules/category/entities/category.entity';
import { Subcategory } from 'src/modules/category/entities/subcategory.entity';
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

  @ManyToOne(() => Subcategory, (category) => category.projects)
  subcategory: Subcategory;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  funding_goal: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    nullable: true,
  })
  current_amount?: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'date' })
  deadline: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'waiting', 'successful', 'failed', 'canceled'],
    default: 'waiting',
  })
  status?: 'active' | 'waiting' | 'successful' | 'failed' | 'canceled';

  @Column({ default: false, nullable: true })
  is_moderate: boolean;
}
