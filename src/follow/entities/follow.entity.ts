import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique('follower_unique', ['followee', 'follower'])
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  followee: User;

  @ManyToOne(() => User)
  follower: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
