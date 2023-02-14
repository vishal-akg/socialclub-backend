import {
  Controller,
  Req,
  Param,
  Post,
  Body,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { PaginationParams } from 'src/common/dtos/pagination.dto';
import RequestWithUser from 'src/common/interfaces/request-with-user.interface';
import { CommentsService } from './comments.service';
import { AddCommentDto } from './dtos/add-comment.dto';
import { AddReactionDto } from './dtos/add-reaction.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService,
  ) {}

  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(req.user, createPostDto);
  }

  @Get()
  async getAll() {
    return this.postsService.find();
  }

  @Get(':id/my-reaction')
  async getMyReaction(
    @Req() req: RequestWithUser,
    @Param('id') postId: string,
  ) {
    return this.postsService.getReaction(req.user, postId);
  }

  @Post(':id/reactions')
  async addReaction(
    @Req() req: RequestWithUser,
    @Param('id') postId: string,
    @Body() addReactionDto: AddReactionDto,
  ) {
    return this.postsService.addReaction(req.user, postId, addReactionDto);
  }

  @Delete(':id/reactions/:reactionId')
  async deleteReaction(
    @Req() req: RequestWithUser,
    @Param('id') postId: string,
    @Param('reactionId') reactionId: number,
  ) {
    return this.postsService.deleteReaction(req.user, reactionId);
  }

  @Post(':id/comments')
  async addComment(
    @Req() req: RequestWithUser,
    @Param('id') postId: string,
    @Body() addCommentDto: AddCommentDto,
  ) {
    return this.commentsService.addComment(req.user, postId, addCommentDto);
  }

  @Get(':id/comments')
  async getAllComments(
    @Param('id') postId: string,
    @Query() paginationParams: PaginationParams,
  ) {
    return this.commentsService.getAllComments(postId, paginationParams);
  }
}
