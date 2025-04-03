import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

@Entity({ name: 'subcategories' })
export class Subcategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'uuid' })
  category_id: string;

  @ManyToOne(() => Category, (category) => category.subcategories)
  category: Category;
}
