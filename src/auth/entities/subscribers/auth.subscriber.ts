import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Auth } from '../auth.entity';

@EventSubscriber()
export class AuthSubscriber implements EntitySubscriberInterface<Auth> {
  constructor(datasource: DataSource) {
    datasource.subscribers.push(this);
  }

  listenTo(): string | Function {
    return Auth;
  }

  async beforeInsert(event: InsertEvent<Auth>): Promise<any> {
    event.entity.password = await bcrypt.hash(event.entity.password, 10);
  }

  async beforeUpdate(event: UpdateEvent<Auth>): Promise<any> {
    if (event.entity.password) {
      event.entity.password = await bcrypt.hash(event.entity.password, 10);
    }
  }
}
