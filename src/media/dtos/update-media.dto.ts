import {} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateMediaDto } from './create-media.dto';

export class UpdateMediaDto extends PartialType(
  OmitType(CreateMediaDto, ['uploader']),
) {}
