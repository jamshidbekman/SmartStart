import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'subcategories' })
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'uuid' })
  category_id: string;
}
