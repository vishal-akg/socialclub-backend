import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@nestjs-packages/sqs';
import { MediaJobCompletionHandler } from './handlers/media-job-completion.handler';
import { MediaEventsGateway } from './media-events.gateway';
import { Media } from './entities/media.entity';
import { OutputGroup } from './entities/output-group.entity';
import { OutputGroupDetail } from './entities/output-group-detail.entity';
import { MediaInput } from './entities/media-input.entity';
import { AudioInput } from './entities/audio-input.entity';
import { VideoInput } from './entities/video-input.entity';
import { MediaService } from './media.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { MediaController } from './media.controller';
import { MediaThumbnail } from './entities/media-thumbnail.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([
      Media,
      OutputGroup,
      OutputGroupDetail,
      MediaInput,
      AudioInput,
      VideoInput,
      MediaThumbnail,
    ]),
    SqsModule.registerQueue({
      name: 'SocialClubMediaConvertJobCompletion',
      type: SqsQueueType.All,
      consumerOptions: {
        shouldDeleteMessages: true,
      },
    }),
    AwsSdkModule.forFeatures([S3]),
  ],
  providers: [MediaJobCompletionHandler, MediaEventsGateway, MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
