import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Media } from './media.entity';
import { OutputGroupDetail } from './output-group-detail.entity';

@Entity({ name: 'output_groups' })
export class OutputGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  bucket: string;

  @Column()
  key: string;

  @Column()
  duration: number;

  @ManyToOne(() => Media)
  media: Media;

  @OneToMany(
    () => OutputGroupDetail,
    (outputGroupDetail) => outputGroupDetail.outputGroup,
    {
      cascade: ['insert', 'remove', 'update'],
      eager: true,
    },
  )
  outputGroupDetails: OutputGroupDetail[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
