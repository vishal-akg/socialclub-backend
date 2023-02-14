import { IsNotEmpty, IsNumberString } from 'class-validator';

export class IsFollowingDto {
  @IsNotEmpty()
  @IsNumberString()
  followee: number;

  @IsNotEmpty()
  @IsNumberString()
  follower: number;
}
