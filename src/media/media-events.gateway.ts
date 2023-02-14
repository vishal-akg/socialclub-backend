import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  WsResponse,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import * as cookie from 'cookie';
import { Socket, Server } from 'socket.io';
import { Observable, tap, from, map, filter } from 'rxjs';
import { MediaJobCompletionHandler } from './handlers/media-job-completion.handler';
import { AuthService } from 'src/auth/auth.service';
import SocketWithUser from 'src/common/interfaces/socket-with-user.interface';
import { WsGuard } from 'src/auth/guards/ws-auth.guard';

@WebSocketGateway({
  namespace: 'media',
  transports: ['polling', 'websocket'],
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class MediaEventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly queueService: MediaJobCompletionHandler,
    private authService: AuthService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
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
  @SubscribeMessage('job:submitted')
  async handleMediaSubmittedEvents(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody('id') id: string,
  ): Promise<Observable<WsResponse<any>>> {
    return this.queueService.submitted$.pipe(
      tap(console.log),
      filter(
        (message) =>
          message.userMetadata.id === id &&
          message.userMetadata.uploader === client.user.id,
      ),
      map((message) => ({ event: 'job:submitted', data: message })),
    );
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('job:completed')
  async handleMediaCompletedEvents(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody('id') id: string,
  ): Promise<Observable<WsResponse<any>>> {
    return this.queueService.completed$.pipe(
      tap(console.log),
      filter(
        (message) =>
          message.userMetadata.id === id &&
          message.userMetadata.uploader === client.user.id,
      ),
      map((message) => ({ event: 'job:completed', data: message })),
    );
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('job:error')
  async handleMediaErrorEvents(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody('id') id: string,
  ): Promise<Observable<WsResponse<any>>> {
    return this.queueService.error$.pipe(
      tap(console.log),
      filter(
        (message) =>
          message.userMetadata.id === id &&
          message.userMetadata.uploader === client.user.id,
      ),
      map((message) => ({ event: 'job:error', data: message })),
    );
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('job:status')
  async handleMediaStatusUpdateEvents(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody('id') id: string,
  ): Promise<Observable<WsResponse<any>>> {
    return this.queueService.status$.pipe(
      tap(console.log),
      filter(
        (message) =>
          message.userMetadata.id === id &&
          message.userMetadata.uploader === client.user.id,
      ),
      map((message) => ({ event: 'job:status', data: message })),
    );
  }
}
