import { IsNumber } from 'class-validator';

export class FindRole {
  @IsNumber()
  id: number;

  @IsNumber()
  name: string;
}
