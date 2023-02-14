import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Comment)
  parent: Comment;

  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
