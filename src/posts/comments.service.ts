import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationParams } from 'src/common/dtos/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AddCommentDto } from './dtos/add-comment.dto';
import { Comment } from './entities/comment.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  async addComment(user: User, postId: string, addCommentDto: AddCommentDto) {
    const post = await this.postsRepository.findOneByOrFail({ id: postId });

    const comment = this.commentsRepository.create({
      content: addCommentDto.content,
      author: user,
      post,
    });
    return this.commentsRepository.save(comment);
  }

  async getAllComments(postId: string, paginationParams: PaginationParams) {
    const { offset, limit } = paginationParams;
    return this.commentsRepository.find({
      where: { post: { id: postId } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }
}
