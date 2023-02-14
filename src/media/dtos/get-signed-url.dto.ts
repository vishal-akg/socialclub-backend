import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class GetSignedUrlDto {
  @IsNotEmpty()
  filename: string;

  @IsNotEmpty()
  filetype: string;

  @IsNotEmpty()
  @IsNumberString()
  filesize: number;
}
