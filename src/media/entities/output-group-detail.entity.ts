import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OutputGroup } from './output-group.entity';

@Entity({ name: 'output_group_details' })
export class OutputGroupDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @ManyToOne(() => OutputGroup, (outputGroup) => outputGroup.outputGroupDetails)
  outputGroup: OutputGroup;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
