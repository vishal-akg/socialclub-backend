import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';

export class CreateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsDateString()
  dob: string;

  @IsArray()
  roles: string[];
}
