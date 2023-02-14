import { Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';

export default interface SocketWithUser extends Socket {
  user: User;
}
