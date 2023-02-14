import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class PaginationParams {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  offset: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  limit: number;
}
