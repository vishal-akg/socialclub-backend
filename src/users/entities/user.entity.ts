import { Gender } from 'src/common/enums/gender.enum';
import { Post } from 'src/posts/entities/post.entity';
import {
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { UserStatus } from '../enums/user-status.enum';
import { Role } from './role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  cover: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @ManyToMany(() => Role, {
    eager: true,
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
