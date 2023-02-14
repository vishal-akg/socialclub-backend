import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from 'src/follow/entities/follow.entity';
import { Post } from 'src/posts/entities/post.entity';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Follow])],
  controllers: [FeedsController],
  providers: [FeedsService],
})
export class FeedsModule {}
