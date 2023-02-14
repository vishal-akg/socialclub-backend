import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';

export class SignupDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsDateString()
  dob: string;

  @IsEnum(Gender)
  gender: Gender;
}
