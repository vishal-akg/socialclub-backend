import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationParams } from 'src/common/dtos/pagination.dto';
import { Follow } from 'src/follow/entities/follow.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class FeedsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async getUserFeed(user: User, paginationParams: PaginationParams) {
    const { limit, offset } = paginationParams;
    const followings = await this.followRepository.find({
      where: { followee: { id: user.id } },
      relations: { follower: true },
    });

    return this.postRepository.find({
      where: {
        author: {
          id: In(followings.map((following) => following.follower.id)),
        },
      },
      relations: { author: true },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: offset,
    });
  }
}
