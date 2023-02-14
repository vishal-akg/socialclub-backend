import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { MediaStatus } from '../enums/media-status.enum';
import { MediaInput } from './media-input.entity';
import { MediaThumbnail } from './media-thumbnail.entity';
import { OutputGroup } from './output-group.entity';

@Entity({ name: 'media' })
export class Media {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'job' })
  job: string;

  @ManyToOne(() => User)
  @Exclude()
  uploader: User;

  @Column({
    type: 'enum',
    enum: MediaStatus,
    default: MediaStatus.PROGRESSING,
  })
  status: MediaStatus;

  @OneToOne(() => MediaInput, (input) => input.media, {
    cascade: ['insert', 'remove', 'update'],
  })
  input: MediaInput;

  @OneToMany(() => OutputGroup, (outputGroup) => outputGroup.media, {
    cascade: ['insert', 'remove', 'update'],
    eager: false,
  })
  outputGroups: OutputGroup[];

  @OneToMany(() => MediaThumbnail, (mediaThumbnail) => mediaThumbnail.media, {
    cascade: ['insert', 'remove', 'update'],
    eager: false,
  })
  thumbnails: MediaThumbnail[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
