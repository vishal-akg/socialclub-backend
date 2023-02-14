import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class AddFollowerDto {
  @IsNotEmpty()
  @IsNumberString()
  followerId: number;
}
