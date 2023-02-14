import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SocialProvider } from '../enums/social-provider.enum';
import { User } from './user.entity';

@Entity({ name: 'social_links' })
export class SocialLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SocialProvider })
  provider: SocialProvider;

  @Column()
  url: string;

  @ManyToOne(() => User)
  user: User;
}
