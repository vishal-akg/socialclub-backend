import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: 'https://www.socialclub.devwithvishal.com',
      //origin: /^(https:\/\/([^\.]*\.)?socialclub.devwithvishal\.com)$/i,
    },
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
