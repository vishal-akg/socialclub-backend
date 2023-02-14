import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserReaction } from '../enums/user-reaction.enum';

export class AddReactionDto {
  @IsNotEmpty()
  @IsEnum(UserReaction)
  type: UserReaction;
}
