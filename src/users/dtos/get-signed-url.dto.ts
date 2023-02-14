import { IsEnum, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export enum PictureType {
  AVATAR = 'avatar',
  COVER = 'cover',
}

export class GetSignedUrlDto {
  @IsNotEmpty()
  filename: string;

  @IsNotEmpty()
  filetype: string;

  @IsNotEmpty()
  @IsNumberString()
  filesize: number;

  @IsNotEmpty()
  @IsNumberString()
  x: number;

  @IsNotEmpty()
  @IsNumberString()
  y: number;

  @IsNotEmpty()
  @IsNumberString()
  width: number;

  @IsNotEmpty()
  @IsNumberString()
  height: number;

  @IsNotEmpty()
  @IsEnum(PictureType)
  type: PictureType;
}
