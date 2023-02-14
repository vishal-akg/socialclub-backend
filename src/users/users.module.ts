import { SqsModule, SqsQueueType } from '@nestjs-packages/sqs';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';
import { AuthModule } from 'src/auth/auth.module';
import { Post } from 'src/posts/entities/post.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { ProfilePictureJobCompletionHandler } from './handlers/profile-picutre-job-complete.handler';
import { RolesService } from './roles.services';
import { UserEventsGateway } from './user-events.gateway';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, Role, Post]),
    SqsModule.registerQueue({
      name: 'SocialClubProfilePictureJobComplete',
      type: SqsQueueType.All,
      consumerOptions: {
        shouldDeleteMessages: true,
      },
    }),
    AwsSdkModule.forFeatures([S3]),
  ],
  controllers: [UsersController],
  providers: [
    ProfilePictureJobCompletionHandler,
    UsersService,
    RolesService,
    UserEventsGateway,
  ],
  exports: [UsersService, RolesService],
})
export class UsersModule {}
