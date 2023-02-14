import { Activity } from 'src/common/enums/activity.enum';
import { Audience } from 'src/common/enums/audience.enum';
import { Media } from 'src/media/entities/media.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @OneToOne(() => Media)
  @JoinColumn({ name: 'media' })
  media: Media;

  @Column()
  uri: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  duration: number;

  @Column({ type: 'text' })
  thumbnail: string;

  @Column()
  thumbnailIndex: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column({ type: 'enum', enum: Audience, default: Audience.ALL })
  audience: Audience;

  @Column({ type: 'enum', enum: Activity, default: Activity.ALLOWED })
  activity: Activity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
