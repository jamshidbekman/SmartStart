import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('increment')
  id: number;

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
