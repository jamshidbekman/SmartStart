import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Roles {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

@Entity({ name: 'staffs' })
export class Staff {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: 'admin', enum: Roles })
  role?: string;
}
