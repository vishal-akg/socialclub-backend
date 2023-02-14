import { Controller, Get, Req, Query } from '@nestjs/common';
import { PaginationParams } from 'src/common/dtos/pagination.dto';
import RequestWithUser from 'src/common/interfaces/request-with-user.interface';
import { FeedsService } from './feeds.service';

@Controller('feeds')
export class FeedsController {
  constructor(private feedsService: FeedsService) {}

  @Get()
  async getUserFeed(
    @Req() req: RequestWithUser,
    @Query() paginationParams: PaginationParams,
  ) {
    return this.feedsService.getUserFeed(req.user, paginationParams);
  }
}
