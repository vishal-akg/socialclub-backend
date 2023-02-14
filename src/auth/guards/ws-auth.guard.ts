import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import * as cookie from 'cookie';
import { AuthService } from '../auth.service';
import { User } from 'src/users/entities/user.entity';
import { WsException } from '@nestjs/websockets';
import SocketWithUser from 'src/common/interfaces/socket-with-user.interface';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const client: SocketWithUser = context
        .switchToWs()
        .getClient<SocketWithUser>();
      const { Authentication } = cookie.parse(client.handshake.headers.cookie);
      if (!Authentication) {
        return Boolean(null);
      }
      const user: User = await this.authService.verifyToken(Authentication);
      client.user = user;
      return Boolean(user);
    } catch (error) {
      throw new WsException(error.message);
    }
  }
}
