import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Media } from './media.entity';

@Entity({ name: 'media_thumnbails' })
export class MediaThumbnail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  index: number;

  @Column()
  uri: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @ManyToOne(() => Media)
  media: Media;
}
