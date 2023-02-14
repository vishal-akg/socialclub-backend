import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MediaInput } from './media-input.entity';

@Entity({ name: 'audio-inputs' })
export class AudioInput {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channels: number;

  @Column()
  language: string;

  @Column({ name: 'sample_rate' })
  sampleRate: number;

  @ManyToOne(() => MediaInput)
  @JoinColumn({ name: 'media_input' })
  mediaInput: MediaInput;
}
