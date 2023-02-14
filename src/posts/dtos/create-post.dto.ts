import { IsEnum, IsNotEmpty, IsNumber, Length } from 'class-validator';
import { Audience } from 'src/common/enums/audience.enum';
import { Activity } from 'src/common/enums/activity.enum';

export class CreatePostDto {
  @IsNotEmpty()
  mediaId: string;

  @IsNotEmpty()
  @Length(10, 100)
  title: string;

  @IsNotEmpty()
  @Length(100, 500)
  description: string;

  @IsNotEmpty()
  @IsEnum(Audience)
  audience: Audience;

  @IsNotEmpty()
  @IsEnum(Activity)
  activity: Activity;

  @IsNotEmpty()
  @IsNumber()
  thumbnailIndex: number;
}
