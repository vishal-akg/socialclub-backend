import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { MediaStatus } from '../enums/media-status.enum';

export class CreateMediaDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  job: string;

  @IsNotEmpty()
  @IsNumber()
  uploader: number;

  @IsNotEmpty()
  @IsEnum(MediaStatus)
  status: MediaStatus;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OutputGroupDto)
  outputGroups?: OutputGroupDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMediaInputDto)
  input?: CreateMediaInputDto;

  @ValidateNested({ each: true })
  @Type(() => ThumbnailDto)
  thumbnails?: ThumbnailDto[];
}

class OutputGroupDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  bucket: string;

  @IsNotEmpty()
  key: string;

  @IsNumber()
  duration: number;

  @ValidateNested({ each: true })
  @Type(() => OutputGroupDetailDto)
  outputGroupDetails: OutputGroupDetailDto[];
}

class OutputGroupDetailDto {
  @IsNotEmpty()
  @IsNumber()
  width: number;

  @IsNotEmpty()
  @IsNumber()
  height: number;
}

export class CreateMediaInputDto {
  @IsNotEmpty()
  bucket: string;

  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  filename: string;

  @ValidateNested({ each: true })
  @Type(() => VideoInputDto)
  videoInputs: VideoInputDto[];

  @ValidateNested({ each: true })
  @Type(() => AudioInputDto)
  audioInputs: AudioInputDto[];
}

class VideoInputDto {
  @IsNotEmpty()
  codec: string;

  @IsNotEmpty()
  width: number;

  @IsNotEmpty()
  height: number;

  @IsNotEmpty()
  frameRate: number;

  @IsNotEmpty()
  colorFormat: string;

  @IsNotEmpty()
  bitDepth: number;

  @IsNotEmpty()
  interlaceMode: string;
}

class AudioInputDto {
  @IsNotEmpty()
  channels: number;

  @IsNotEmpty()
  language: string;

  @IsNotEmpty()
  sampleRate: number;
}

class ThumbnailDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  uri: string;

  @IsNotEmpty()
  width: number;

  @IsNotEmpty()
  height: number;
}
