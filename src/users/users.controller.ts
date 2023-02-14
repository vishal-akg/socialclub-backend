import { Controller, Get, Query, Req } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { Public } from 'src/auth/metadata/public.metadata';
import RequestWithUser from 'src/common/interfaces/request-with-user.interface';
import { GetSignedUrlDto } from './dtos/get-signed-url.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async whoAmI(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Get('profile-picture-upload-signed-url')
  async getSignedUrl(
    @Req() req: RequestWithUser,
    @Query() getSignedUrlDto: GetSignedUrlDto,
  ) {
    console.log(getSignedUrlDto);
    return this.usersService.getSignedUrl(req.user, getSignedUrlDto);
  }

  @Public()
  @Get(':id/posts')
  async getUserPosts(@Param('id') id: number) {
    return this.usersService.getUserPosts(id);
  }

  @Public()
  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.usersService.findOne({ id });
  }
}
