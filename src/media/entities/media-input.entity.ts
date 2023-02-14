import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AudioInput } from './audio-input.entity';
import { Media } from './media.entity';
import { VideoInput } from './video-input.entity';

@Entity({ name: 'media-inputs' })
export class MediaInput {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bucket: string;

  @Column()
  key: string;

  @Column()
  filename: string;

  @OneToOne(() => Media, (media) => media.input)
  @JoinColumn()
  media: Media;

  @OneToMany(() => AudioInput, (audioInput) => audioInput.mediaInput, {
    cascade: ['insert', 'remove', 'update'],
    eager: true,
  })
  audioInputs: AudioInput[];

  @OneToMany(() => VideoInput, (videoInput) => videoInput.mediaInput, {
    cascade: ['insert', 'remove', 'update'],
    eager: true,
  })
  videoInputs: VideoInput[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
