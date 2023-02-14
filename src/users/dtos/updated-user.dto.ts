import { IsNotEmpty, ValidateNested } from 'class-validator';
import { User } from '../entities/user.entity';

export class UpdatedUserDto {
  @ValidateNested({ each: true })
  @IsNotEmpty()
  modifiedFields: string[];

  @IsNotEmpty()
  user: User;
}
