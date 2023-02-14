import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MediaInput } from './media-input.entity';

@Entity({ name: 'video-inputs' })
export class VideoInput {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bit_depth' })
  bitDepth: number;

  @Column()
  codec: string;

  @Column({ name: 'color_format' })
  colorFormat: string;

  @Column({ name: 'frame_rate' })
  frameRate: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column({ name: 'interlace_mode' })
  interlaceMode: string;

  @ManyToOne(() => MediaInput)
  @JoinColumn({ name: 'media_input' })
  mediaInput: MediaInput;
}
