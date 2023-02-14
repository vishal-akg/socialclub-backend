import { Body, Req, Controller, Get, Param, Post, Query } from '@nestjs/common';
import RequestWithUser from 'src/common/interfaces/request-with-user.interface';
import { GetSignedUrlDto } from './dtos/get-signed-url.dto';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get('signed-url')
  getSignedUrl(
    @Req() req: RequestWithUser,
    @Query() getSignedUrlDto: GetSignedUrlDto,
  ) {
    return this.mediaService.getSignedUrl(req.user, getSignedUrlDto);
  }

  @Get(':id')
  async getMedia(@Param('id') id: string) {
    return this.mediaService.find(id);
  }
}
