import {
  Controller,
  Req,
  Body,
  Post,
  Delete,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { PaginationParams } from 'src/common/dtos/pagination.dto';
import RequestWithUser from 'src/common/interfaces/request-with-user.interface';
import { AddFollowerDto } from './dtos/add-follower.dto';
import { IsFollowingDto } from './dtos/is-following.dto';
import { FollowService } from './follow.service';

@Controller('followings')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Get('whom-to-follow')
  async whomToFollow(
    @Req() req: RequestWithUser,
    @Query() paginationParams: PaginationParams,
  ) {
    return this.followService.whomToFollow(req.user, paginationParams);
  }

  @Get()
  async getFollowings(
    @Req() req: RequestWithUser,
    @Query() paginationParams: PaginationParams,
  ) {
    return this.followService.getFollowings(req.user, paginationParams);
  }

  @Get('exist')
  async isFollowing(@Query() isFollowingDto: IsFollowingDto) {
    return this.followService.isFollowing(isFollowingDto);
  }

  @Post()
  async addFollowing(
    @Req() req: RequestWithUser,
    @Body() addFollowerDto: AddFollowerDto,
  ) {
    return this.followService.addFollowing(req.user, addFollowerDto.followerId);
  }

  @Delete(':id')
  async deleteFollowing(@Req() req: RequestWithUser, @Param('id') id: number) {
    return this.followService.deleteFollowing(req.user, id);
  }
}
