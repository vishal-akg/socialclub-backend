import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { numericUniqueId } from 'src/common/helpers/unique-id.generator';
import { RolesService } from 'src/users/roles.services';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dtos/signup.dto';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly repository: Repository<Auth>,
    private jwtService: JwtService,
    private rolesService: RolesService,
    private usersService: UsersService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { name, email, password, dob, gender } = signupDto;
    const id = numericUniqueId();
    const roles = await this.rolesService.find({ name: 'user' });

    const auth = this.repository.create({
      password,
      email,
      user: {
        id,
        name,
        dob,
        gender,
        roles,
      },
    });

    return this.repository.save(auth);
  }

  async validateUser(email: string, pass: string) {
    const auth = await this.repository.findOne({ where: { email } });
    console.log(auth);
    if (auth && (await bcrypt.compare(pass, auth.password))) {
      return auth.user;
    }
    return null;
  }

  async verifyToken(token: string) {
    const payload = this.jwtService.verify(token);
    const user = await this.usersService.findOne({ id: payload.id });
    if (!user) {
      return null;
    }
    return user;
  }

  login(user: any) {
    const payload = { id: user.id, roles: user.roles };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
