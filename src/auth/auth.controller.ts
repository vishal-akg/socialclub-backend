import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  Res,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import RequestWithUser from 'src/common/interfaces/request-with-user.interface';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { Public } from './metadata/public.metadata';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const { user, access_token } = this.authService.login(req.user);
    res.cookie('Authentication', access_token, { maxAge: 96000000 });
    return user;
  }

  @Public()
  @Post('register')
  async register(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const auth = await this.authService.signup(signupDto);
    const { user, access_token } = this.authService.login(auth.user);
    res.cookie('Authentication', access_token, { maxAge: 96000000 });
    return user;
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('Authentication', undefined, { maxAge: 0 });
    return null;
  }
}
