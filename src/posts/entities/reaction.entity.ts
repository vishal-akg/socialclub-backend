import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserReaction } from '../enums/user-reaction.enum';
import { Post } from './post.entity';

@Entity({ name: 'reactions' })
@Unique('user_reaction_unique', ['user', 'post'])
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Post)
  post: Post;

  @Column({ type: 'enum', enum: UserReaction })
  type: UserReaction;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
