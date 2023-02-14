import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import * as cookie from 'cookie';
import { filter, from, map, Observable, tap } from 'rxjs';
import { WsGuard } from 'src/auth/guards/ws-auth.guard';
import SocketWithUser from 'src/common/interfaces/socket-with-user.interface';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({
  namespace: 'user',
  transports: ['polling', 'websocket'],
  cors: {
    origin: /^(https:\/\/([^\.]*\.)?socialclub.devwithvishal\.com)$/i,
    credentials: true,
  },
})
export class UserEventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(client.handshake.headers.cookie);
    if (!client.handshake.headers.cookie) {
      return client.disconnect();
    }
    const { Authentication } = cookie.parse(client.handshake.headers?.cookie);
    const user = await this.authService.verifyToken(Authentication);

    if (!user) {
      client.disconnect();
    } else {
      client.join(`private-${user.id}`);
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('user:updated')
  async handleUserUpdate(
    @ConnectedSocket() client: SocketWithUser,
  ): Promise<Observable<WsResponse<any>>> {
    return this.usersService.updated$.pipe(
      tap(console.log),
      filter((data) => data.user.id === client.user.id),
      map((data) => ({ event: 'user:updated', data })),
    );
  }
}
