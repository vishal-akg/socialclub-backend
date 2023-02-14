import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { SqsConfig, SqsModule } from '@nestjs-packages/sqs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsSdkModule } from 'nest-aws-sdk';
import * as joi from 'joi';
import { MediaModule } from './media/media.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { FollowModule } from './follow/follow.module';
import { FeedsModule } from './feeds/feeds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
      validationSchema: joi.object({
        AWS_REGION: joi.string().required(),
        AWS_SQS_ENDPOINT: joi.string().required(),
        AWS_ACCOUNT_NUMBER: joi.string().required(),
        AWS_ACCESS_KEY_ID: joi.string().required(),
        AWS_SECRET_ACCESS_KEY: joi.string().required(),
        MYSQL_HOST: joi.string().required(),
        MYSQL_PORT: joi.number().required(),
        MYSQL_USERNAME: joi.string().required(),
        MYSQL_PASSWORD: joi.string().required(),
        MYSQL_DATABASE: joi.string().required(),
        MAX_MEDIA_UPLOAD_PER_USER: joi.number().required(),
        JWT_SECRET: joi.string().required(),
      }),
    }),
    SqsModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new SqsConfig({
          region: configService.get('AWS_REGION'),
          endpoint: configService.get('AWS_SQS_ENDPOINT'),
          accountNumber: configService.get('AWS_ACCOUNT_NUMBER'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
        });
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: +configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          console.log(configService.get('AWS_ACCESS_KEY_ID'));
          return {
            region: configService.get('AWS_REGION'),
            credentials: {
              accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
              secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
            },
            signatureVersion: 'v4',
          };
        },
      },
    }),
    MediaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    FollowModule,
    FeedsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true }),
    },
  ],
})
export class AppModule {}
