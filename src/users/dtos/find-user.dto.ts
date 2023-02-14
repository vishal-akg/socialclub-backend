import { IsNotEmpty } from 'class-validator';

export class FindUser {
  @IsNotEmpty()
  id: number;
}
