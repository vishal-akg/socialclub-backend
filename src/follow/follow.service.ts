import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { PaginationParams } from 'src/common/dtos/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource, In, Not, Repository } from 'typeorm';
import { IsFollowingDto } from './dtos/is-following.dto';
import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow) private readonly repository: Repository<Follow>,
    private dataSource: DataSource,
    private usersService: UsersService,
  ) {}

  async getFollowings(user: User, paginationParams: PaginationParams) {
    const { offset, limit } = paginationParams;
    return this.repository.find({
      where: { followee: { id: user.id } },
      relations: { follower: true },
      skip: offset,
      take: limit,
    });
  }

  async isFollowing(isFollowingDto: IsFollowingDto) {
    const { followee, follower } = isFollowingDto;
    return this.repository.findOne({
      where: { followee: { id: followee }, follower: { id: follower } },
    });
  }

  async addFollowing(user: User, followerId: number) {
    const follower = await this.usersService.findOne({ id: followerId });
    const relationship = this.repository.create({
      followee: user,
      follower: follower,
    });
    return this.repository.save(relationship);
  }

  async deleteFollowing(user: User, id: number) {
    const relationship = await this.repository.findOneOrFail({
      where: { id },
      relations: { followee: true, follower: true },
    });
    if (relationship.followee.id !== user.id) {
      throw new ForbiddenException("You cannot act on someone else's behalf");
    }
    return this.repository.remove(relationship);
  }

  async whomToFollow(user: User, paginationParams: PaginationParams) {
    const { offset, limit } = paginationParams;
    const response = await this.dataSource.query(
      `SELECT * FROM users WHERE users.id != ? AND users.id NOT IN (SELECT followerId FROM follow WHERE followeeId = ?) LIMIT ? OFFSET ?`,
      [user.id, user.id, limit, offset],
    );
    return response.map((user: any) => plainToInstance(User, user));
  }
}
